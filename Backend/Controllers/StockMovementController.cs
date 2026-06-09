using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using SmartFixApi.Models;
using System.Linq;
using System.Threading.Tasks;

namespace SmartFixApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Можно ограничить ролями, например [Authorize(Roles = "1,2")]
    public class StockMovementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockMovementController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/StockMovement
        [HttpGet]
        public async Task<IActionResult> GetAllMovements([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? type = null, [FromQuery] string? search = null)
        {
            var query = _context.Set<StockMovement>()
                .Include(m => m.SparePart)
                .Include(m => m.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(type))
                query = query.Where(m => m.Type == type);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(m => m.SparePart != null && m.SparePart.Name.Contains(search));

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var movements = await query
                .OrderByDescending(m => m.Date)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new {
                    m.Id,
                    m.SparePartId,
                    PartName = m.SparePart != null ? m.SparePart.Name : "Неизвестно",
                    m.Quantity,
                    m.Type,
                    m.Date,
                    m.Comment,
                    m.RemainingStock,
                    EmployeeName = m.User != null ? m.User.Name : "Система"
                })
                .ToListAsync();
            return Ok(new {
                Items = movements,
                TotalPages = totalPages,
                CurrentPage = page,
                TotalCount = totalCount
            });
        }

        // GET: api/StockMovement/part/{id}
        [HttpGet("part/{id}")]
        public async Task<IActionResult> GetByPartId(int id)
        {
            var movements = await _context.Set<StockMovement>()
                .Where(m => m.SparePartId == id)
                .OrderByDescending(m => m.Date)
                .ToListAsync();
            return Ok(movements);
        }

        // GET: /api/stock/history/{partId}
        [HttpGet("/api/stock/history/{partId}")]
        public async Task<IActionResult> GetStockHistoryByPartId(int partId)
        {
            var movements = await _context.Set<StockMovement>()
                .Where(m => m.SparePartId == partId)
                .OrderByDescending(m => m.Date)
                .ToListAsync();
            return Ok(movements);
        }
    }
}