using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using SmartFixApi.DTO;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _db;
    private const decimal MonthlyNormHours = 160m;
    private const decimal HoursPerOrder = 2m;

    public AnalyticsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<AnalyticsSummaryDto>> GetSummary(
        [FromQuery] string? from, [FromQuery] string? to)
    {
        var (startDate, endDate) = GetDateRange(from, to);

        var totalRequests = await _db.RepairRequests
            .CountAsync(r => r.CreatedAt >= startDate && r.CreatedAt < endDate);

        var completedStats = await _db.RepairRequests
            .Where(r => r.CompletedAt.HasValue
                     && r.CompletedAt >= startDate
                     && r.CompletedAt < endDate
                     && (r.Status == "Ready" || r.Status == "Closed"))
            .GroupBy(r => 1)
            .Select(g => new
            {
                CompletedCount = g.Count(),
                TotalRevenue = g.Sum(r => r.Price ?? 0),
                TotalPartsCost = g.Sum(r => r.PartsCost ?? 0),
            })
            .FirstOrDefaultAsync();

        var totalSalary = await _db.TimeLogs
            .Where(t => t.Date >= startDate && t.Date < endDate)
            .SumAsync(t => t.HoursWorked * t.Employee.HourlyRate);

        var totalMasterBonuses = await _db.RepairRequests
            .Where(r => r.CompletedAt.HasValue
                     && r.CompletedAt >= startDate
                     && r.CompletedAt < endDate
                     && (r.Status == "Ready" || r.Status == "Closed"))
            .SumAsync(r => r.MasterBonus ?? 0);

        if (completedStats == null)
        {
            return Ok(new AnalyticsSummaryDto
            {
                TotalRequests = totalRequests,
                TotalSalary = totalSalary,
                TotalMasterBonuses = totalMasterBonuses,
            });
        }

        return Ok(new AnalyticsSummaryDto
        {
            TotalRequests = totalRequests,
            CompletedRequests = completedStats.CompletedCount,
            TotalRevenue = completedStats.TotalRevenue,
            TotalPartsCost = completedStats.TotalPartsCost,
            TotalMasterBonuses = totalMasterBonuses,
            TotalSalary = totalSalary,
            ActualProfit = completedStats.TotalRevenue
                         - completedStats.TotalPartsCost
                         - totalSalary
                         - totalMasterBonuses,
            AverageCheck = completedStats.CompletedCount > 0
                         ? completedStats.TotalRevenue / completedStats.CompletedCount
                         : 0,
        });
    }

    [HttpGet("kpi-salaries")]
    public async Task<ActionResult<List<EmployeeKpiDto>>> GetKpiSalaries(
        [FromQuery] string? from, [FromQuery] string? to)
    {
        var (startDate, endDate) = GetDateRange(from, to);

        var employeeStats = await _db.RepairRequests
            .Where(r => r.CompletedAt.HasValue
                     && r.CompletedAt >= startDate
                     && r.CompletedAt < endDate
                     && (r.Status == "Ready" || r.Status == "Closed")
                     && r.TechnicianId != null)
            .GroupBy(r => r.TechnicianId)
            .Select(g => new
            {
                TechnicianId = g.Key!.Value,
                PersonalRevenue = g.Sum(r => r.Price ?? 0),
                CompletedCount = g.Count(),
            })
            .ToListAsync();

        var employees = await _db.Employees
            .Include(e => e.User)
            .ToListAsync();

        var result = employees.Select(e =>
        {
            var stats = employeeStats.FirstOrDefault(s => s.TechnicianId == e.UserId);
            var personalRevenue = stats?.PersonalRevenue ?? 0;
            var completedCount = stats?.CompletedCount ?? 0;

            var hoursWorked = completedCount * HoursPerOrder;
            var hourlyRate = e.BaseSalary > 0 ? e.BaseSalary / MonthlyNormHours : 0;
            var timeBasedSalary = hoursWorked * hourlyRate;
            var bonusAmount = timeBasedSalary * e.BonusPercentage / 100;

            return new EmployeeKpiDto
            {
                EmployeeId = e.Id,
                Name = e.User.Name,
                BaseSalary = e.BaseSalary,
                BonusPercentage = e.BonusPercentage,
                BonusAmount = bonusAmount,
                TotalPayout = timeBasedSalary + bonusAmount,
                CompletedRequests = completedCount,
                PersonalRevenue = personalRevenue,
                TimeBasedSalary = timeBasedSalary,
                HourlyRate = hourlyRate,
                HoursWorked = hoursWorked,
            };
        }).ToList();

        return Ok(result);
    }

    [HttpGet("company-kpi-salaries")]
    public async Task<ActionResult<CompanyKpiSalaryDto>> GetCompanyKpiSalaries(
        [FromQuery] string? from, [FromQuery] string? to)
    {
        var (startDate, endDate) = GetDateRange(from, to);

        var completedStats = await _db.RepairRequests
            .Where(r => r.CompletedAt.HasValue
                     && r.CompletedAt >= startDate
                     && r.CompletedAt < endDate
                     && (r.Status == "Ready" || r.Status == "Closed"))
            .GroupBy(r => 1)
            .Select(g => new
            {
                TotalRevenue = g.Sum(r => r.Price ?? 0),
                CompletedCount = g.Count(),
            })
            .FirstOrDefaultAsync();

        var totalRevenue = completedStats?.TotalRevenue ?? 0;
        var totalOrders = completedStats?.CompletedCount ?? 0;
        var costPerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        var employees = await _db.Employees
            .Include(e => e.User)
            .ToListAsync();

        var employeeSalaries = employees.Select(e =>
        {
            var bonusAmount = totalRevenue * e.BonusPercentage / 100;
            return new EmployeeKpiDto
            {
                EmployeeId = e.Id,
                Name = e.User.Name,
                BaseSalary = e.BaseSalary,
                BonusPercentage = e.BonusPercentage,
                BonusAmount = bonusAmount,
                TotalPayout = e.BaseSalary + bonusAmount,
                CompletedRequests = 0,
                PersonalRevenue = 0,
            };
        }).ToList();

        var totalBonuses = employeeSalaries.Sum(e => e.BonusAmount);

        return Ok(new CompanyKpiSalaryDto
        {
            TotalRevenue = totalRevenue,
            TotalOrders = totalOrders,
            CostPerOrder = costPerOrder,
            TotalBonuses = totalBonuses,
            BonusPerOrder = totalOrders > 0 ? totalBonuses / totalOrders : 0,
            Employees = employeeSalaries
        });
    }

    private async Task<decimal> CalculateTotalSalary(DateTime startDate, DateTime endDate)
    {
        return await _db.TimeLogs
            .Where(t => t.Date >= startDate && t.Date < endDate)
            .SumAsync(t => t.HoursWorked * t.Employee.HourlyRate);
    }

    [HttpGet("charts")]
    public async Task<ActionResult<List<DailyStatDto>>> GetChartData(
        [FromQuery] string? from, [FromQuery] string? to)
    {
        var (startDate, endDate) = GetDateRange(from, to);

        var rawStats = await _db.RepairRequests
            .Where(r => r.CompletedAt.HasValue
                     && r.CompletedAt >= startDate
                     && r.CompletedAt < endDate
                     && (r.Status == "Ready" || r.Status == "Closed"))
            .GroupBy(r => r.CompletedAt.Value.Date)
            .Select(g => new
            {
                RawDate = g.Key,
                Revenue = g.Sum(r => r.Price ?? 0),
                Count = g.Count(),
            })
            .OrderBy(s => s.RawDate)
            .ToListAsync();

        var stats = rawStats.Select(s => new DailyStatDto
        {
            Date = s.RawDate.ToString("dd.MM"),
            Revenue = s.Revenue,
            Count = s.Count,
        }).ToList();

        return Ok(stats);
    }

    [HttpGet("top-technicians")]
    public async Task<ActionResult<List<TopPersonDto>>> GetTopTechnicians(
        [FromQuery] string? from, [FromQuery] string? to)
    {
        var (startDate, endDate) = GetDateRange(from, to);

        var topTechs = await _db.RepairRequests
            .Where(r => r.TechnicianId != null
                     && r.Price.HasValue
                     && r.CompletedAt.HasValue
                     && r.CompletedAt >= startDate
                     && r.CompletedAt < endDate
                     && (r.Status == "Ready" || r.Status == "Closed"))
            .GroupBy(r => new { r.TechnicianId, r.Technician.Name })
            .Select(g => new TopPersonDto
            {
                Id = g.Key.TechnicianId!.Value,
                Name = g.Key.Name ?? "Неизвестный мастер",
                Revenue = g.Sum(r => r.Price!.Value),
                RequestsCount = g.Count(),
            })
            .OrderByDescending(t => t.Revenue)
            .Take(5)
            .ToListAsync();

        return Ok(topTechs);
    }

    [HttpGet("top-clients")]
    public async Task<ActionResult<List<TopPersonDto>>> GetTopClients(
        [FromQuery] string? from, [FromQuery] string? to)
    {
        var (startDate, endDate) = GetDateRange(from, to);

        var topClients = await _db.RepairRequests
            .Where(r => r.Price.HasValue
                     && r.CompletedAt.HasValue
                     && r.CompletedAt >= startDate
                     && r.CompletedAt < endDate
                     && (r.Status == "Ready" || r.Status == "Closed"))
            .GroupBy(r => new { r.ClientId, r.Client.Name })
            .Select(g => new TopPersonDto
            {
                Id = g.Key.ClientId,
                Name = g.Key.Name ?? "Неизвестный клиент",
                Revenue = g.Sum(r => r.Price!.Value),
                RequestsCount = g.Count(),
            })
            .OrderByDescending(t => t.Revenue)
            .Take(5)
            .ToListAsync();

        return Ok(topClients);
    }

    private static (DateTime startDate, DateTime endDate) GetDateRange(string? from, string? to)
    {
        var now = DateTime.UtcNow;

        var startDate = DateTime.ParseExact(from ?? $"{now.Year}-{now.Month:D2}-01",
            "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal);

        if (!string.IsNullOrEmpty(to))
        {
            var endDate = DateTime.ParseExact(to, "yyyy-MM-dd",
                CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal);
            return (startDate, endDate);
        }

        var end = startDate.AddMonths(1);
        return (startDate, end);
    }
}
