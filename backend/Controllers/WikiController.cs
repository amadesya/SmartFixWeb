using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;

namespace SmartFixApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WikiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WikiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Wiki
        [HttpGet]
        public async Task<IActionResult> GetArticles()
        {
            var articles = await _context.WikiArticles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new {
                    a.Id,
                    a.Title,
                    Category = a.Category != null ? a.Category.Name : "Без категории",
                    CategorySlug = a.Category != null ? a.Category.Slug : "uncategorized",
                    a.CreatedAt,
                    AuthorName = a.Author != null ? a.Author.Name : "Аноним"
                })
                .ToListAsync();
                
            return Ok(articles);
        }

        // GET: api/Wiki/categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.WikiCategories.ToListAsync();
            return Ok(categories);
        }

        // GET: api/Wiki/category/{slug}
        [HttpGet("category/{slug}")]
        public async Task<IActionResult> GetArticlesByCategory(string slug)
        {
            var articles = await _context.WikiArticles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Where(a => a.Category != null && a.Category.Slug == slug)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new {
                    a.Id,
                    a.Title,
                    Category = a.Category.Name,
                    CategorySlug = a.Category.Slug,
                    a.CreatedAt,
                    AuthorName = a.Author != null ? a.Author.Name : "Аноним"
                })
                .ToListAsync();
                
            return Ok(articles);
        }

        // GET: api/Wiki/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticle(int id)
        {
            var article = await _context.WikiArticles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .FirstOrDefaultAsync(a => a.Id == id);
            
            if (article == null) return NotFound(new { message = "Статья не найдена" });
            
            return Ok(new {
                article.Id,
                article.Title,
                Category = article.Category != null ? article.Category.Name : "Без категории",
                CategorySlug = article.Category != null ? article.Category.Slug : "uncategorized",
                article.Body,
                article.CreatedAt,
                AuthorName = article.Author != null ? article.Author.Name : "Аноним"
            });
        }

        // POST: api/Wiki (Создание статьи)
        [Authorize(Roles = "1,2")] // Доступ только для Техника(1) и Админа(2)
        [HttpPost]
        public async Task<IActionResult> CreateArticle([FromBody] CreateWikiArticleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Body))
                return BadRequest(new { message = "Заголовок и текст статьи обязательны" });

            // Получаем ID авторизованного пользователя из токена
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int authorId))
            {
                return Unauthorized(new { message = "Не удалось определить пользователя" });
            }

            var categoryName = string.IsNullOrWhiteSpace(dto.Category) ? "Без категории" : dto.Category;
            var category = await _context.WikiCategories.FirstOrDefaultAsync(c => c.Name == categoryName);
            if (category == null)
            {
                // Создаем категорию на лету, если её еще нет
                category = new Models.WikiCategory { Name = categoryName, Slug = categoryName.ToLower().Replace(" ", "-") };
                _context.WikiCategories.Add(category);
                await _context.SaveChangesAsync();
            }

            var article = new Models.WikiArticle 
            {
                Title = dto.Title,
                CategoryId = category.Id,
                Body = dto.Body,
                CreatedAt = DateTime.UtcNow,
                AuthorId = authorId // Добавляем обязательную связь с автором
            };

            _context.WikiArticles.Add(article);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
        }

        // PUT: api/Wiki/5 (Редактирование статьи)
        [Authorize(Roles = "1,2")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticle(int id, [FromBody] UpdateWikiArticleDto dto)
        {
            var article = await _context.WikiArticles.FindAsync(id);
            if (article == null) return NotFound(new { message = "Статья не найдена" });

            if (!string.IsNullOrWhiteSpace(dto.Category))
            {
                var category = await _context.WikiCategories.FirstOrDefaultAsync(c => c.Name == dto.Category);
                if (category == null)
                {
                    category = new Models.WikiCategory { Name = dto.Category, Slug = dto.Category.ToLower().Replace(" ", "-") };
                    _context.WikiCategories.Add(category);
                    await _context.SaveChangesAsync();
                }
                article.CategoryId = category.Id;
            }

            article.Title = dto.Title;
            article.Body = dto.Body;
            // Мы не обновляем AuthorName и CreatedAt, так как они задаются при создании

            await _context.SaveChangesAsync();
            
            return NoContent(); // 204 No Content - успешное выполнение PUT запроса
        }

        // DELETE: api/Wiki/5 (Удаление статьи)
        [Authorize(Roles = "1,2")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.WikiArticles.FindAsync(id);
            if (article == null) return NotFound(new { message = "Статья не найдена" });

            _context.WikiArticles.Remove(article);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTO для создания
    public class CreateWikiArticleDto
    {
        public string Title { get; set; }
        public string Category { get; set; }
        public string Body { get; set; }
        public string AuthorName { get; set; }
    }

    // DTO для обновления
    public class UpdateWikiArticleDto
    {
        public string Title { get; set; }
        public string Category { get; set; }
        public string Body { get; set; }
    }
}