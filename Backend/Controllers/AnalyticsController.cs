using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using SmartFixApi.Data;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AnalyticsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<AnalyticsSummaryDto>> GetSummary()
    {
        var completedRequests = await _db.RepairRequests
            .Where(r => r.Status == "Ready" || r.Status == "Closed")
            .ToListAsync();

        var totalRevenue = completedRequests.Sum(r => r.Price ?? 0);

        // Считаем затраты на детали
        var totalPartsCost = completedRequests.Sum(r => r.PartsCost ?? 0);

        // Считаем выплаты мастерам (MasterBonus)
        var totalMasterBonuses = completedRequests.Sum(r => r.MasterBonus ?? 0);

        // Чистая прибыль = Выручка - Затраты на детали - Зарплаты мастеров
        var actualProfit = totalRevenue - totalPartsCost - totalMasterBonuses;

        return Ok(new AnalyticsSummaryDto
        {
            TotalRequests = await _db.RepairRequests.CountAsync(),
            CompletedRequests = completedRequests.Count,
            TotalRevenue = totalRevenue,
            TotalPartsCost = totalPartsCost,
            ActualProfit = actualProfit,
            AverageCheck = completedRequests.Count > 0 ? totalRevenue / completedRequests.Count : 0
        });
    }

    [HttpGet("charts")]
    public async Task<ActionResult<List<DailyStatDto>>> GetChartData()
    {
        var startDate = DateTime.Now.AddDays(-30).Date;

        // 1. Делаем группировку и расчеты на стороне БД
        var rawStats = await _db.RepairRequests
            .Where(r => r.CompletedAt.HasValue && r.CompletedAt >= startDate)
            .GroupBy(r => r.CompletedAt.Value.Date)
            .Select(g => new
            {
                RawDate = g.Key,
                Revenue = g.Sum(r => r.Price ?? 0),
                Count = g.Count()
            })
            .OrderBy(s => s.RawDate)
            .ToListAsync(); // <-- Вытягиваем данные из БД в память сервера

        // 2. Форматируем дату уже в памяти (здесь .ToString() работает отлично)
        var stats = rawStats.Select(s => new DailyStatDto
        {
            Date = s.RawDate.ToString("dd.MM"),
            Revenue = s.Revenue,
            Count = s.Count
        }).ToList();

        return Ok(stats);
    }

    [HttpGet("top-technicians")]
    public async Task<ActionResult<List<TopPersonDto>>> GetTopTechnicians()
    {
        // Берем только выполненные заявки с ценой
        var topTechs = await _db.RepairRequests
            .Where(r => r.TechnicianId != null && r.Price.HasValue && (r.Status == "Ready" || r.Status == "Closed"))
            .GroupBy(r => new { r.TechnicianId, r.Technician.Name }) // Замени .Name на то поле, где у тебя хранится имя пользователя (например, .FullName)
            .Select(g => new TopPersonDto
            {
                Id = g.Key.TechnicianId.Value,
                Name = g.Key.Name ?? "Неизвестный мастер",
                Revenue = g.Sum(r => r.Price.Value),
                RequestsCount = g.Count()
            })
            .OrderByDescending(t => t.Revenue)
            .Take(5) // Берем топ-5
            .ToListAsync();

        return Ok(topTechs);
    }

    [HttpGet("top-clients")]
    public async Task<ActionResult<List<TopPersonDto>>> GetTopClients()
    {
        var topClients = await _db.RepairRequests
            .Where(r => r.Price.HasValue && (r.Status == "Ready" || r.Status == "Closed"))
            .GroupBy(r => new { r.ClientId, r.Client.Name }) // Тоже проверь поле имени
            .Select(g => new TopPersonDto
            {
                Id = g.Key.ClientId,
                Name = g.Key.Name ?? "Неизвестный клиент",
                Revenue = g.Sum(r => r.Price.Value),
                RequestsCount = g.Count()
            })
            .OrderByDescending(t => t.Revenue)
            .Take(5)
            .ToListAsync();

        return Ok(topClients);
    }
}