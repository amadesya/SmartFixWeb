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

            var uploadsFolder = Path.Combine(
                _env.WebRootPath ?? Path.Combine(AppContext.BaseDirectory, "wwwroot"),
                "avatars"
            );
            Directory.CreateDirectory(uploadsFolder);

            var avatarSource = dto.AvatarUrl ?? dto.Avatar;
            var newAvatar = await ProcessAvatarAsync(user.Avatar, dto.AvatarFile, avatarSource, uploadsFolder);

            if (newAvatar != null)
            {
                DeleteAvatarFile(user.Avatar, uploadsFolder);
                user.Avatar = newAvatar;
            }

            user.Avatar = ExtractRelativeAvatarPath(user.Avatar) ?? user.Avatar;

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
            Avatar = ExtractRelativeAvatarPath(dto.Avatar) ?? dto.Avatar,
            Role = dto.Role,
            IsVerified = false,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        var uploadsFolder = Path.Combine(
            _env.WebRootPath ?? Path.Combine(AppContext.BaseDirectory, "wwwroot"),
            "avatars"
        );
        Directory.CreateDirectory(uploadsFolder);

        var avatarSource = dto.AvatarUrl ?? dto.Avatar;
        var newAvatar = await ProcessAvatarAsync(null, dto.AvatarFile, avatarSource, uploadsFolder);

        if (newAvatar != null)
            user.Avatar = newAvatar;

        user.Avatar = ExtractRelativeAvatarPath(user.Avatar) ?? user.Avatar;

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

    private static readonly HashSet<string> AllowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    private const long MaxAvatarSize = 5 * 1024 * 1024;

    private async Task<string?> ProcessAvatarAsync(
        string? currentAvatar,
        IFormFile? avatarFile,
        string? avatarUrl,
        string uploadsFolder)
    {
        if (avatarFile is { Length: > 0 })
            return await SaveUploadedFileAsync(avatarFile, uploadsFolder);

        if (!string.IsNullOrWhiteSpace(avatarUrl))
            return await ResolveAvatarUrlAsync(currentAvatar, avatarUrl, uploadsFolder);

        return null;
    }

    private async Task<string> SaveUploadedFileAsync(IFormFile file, string uploadsFolder)
    {
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            throw new InvalidOperationException("Недопустимый тип файла. Разрешены только изображения (jpg, png, gif, webp)");

        if (file.Length > MaxAvatarSize)
            throw new InvalidOperationException("Размер файла не должен превышать 5MB");

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/avatars/{fileName}";
    }

    private async Task<string?> ResolveAvatarUrlAsync(string? currentAvatar, string avatarUrl, string uploadsFolder)
    {
        if (ContainsLocalFilePath(avatarUrl))
            throw new InvalidOperationException("Указан недопустимый путь к файлу");

        currentAvatar = ExtractRelativeAvatarPath(currentAvatar) ?? currentAvatar;

        var normalized = ExtractRelativeAvatarPath(avatarUrl);
        if (normalized != null)
        {
            if (currentAvatar != null && normalized == currentAvatar)
                return null;

            return null;
        }

        return await DownloadAndSaveAvatarAsync(avatarUrl, uploadsFolder);
    }

    private async Task<string> DownloadAndSaveAvatarAsync(string url, string uploadsFolder)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri) ||
            (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
            throw new InvalidOperationException("Указана некорректная ссылка. Она должна начинаться с http:// или https://");

        var httpClient = _httpClientFactory.CreateClient();
        httpClient.Timeout = TimeSpan.FromSeconds(15);
        httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

        using var response = await httpClient.GetAsync(uri, HttpCompletionOption.ResponseHeadersRead);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"Сайт-источник заблокировал скачивание. Код: {response.StatusCode}");

        var contentLength = response.Content.Headers.ContentLength;
        if (contentLength.HasValue && contentLength.Value > MaxAvatarSize)
            throw new InvalidOperationException("Размер файла по ссылке превышает 5MB");

        var mimeToExtension = new Dictionary<string, string>
        {
            ["image/jpeg"] = ".jpg",
            ["image/png"] = ".png",
            ["image/gif"] = ".gif",
            ["image/webp"] = ".webp",
            ["application/octet-stream"] = ".jpg"
        };

        var contentType = response.Content.Headers.ContentType?.MediaType?.ToLowerInvariant()
                          ?? InferMimeFromUrl(url);

        if (contentType == null || !mimeToExtension.TryGetValue(contentType, out var ext))
            throw new InvalidOperationException($"Неподдерживаемый формат файла: {contentType ?? "неизвестно"}");

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        await using var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None);
        await using var networkStream = await response.Content.ReadAsStreamAsync();
        await networkStream.CopyToAsync(fileStream);

        if (fileStream.Length > MaxAvatarSize)
        {
            await fileStream.DisposeAsync();
            System.IO.File.Delete(filePath);
            throw new InvalidOperationException("Размер скачанного файла превысил 5MB");
        }

        return $"/avatars/{fileName}";
    }

    private static string? InferMimeFromUrl(string url)
    {
        if (url.Contains(".jpg") || url.Contains(".jpeg")) return "image/jpeg";
        if (url.Contains(".png")) return "image/png";
        if (url.Contains(".webp")) return "image/webp";
        if (url.Contains(".gif")) return "image/gif";
        return null;
    }

    private static string? ExtractRelativeAvatarPath(string? path)
    {
        if (string.IsNullOrWhiteSpace(path))
            return null;

        if (path.StartsWith("/avatars/", StringComparison.Ordinal))
            return path;

        if (Uri.TryCreate(path, UriKind.Absolute, out var uri) &&
            uri.AbsolutePath.StartsWith("/avatars/", StringComparison.Ordinal))
            return uri.AbsolutePath;

        return null;
    }

    private static bool ContainsLocalFilePath(string path)
    {
        if (path.Length >= 3 && char.IsLetter(path[0]) && path[1] == ':' && (path[2] == '\\' || path[2] == '/'))
            return true;

        if (path.StartsWith("\\\\", StringComparison.Ordinal))
            return true;

        if (path.StartsWith("file://", StringComparison.OrdinalIgnoreCase))
            return true;

        return false;
    }

    private static void DeleteAvatarFile(string? avatarPath, string uploadsFolder)
    {
        if (string.IsNullOrEmpty(avatarPath))
            return;

        var index = avatarPath.LastIndexOf("/avatars/", StringComparison.Ordinal);
        if (index < 0)
            return;

        var fileName = avatarPath[(index + "/avatars/".Length)..];
        var filePath = Path.Combine(uploadsFolder, fileName);

        if (System.IO.File.Exists(filePath))
        {
            try { System.IO.File.Delete(filePath); }
            catch (Exception ex) { Console.WriteLine($"Could not delete old avatar: {ex.Message}"); }
        }
    }
}
