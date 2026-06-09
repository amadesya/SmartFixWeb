using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using SmartFixApi.Models;

namespace SmartFixApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SparePartTypesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SparePartTypesController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Получить все типы
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SparePartType>>> GetSparePartTypes()
        {
            return await _context.SparePartType.ToListAsync();
        }

        // 2. Получить один тип по ID
        [HttpGet("{id}")] // Добавляем {id} в маршрут
        public async Task<IActionResult> GetDetails(int id)
        {
            var sparePartType = await _context.SparePartType.FindAsync(id);
            if (sparePartType == null) return NotFound();
            return Ok(sparePartType);
        }

        // 3. Создать новый тип (именно этот метод вызовет ваш React)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SparePartType sparePartType)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.SparePartType.Add(sparePartType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetails), new { id = sparePartType.Id }, sparePartType);
        }

        // 4. Редактировать (обычно используется PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] SparePartType sparePartType)
        {
            if (id != sparePartType.Id) return BadRequest();

            _context.Entry(sparePartType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.SparePartType.Any(e => e.Id == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // 5. Удалить
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var sparePartType = await _context.SparePartType.FindAsync(id);
            if (sparePartType == null) return NotFound();

            _context.SparePartType.Remove(sparePartType);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
