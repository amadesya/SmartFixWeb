using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using SmartFixApi.Models;
using SmartFixApi.DTO;

namespace SmartFixApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;
    private readonly IHttpClientFactory _httpClientFactory;

    public UsersController(
        AppDbContext context,
        IWebHostEnvironment env,
        IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _env = env;
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new User
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                PasswordHash = u.PasswordHash,
                Role = u.Role,
                IsVerified = u.IsVerified,
                Phone = u.Phone,
                Avatar = u.Avatar,
                PersonalDiscount = u.PersonalDiscount,
                BonusPoints = u.BonusPoints
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("technicians")]
    public async Task<IActionResult> GetTechnicians()
    {
        var technicians = await _context.Users
            .Where(u => u.Role == 1)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                IsVerified = u.IsVerified,
                Phone = u.Phone,
                Avatar = u.Avatar,
                PersonalDiscount = u.PersonalDiscount,
                BonusPoints = u.BonusPoints
            })
            .ToListAsync();

        return Ok(technicians);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound(new { message = "Пользователь не найден" });
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            IsVerified = user.IsVerified,
            Phone = user.Phone,
            Avatar = user.Avatar,
            PersonalDiscount = user.PersonalDiscount,
            BonusPoints = user.BonusPoints
        };

        return Ok(userDto);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromForm] UpdateUserDto dto)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = int.Parse(User.FindFirst(ClaimTypes.Role)?.Value ?? "0");

            if (currentUserId != id && currentUserRole != 2)
            {
                return Forbid();
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "Пользователь не найден" });
            }

            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                user.Name = dto.Name;
            }

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                var emailExists = await _context.Users
                    .AnyAsync(u => u.Email == dto.Email && u.Id != id);

                if (emailExists)
                {
                    return BadRequest(new { message = "Email уже используется" });
                }

                user.Email = dto.Email;
            }

            if (!string.IsNullOrWhiteSpace(dto.Phone))
            {
                user.Phone = dto.Phone;
            }

            bool isNewAvatarUploaded = false;
            string newFileName = string.Empty;
            string uploadsFolder = Path.Combine(_env.WebRootPath, "avatars");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Вариант 1: Загрузка файла напрямую с компьютера
            if (dto.AvatarFile != null && dto.AvatarFile.Length > 0)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(dto.AvatarFile.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(fileExtension))
                    return BadRequest(new { message = "Недопустимый тип файла. Разрешены только изображения (jpg, png, gif, webp)" });

                if (dto.AvatarFile.Length > 5 * 1024 * 1024)
                    return BadRequest(new { message = "Размер файла не должен превышать 5MB" });

                newFileName = Guid.NewGuid().ToString() + fileExtension;
                var filePath = Path.Combine(_env.WebRootPath, "avatars", newFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.AvatarFile.CopyToAsync(stream);
                }
                isNewAvatarUploaded = true;
            }

            // Вариант 2: Загрузка по ссылке из интернета

            else if (!string.IsNullOrWhiteSpace(dto.AvatarUrl) || !string.IsNullOrWhiteSpace(dto.Avatar))
            {
                // Ищем ссылку...
                string urlToDownload = !string.IsNullOrWhiteSpace(dto.AvatarUrl) ? dto.AvatarUrl : dto.Avatar!;

                if (!Uri.TryCreate(urlToDownload, UriKind.Absolute, out var uriResult) ||
                (uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps))
                {
                    return BadRequest(new { message = "Указана некорректная ссылка. Она должна начинаться с http:// или https://" });
                }

                try
                {
                    var httpClient = _httpClientFactory.CreateClient();
                    httpClient.Timeout = TimeSpan.FromSeconds(15);
                    httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

                    // Читаем ТОЛЬКО заголовки (не качаем тело файла сразу)
                    using var response = await httpClient.GetAsync(uriResult, HttpCompletionOption.ResponseHeadersRead);

                    if (!response.IsSuccessStatusCode)
                        return BadRequest(new { message = $"Сайт-источник заблокировал скачивание. Код: {response.StatusCode}" });

                    // Проверяем размер ДО скачивания (если сервер источника отдает Content-Length)
                    var contentLength = response.Content.Headers.ContentLength;
                    if (contentLength.HasValue && contentLength.Value > 5 * 1024 * 1024)
                        return BadRequest(new { message = "Размер файла по ссылке превышает 5MB" });
                    // 1. Пытаемся получить Content-Type из заголовков ответа
                    var contentType = response.Content.Headers.ContentType?.MediaType?.ToLower();

                    // 2. Если заголовка нет, пробуем определить тип по расширению в самом URL
                    if (string.IsNullOrEmpty(contentType))
                    {
                        if (urlToDownload.Contains(".jpg") || urlToDownload.Contains(".jpeg")) contentType = "image/jpeg";
                        else if (urlToDownload.Contains(".png")) contentType = "image/png";
                        else if (urlToDownload.Contains(".webp")) contentType = "image/webp";
                        else if (urlToDownload.Contains(".gif")) contentType = "image/gif";
                    }

                    // 3. Объявляем словарь разрешенных типов (MIME types) и соответствующих им расширений
                    var allowedMimeTypes = new Dictionary<string, string>
                    {
                        { "image/jpeg", ".jpg" }, { "image/png", ".png" },
                        { "image/gif", ".gif" }, { "image/webp", ".webp" },
                        { "application/octet-stream", ".jpg" }
                    };

                    // 4. Проверяем, поддерживаем ли мы полученный тип файла
                    if (contentType == null || !allowedMimeTypes.ContainsKey(contentType))
                        return BadRequest(new { message = $"Неподдерживаемый формат файла: {contentType ?? "неизвестно"}" });
                    var fileExtension = allowedMimeTypes[contentType];
                    newFileName = Guid.NewGuid().ToString() + fileExtension;
                    var filePath = Path.Combine(_env.WebRootPath, "avatars", newFileName); // Используем _env

                    // Скачиваем файл потоком прямо на жесткий диск, не забивая оперативную память
                    using var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None);
                    using var networkStream = await response.Content.ReadAsStreamAsync();

                    await networkStream.CopyToAsync(fileStream);

                    // Опционально: если Content-Length не было, можно проверить размер после скачивания
                    if (fileStream.Length > 5 * 1024 * 1024)
                    {
                        fileStream.Close();
                        System.IO.File.Delete(filePath); // Удаляем, если оказался слишком большим
                        return BadRequest(new { message = "Размер скачанного файла превысил 5MB" });
                    }

                    isNewAvatarUploaded = true;
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = $"Ошибка при скачивании по ссылке: {ex.Message}" });
                }


            }


            // Если картинка успешно загружена любым из способов, удаляем старую и обновляем URL
            if (isNewAvatarUploaded)
            {
                // Удаление старого аватара
                if (!string.IsNullOrEmpty(user.Avatar))
                {
                    string? oldFileName = null;
                    if (user.Avatar.Contains("/avatars/"))
                    {
                        oldFileName = user.Avatar.Substring(user.Avatar.LastIndexOf('/') + 1);
                    }

                    if (!string.IsNullOrEmpty(oldFileName))
                    {
                        var oldFilePath = Path.Combine(_env.WebRootPath, "avatars", oldFileName);
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            try { System.IO.File.Delete(oldFilePath); }
                            catch (Exception ex) { Console.WriteLine($"Could not delete old avatar file: {ex.Message}"); }
                        }
                    }
                }

                // Сохраняем новый URL в БД
                // var baseUrl = $"{Request.Scheme}://{Request.Host}";
                user.Avatar = $"/avatars/{newFileName}";
            }
            // --- КОНЕЦ БЛОКА ОБРАБОТКИ АВАТАРА ---
            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            if (dto.IsVerified.HasValue)
            {
                user.IsVerified = dto.IsVerified.Value;
            }

            if (dto.Role.HasValue)
            {
                user.Role = dto.Role.Value;
            }

            await _context.SaveChangesAsync();

            var updatedUserDto = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                IsVerified = user.IsVerified,
                Phone = user.Phone,
                Avatar = user.Avatar,
                PersonalDiscount = user.PersonalDiscount,
                BonusPoints = user.BonusPoints
            };

            return Ok(updatedUserDto);
        }
        catch (DbUpdateException ex)
        {
            var realError = ex.InnerException != null ? ex.InnerException.Message : ex.Message;

            return StatusCode(500, new
            {
                message = "Ошибка при обновлении пользователя",
                details = realError
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Неожиданная ошибка при обновлении профиля",
                details = ex.Message
            });
        }
    }


    [Authorize(Roles = "2")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound(new { message = "Пользователь не найден" });
        }

        _context.Users.Remove(user);

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = "Пользователь успешно удален" });
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "Ошибка при удалении пользователя" });
        }
    }

    [Authorize(Roles = "2")]
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromForm] CreateUserDto dto)
    {
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == dto.Email);

        if (emailExists)
        {
            return BadRequest(new { message = "Email уже используется" });
        }

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Avatar = dto.Avatar,
            Role = dto.Role,
            IsVerified = false,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        // === Обработка аватара ===
        bool isNewAvatarUploaded = false;
        string newFileName = string.Empty;
        string uploadsFolder = Path.Combine(_env.WebRootPath, "avatars");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // Вариант 1: Загрузка файла напрямую с компьютера
        if (dto.AvatarFile != null && dto.AvatarFile.Length > 0)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var fileExtension = Path.GetExtension(dto.AvatarFile.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtension))
                return BadRequest(new { message = "Недопустимый тип файла. Разрешены только изображения" });

            if (dto.AvatarFile.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "Размер файла не должен превышать 5MB" });

            newFileName = Guid.NewGuid().ToString() + fileExtension;
            var filePath = Path.Combine(uploadsFolder, newFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.AvatarFile.CopyToAsync(stream);
            }
            isNewAvatarUploaded = true;
        }
        // Вариант 2: Загрузка по ссылке из интернета (только если ссылка ИЗМЕНИЛАСЬ)
        else
        {
            string urlToDownload = !string.IsNullOrWhiteSpace(dto.AvatarUrl) ? dto.AvatarUrl : dto.Avatar!;

            // Важно: проверяем, что ссылка не пустая И она не совпадает с текущим аватаром пользователя
            if (!string.IsNullOrWhiteSpace(urlToDownload) && urlToDownload != user.Avatar)
            {
                try
                {
                    var httpClient = _httpClientFactory.CreateClient();
                    httpClient.Timeout = TimeSpan.FromSeconds(15);
                    httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

                    using var response = await httpClient.GetAsync(urlToDownload, HttpCompletionOption.ResponseHeadersRead);

                    if (!response.IsSuccessStatusCode)
                        return BadRequest(new { message = $"Сайт-источник заблокировал скачивание. Код: {response.StatusCode}" });

                    var contentLength = response.Content.Headers.ContentLength;
                    if (contentLength.HasValue && contentLength.Value > 5 * 1024 * 1024)
                        return BadRequest(new { message = "Размер файла по ссылке превышает 5MB" });

                    var contentType = response.Content.Headers.ContentType?.MediaType?.ToLower();

                    if (string.IsNullOrEmpty(contentType))
                    {
                        if (urlToDownload.Contains(".jpg") || urlToDownload.Contains(".jpeg")) contentType = "image/jpeg";
                        else if (urlToDownload.Contains(".png")) contentType = "image/png";
                        else if (urlToDownload.Contains(".webp")) contentType = "image/webp";
                        else if (urlToDownload.Contains(".gif")) contentType = "image/gif";
                    }

                    var allowedMimeTypes = new Dictionary<string, string>
            {
                { "image/jpeg", ".jpg" }, { "image/png", ".png" },
                { "image/gif", ".gif" }, { "image/webp", ".webp" },
                { "application/octet-stream", ".jpg" }
            };

                    if (contentType == null || !allowedMimeTypes.ContainsKey(contentType))
                        return BadRequest(new { message = $"Неподдерживаемый формат файла: {contentType ?? "неизвестно"}" });

                    var fileExtension = allowedMimeTypes[contentType];
                    newFileName = Guid.NewGuid().ToString() + fileExtension;
                    var filePath = Path.Combine(uploadsFolder, newFileName);

                    // Ограничиваем "using" фигурные скобками, чтобы дескриптор файла закрылся ОДОЗРЯДНО
                    using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
                    using (var networkStream = await response.Content.ReadAsStreamAsync())
                    {
                        await networkStream.CopyToAsync(fileStream);

                        if (fileStream.Length > 5 * 1024 * 1024)
                        {
                            fileStream.Close(); // закрываем перед удалением
                            System.IO.File.Delete(filePath);
                            return BadRequest(new { message = "Размер скачанного файла превысил 5MB" });
                        }
                    }

                    isNewAvatarUploaded = true;
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = $"Ошибка при скачивании по ссылке: {ex.Message}" });
                }
            }
        }
        // Если картинка успешно загружена любым из способов, сохраняем путь в БД
        if (isNewAvatarUploaded)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            user.Avatar = $"{baseUrl}/avatars/{newFileName}";
        }
        // === КОНЕЦ БЛОКА ОБРАБОТКИ АВАТАРА ===

        _context.Users.Add(user);

        try
        {
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                IsVerified = user.IsVerified,
                Phone = user.Phone,
                Avatar = user.Avatar,
                PersonalDiscount = user.PersonalDiscount,
                BonusPoints = user.BonusPoints
            };

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, userDto);
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, new { message = "Ошибка при создании пользователя" });
        }
    }


}