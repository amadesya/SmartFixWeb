using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using SmartFixApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System;
using System.Text.Json.Serialization;

namespace SmartFixApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase {
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public ServicesController(AppDbContext db, IWebHostEnvironment env)
    { 
        _db = db; 
        _env = env;
    }

    [HttpGet]
    public async Task<IEnumerable<Service>> Get() => await _db.Services.ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Service>> GetById(int id)
    {
        var service = await _db.Services.FindAsync(id);
        if (service == null) return NotFound();
        return service;
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var service = await _db.Services.FindAsync(id);
        if (service == null) return NotFound();
        _db.Services.Remove(service);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Услуга успешно удалена", serviceId = id });
    }

    public class ServiceDto
    {
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        
        [JsonIgnore]
        public IFormFile? ImageFile { get; set; }
    }

    [HttpPost]
    public async Task<ActionResult<Service>> Create()
    {
        var dto = new ServiceDto();
        
        if (Request.HasFormContentType)
        {
            dto.Name = Request.Form["Name"].ToString() ?? "";
            dto.Description = Request.Form["Description"].ToString();
            if (decimal.TryParse(Request.Form["Price"].ToString(), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var price)) dto.Price = price;
            dto.ImageUrl = Request.Form["ImageUrl"].ToString();
            dto.ImageFile = Request.Form.Files.GetFile("ImageFile");
        }
        else if (Request.HasJsonContentType())
        {
            dto = await Request.ReadFromJsonAsync<ServiceDto>() ?? new ServiceDto();
        }
        else
        {
            return BadRequest("Unsupported Content-Type");
        }

        string? imageUrl = dto.ImageUrl;

        if (dto.ImageFile != null)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + dto.ImageFile.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);
            
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await dto.ImageFile.CopyToAsync(fileStream);
            }
            imageUrl = "/uploads/" + uniqueFileName;
        }

        var service = new Service
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = imageUrl
        };
        _db.Services.Add(service);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = service.Id }, service);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id)
    {
        var dto = new ServiceDto();
        
        if (Request.HasFormContentType)
        {
            dto.Name = Request.Form["Name"].ToString() ?? "";
            dto.Description = Request.Form["Description"].ToString();
            if (decimal.TryParse(Request.Form["Price"].ToString(), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var price)) dto.Price = price;
            dto.ImageUrl = Request.Form["ImageUrl"].ToString();
            dto.ImageFile = Request.Form.Files.GetFile("ImageFile");
        }
        else if (Request.HasJsonContentType())
        {
            dto = await Request.ReadFromJsonAsync<ServiceDto>() ?? new ServiceDto();
        }
        else
        {
            return BadRequest("Unsupported Content-Type");
        }

        var service = await _db.Services.FindAsync(id);
        if (service == null) return NotFound();

        string? imageUrl = dto.ImageUrl ?? service.ImageUrl;

        if (dto.ImageFile != null)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + dto.ImageFile.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);
            
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await dto.ImageFile.CopyToAsync(fileStream);
            }
            imageUrl = "/uploads/" + uniqueFileName;
        }

        service.Name = dto.Name;
        service.Description = dto.Description;
        service.Price = dto.Price;
        service.ImageUrl = imageUrl;

        _db.Entry(service).State = EntityState.Modified;
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
