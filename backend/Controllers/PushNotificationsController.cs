using Microsoft.AspNetCore.Mvc;
using SmartFixApi.Data;
using System.Threading.Tasks;

namespace SmartFixApi.Controllers
{
    public class PushSubscriptionDto
    {
        public int UserId { get; set; }
        public string Endpoint { get; set; } = null!;
        public PushSubscriptionKeysDto Keys { get; set; } = null!;
    }

    public class PushSubscriptionKeysDto
    {
        public string P256dh { get; set; } = null!;
        public string Auth { get; set; } = null!;
    }

    [Route("api/[controller]")]
    [ApiController]
    public class PushNotificationsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PushNotificationsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] PushSubscriptionDto sub)
        {
            if (sub == null || string.IsNullOrEmpty(sub.Endpoint))
                return BadRequest("Неверные данные подписки.");

            var user = await _db.Users.FindAsync(sub.UserId);

            if (user == null)
                return NotFound($"Пользователь с ID {sub.UserId} не найден.");

            user.PushEndpoint = sub.Endpoint;
            user.PushP256DH = sub.Keys.P256dh;
            user.PushAuth = sub.Keys.Auth;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Подписка на Web Push успешно оформлена!" });
        }
    }
}