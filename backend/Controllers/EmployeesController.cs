﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using SmartFixApi.Models;
using SmartFixApi.DTO;

namespace SmartFixApi.Controllers // Используй namespace твоего проекта
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context; // Замени на имя твоего контекста БД

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        // READ: Получить всех сотрудников (GET /api/employees)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployees()
        {
            var employees = await _context.Employees
                .Include(e => e.User)
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    UserId = e.UserId,
                    UserName = e.User.Name,
                    UserRole = e.User.Role,
                    Avatar = e.User.Avatar,
                    BaseSalary = e.BaseSalary,
                    BonusPercentage = e.BonusPercentage,
                })
                .ToListAsync();

            return Ok(employees);
        }

        // READ: Получить сотрудника по ID (GET /api/employees/5)
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployee(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.User)
                .Where(e => e.Id == id)
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    UserId = e.UserId,
                    UserName = e.User.Name,
                    UserRole = e.User.Role,
                    Avatar = e.User.Avatar,
                    BaseSalary = e.BaseSalary,
                    BonusPercentage = e.BonusPercentage,
                })
                .FirstOrDefaultAsync();

            if (employee == null)
            {
                return NotFound(new { message = "Сотрудник не найден" });
            }

            return Ok(employee);
        }

        // CREATE: Создать профиль сотрудника для пользователя (POST /api/employees)
        [HttpPost]
        public async Task<ActionResult<EmployeeDto>> CreateEmployee(CreateEmployeeDto dto)
        {
            // Проверяем, существует ли пользователь
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null)
            {
                return NotFound(new { message = "Пользователь не найден" });
            }

            // КЛЮЧЕВАЯ ПРОВЕРКА: Сотрудником может быть только Role 1 или 2
            if (user.Role != 1 && user.Role != 2)
            {
                return BadRequest(new { message = "Сотрудником может стать только пользователь с ролью 1 или 2" });
            }

            // Проверяем, нет ли уже профиля сотрудника у этого пользователя
            var existingEmployee = await _context.Employees.FirstOrDefaultAsync(e => e.UserId == dto.UserId);
            if (existingEmployee != null)
            {
                return BadRequest(new { message = "Профиль сотрудника для этого пользователя уже существует" });
            }

            var newEmployee = new Employee
            {
                UserId = dto.UserId,
                BaseSalary = dto.BaseSalary,
                BonusPercentage = dto.BonusPercentage
            };

            _context.Employees.Add(newEmployee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = newEmployee.Id }, dto);
        }

        // UPDATE: Обновить зарплату сотрудника (PUT /api/employees/5)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto dto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound(new { message = "Сотрудник не найден" });
            }

            employee.BaseSalary = dto.BaseSalary;
            employee.BonusPercentage = dto.BonusPercentage;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id)) return NotFound();
                else throw;
            }

            return Ok(new { message = "Успешно обновлено" });
        }

        // DELETE: Удалить профиль сотрудника (DELETE /api/employees/5)
        // Обрати внимание: это удалит только данные о зарплате, сам User останется в базе
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound(new { message = "Сотрудник не найден" });
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.Id == id);
        }
    }
}