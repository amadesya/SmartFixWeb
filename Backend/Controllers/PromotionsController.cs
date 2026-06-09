using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;

namespace SmartFixApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromotionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PromotionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetActivePromotions()
    {
        var promotions = await _context.Set<Promotion>()
            .Where(p => p.IsActive && p.EndDate >= DateTime.UtcNow)
            .ToListAsync();

        return Ok(promotions);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePromotion([FromBody] Promotion promotion)
    {
        _context.Set<Promotion>().Add(promotion);
        await _context.SaveChangesAsync();
        return Ok(promotion);
    }
}

public class Promotion
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal DiscountPercent { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
}