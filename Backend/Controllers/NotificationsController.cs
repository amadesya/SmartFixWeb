using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using SmartFixApi.Data;
using SmartFixApi.Models; // Убедись, что пространство имен моделей совпадает

namespace SmartFixApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public NotificationsController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRoleStr = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

        var currentUserId = int.Parse(userIdStr);
        var currentUserRole = int.Parse(userRoleStr ?? "0");

        var query = _context.Notifications.AsQueryable();

        // Администраторы и мастера видят системные уведомления (UserId == null) и свои личные.
        // Обычные клиенты (Role == 0) видят ТОЛЬКО свои личные уведомления.
        if (currentUserRole == 2 || currentUserRole == 1)
            query = query.Where(n => n.UserId == null || n.UserId == currentUserId);
        else
            query = query.Where(n => n.UserId == currentUserId);

        var notifications = await query
            .OrderByDescending(n => n.CreatedAt)
            .Take(50) // Ограничиваем последние 50, чтобы не перегружать запрос
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var currentUserRole = int.Parse(User.FindFirst(ClaimTypes.Role)?.Value ?? "0");

        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null) return NotFound();

        // Проверка прав доступа к уведомлению
        if (notification.UserId != null && notification.UserId != currentUserId && currentUserRole == 0)
            return Forbid();

        notification.IsRead = true;
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var currentUserRole = int.Parse(User.FindFirst(ClaimTypes.Role)?.Value ?? "0");

        var query = _context.Notifications.Where(n => !n.IsRead);

        if (currentUserRole == 2 || currentUserRole == 1)
            query = query.Where(n => n.UserId == null || n.UserId == currentUserId);
        else
            query = query.Where(n => n.UserId == currentUserId);

        var unread = await query.ToListAsync();

        foreach (var n in unread)
        {
            n.IsRead = true;
        }

        await _context.SaveChangesAsync();
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("vapid-public-key")]
    public IActionResult GetVapidPublicKey()
    {
        var publicKey = _configuration["VapidKeys:PublicKey"];
        if (string.IsNullOrEmpty(publicKey)) return Ok("VAPID_KEY_NOT_SET");
        
        return Content(publicKey, "text/plain");
    }
}