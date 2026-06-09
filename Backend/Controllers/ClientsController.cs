using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using SmartFix.Features.Clients.GetClientDetails;

namespace SmartFixApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClientsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}/profile")]
    public async Task<IActionResult> GetProfile(int id)
    {
        var client = await _context.Users
            .FirstOrDefaultAsync(c => c.Id == id);

        if (client == null) return NotFound();

        var history = await _context.RepairRequests
            .Where(r => r.ClientId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ClientHistoryItemDto(
                r.Id,
                r.CreatedAt,
                r.Device ?? "",
                r.IssueDescription ?? "",
                r.Status ?? "",
                r.Price ?? 0m))
            .ToListAsync();

        return Ok(new ClientDetailsDto(
            client.Id,
            client.Name,
            client.Phone ?? "",
            client.Email,
            DateTime.MinValue, // У сущности User нет поля CreatedAt
            new ClientLoyaltyDto(client.LoyaltyTier.ToString(), client.PersonalDiscount, client.BonusPoints, client.TotalSpent),
            history
        ));
    }
}