﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using SmartFixApi.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using SmartFixApi.Hubs;

namespace SmartFixApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SparePartsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public SparePartsController(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SparePart>>> GetSpareParts()
        {
            var spareParts = await _context.SpareParts.Include(p => p.Type).ToListAsync();
            return Ok(spareParts);
        }

        [HttpPost("purchase")]
        public async Task<IActionResult> PurchasePart([FromBody] SparePart part)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int? userId = string.IsNullOrEmpty(userIdStr) ? null : int.Parse(userIdStr);

            var existingPart = await _context.SpareParts
                .FirstOrDefaultAsync(p => p.Name.ToLower() == part.Name.ToLower());

            if (existingPart != null)
            {
                existingPart.StockQuantity += part.StockQuantity;
                existingPart.PurchasePrice = part.PurchasePrice;

                _context.Set<StockMovement>().Add(new StockMovement {
                    SparePartId = existingPart.Id,
                    Quantity = part.StockQuantity,
                    Type = "Приход",
                    UserId = userId,
                    Date = DateTime.UtcNow,
                    Comment = "Закупка существующей запчасти",
                    RemainingStock = existingPart.StockQuantity
                });
            }
            else
            {
                _context.SpareParts.Add(part);

                _context.Set<StockMovement>().Add(new StockMovement {
                    SparePart = part, // Используем навигационное свойство, так как Id еще не присвоен базой
                    Quantity = part.StockQuantity,
                    Type = "Приход",
                    UserId = userId,
                    Date = DateTime.UtcNow,
                    Comment = "Закупка новой запчасти",
                    RemainingStock = part.StockQuantity
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Закупка успешно оформлена" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSparePart(int id)
        {
            var part = await _context.SpareParts.FindAsync(id);
            if (part == null)
            {
                return NotFound();
            }

            _context.SpareParts.Remove(part);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSparePart(int id, [FromBody] SparePart sparePart)
        {
            if (id != sparePart.Id)
            {
                return BadRequest("ID в URL и в теле запроса не совпадают");
            }

            var existingPart = await _context.SpareParts.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            if (existingPart == null)
            {
                return NotFound();
            }

            var quantityDifference = sparePart.StockQuantity - existingPart.StockQuantity;

            _context.Entry(sparePart).State = EntityState.Modified;

            if (quantityDifference != 0)
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int? userId = string.IsNullOrEmpty(userIdStr) ? null : int.Parse(userIdStr);

                _context.Set<StockMovement>().Add(new StockMovement {
                    SparePartId = sparePart.Id,
                    Quantity = quantityDifference,
                    Type = quantityDifference > 0 ? "Приход" : "Расход",
                    UserId = userId,
                    Date = DateTime.UtcNow,
                    Comment = "Ручное изменение количества",
                    RemainingStock = sparePart.StockQuantity
                });

                // Проверка на низкий остаток при ручном списании
                if (sparePart.StockQuantity <= 3 && quantityDifference < 0)
                {
                    _context.Set<Notification>().Add(new Notification
                    {
                        Message = $"Внимание: запас детали '{sparePart.Name}' заканчивается. Осталось: {sparePart.StockQuantity} шт.",
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false
                    });
                }
            }

            try
            {
                await _context.SaveChangesAsync();
                await _hubContext.Clients.All.SendAsync("ReceiveNotification");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.SpareParts.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); 
        }
    }
}
