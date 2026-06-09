﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using SmartFixApi.Models;
using SmartFixApi.DTO;

namespace SmartFix.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User) // Подгружаем данные пользователя
                .Include(r => r.RepairRequest) // Подгружаем связанную заявку
                .OrderByDescending(r => r.CreatedAt) // Сначала новые
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Body = r.Body,
                    Rating = r.Rating,
                    CreatedAt = r.CreatedAt,
                    UserId = r.UserId,
                    // Вытаскиваем данные из связанного пользователя
                    AuthorName = r.User != null ? r.User.Name : "Аноним",
                    AuthorAvatar = r.User != null ? r.User.Avatar : null,
                    AuthorEmail = r.User != null ? r.User.Email : null,

                    // ПРОКИДЫВАЕМ PARENTID В JSON:
                    ParentId = r.ParentId,
                    RepairRequestId = r.RepairRequestId,
                    DeviceName = r.RepairRequest != null ? r.RepairRequest.Device : null
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // 2. GET: Получить конкретный отзыв по ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDto>> GetReview(int id)
        {
            var r = await _context.Reviews
                .Include(rev => rev.User)
                .Include(rev => rev.RepairRequest)
                .FirstOrDefaultAsync(rev => rev.Id == id);

            if (r == null) return NotFound("Отзыв не найден");

            return new ReviewDto
            {
                Id = r.Id,
                Body = r.Body,
                Rating = r.Rating,
                CreatedAt = r.CreatedAt,
                UserId = r.UserId,
                AuthorName = r.User != null ? r.User.Name : "Аноним",
                AuthorAvatar = r.User != null ? r.User.Avatar : null,
                AuthorEmail = r.User != null ? r.User.Email : null,
                ParentId = r.ParentId,
                RepairRequestId = r.RepairRequestId,
                DeviceName = r.RepairRequest != null ? r.RepairRequest.Device : null
            };
        }

        // POST: Создать отзыв
        [HttpPost]
        public async Task<ActionResult<ReviewDto>> PostReview([FromBody] CreateReviewDto dto)
        {
            // 1. Проверка на существование пользователя
            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            if (!userExists) return BadRequest("Пользователь не найден");

            if (dto.ParentId.HasValue && dto.ParentId > 0)
            {
                // ЭТО ОТВЕТ НА ОТЗЫВ (ветка)
                var parentReview = await _context.Reviews.FindAsync(dto.ParentId.Value);
                if (parentReview == null) return NotFound("Родительский отзыв не найден");

                // Наследуем привязку к заявке от родителя, без жестких проверок владельца
                dto.RepairRequestId = parentReview.RepairRequestId ?? 0;
            }
            else if (dto.RepairRequestId > 0)
            {
                // ЭТО НОВЫЙ КОРНЕВОЙ ОТЗЫВ К ЗАЯВКЕ
                var repairRequest = await _context.RepairRequests.FindAsync(dto.RepairRequestId);
                if (repairRequest == null) return NotFound("Заявка не найдена");

                if (repairRequest.ClientId != dto.UserId)
                    return BadRequest("Вы можете оставить отзыв только на свою заявку");

                if (repairRequest.Status != "Ready" && repairRequest.Status != "Готова" && repairRequest.Status != "Закрыта")
                    return BadRequest("Оставить отзыв можно только после завершения ремонта");

                var reviewExists = await _context.Reviews.AnyAsync(r => r.RepairRequestId == dto.RepairRequestId && r.ParentId == null);
                if (reviewExists) return BadRequest("Вы уже оставили отзыв к этой заявке");
            }
            // 2. Вручную собираем сущность для базы данных
            var review = new Review
            {
                UserId = dto.UserId,
                Body = dto.Body,
                Rating = dto.ParentId.HasValue ? 0 : dto.Rating, // У ответов не должно быть рейтинга
                ParentId = dto.ParentId,
                RepairRequestId = dto.RepairRequestId,
                CreatedAt = DateTime.UtcNow,
                IsApproved = true // Сразу одобряем, как договаривались
            };

            // 3. Сохраняем в базу
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Создаем DTO для ответа (чтобы избежать циклической зависимости JSON)
            var resultDto = new ReviewDto
            {
                Id = review.Id,
                Body = review.Body,
                Rating = review.Rating,
                CreatedAt = review.CreatedAt,
                UserId = review.UserId,
                ParentId = review.ParentId,
                RepairRequestId = review.RepairRequestId
            };

            // Возвращаем результат
            return CreatedAtAction(nameof(GetReview), new { id = review.Id }, resultDto);
        }
        // 4. PUT: Редактировать отзыв
        // PUT: Редактировать отзыв
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, [FromBody] UpdateReviewDto dto)
        {
            // Ищем существующий отзыв в базе
            var existingReview = await _context.Reviews.FindAsync(id);
            if (existingReview == null) return NotFound("Отзыв не найден");

            // В реальном проекте здесь еще должна быть проверка, 
            // что отзыв редактирует именно его автор (или админ),
            // но для начала просто обновим данные:

            existingReview.Body = dto.Body;
            existingReview.Rating = dto.Rating;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewExists(id)) return NotFound("Отзыв был удален");
                else throw;
            }

            return NoContent(); // Стандартный ответ для успешного PUT-запроса (204 No Content)
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            // Запускаем рекурсивное удаление всех "потомков"
            await DeleteHierarchy(id);

            // Теперь, когда все вложенные ответы удалены, удаляем сам корень
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Вспомогательный метод для рекурсии (добавь его ниже в этом же контроллере)
        private async Task DeleteHierarchy(int parentId)
        {
            // Находим всех непосредственных "детей"
            var children = await _context.Reviews.Where(r => r.ParentId == parentId).ToListAsync();

            foreach (var child in children)
            {
                // Сначала идем еще глубже (ищем "внуков")
                await DeleteHierarchy(child.Id);

                // Когда глубже ничего нет, удаляем текущего ребенка
                _context.Reviews.Remove(child);
            }
        }

        private bool ReviewExists(int id)
        {
            return _context.Reviews.Any(e => e.Id == id);
        }

        [HttpGet("master-stats")]
        public async Task<IActionResult> GetMasterStats()
        {
            var stats = await _context.RepairRequests
                .Where(r => r.Status == "Закрыта" && r.TechnicianId != null)
                .GroupBy(r => new { r.TechnicianId, r.Technician.Name })
                .Select(g => new
                {
                    MasterName = g.Key.Name,
                    DoneRequests = g.Count(),
                    TotalRevenue = g.Sum(r => r.Price),
                    // Считаем средний рейтинг мастера на основе отзывов по его заявкам
                    AverageRating = _context.Reviews
                        .Where(rev => rev.RepairRequestId != null && rev.RepairRequest.TechnicianId == g.Key.TechnicianId)
                        .Average(rev => (decimal?)rev.Rating) ?? 0
                })
                .OrderByDescending(x => x.AverageRating)
                .ToListAsync();

            return Ok(stats);
        }
    }
}