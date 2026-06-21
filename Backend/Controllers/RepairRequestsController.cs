using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartFixApi.Data;
using SmartFixApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Configuration;
using WebPush;
using Microsoft.AspNetCore.SignalR;
using SmartFixApi.Hubs;
using SmartFixApi.DTO;

namespace SmartFixApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RepairRequestsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITelegramService _telegramService;
    private readonly IConfiguration _configuration;
    private readonly IHubContext<NotificationHub> _hubContext;
    public RepairRequestsController(AppDbContext db, ITelegramService telegramService, IConfiguration configuration, IHubContext<NotificationHub> hubContext)
    {
        _db = db;
        _telegramService = telegramService;
        _configuration = configuration;
        _hubContext = hubContext;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RepairRequestDto>>> GetRepairRequests()
    {
        try
        {
            var currentUserIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUserRoleStr = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(currentUserIdStr)) return Unauthorized();

            var currentUserId = int.Parse(currentUserIdStr);
            var currentUserRole = int.Parse(currentUserRoleStr ?? "0");

            var requestsQuery = _db.RepairRequests
                .Include(r => r.Comments)
                .AsQueryable();

            // Безопасность: Обычный клиент может получить только свои заявки
            if (currentUserRole == 0)
                requestsQuery = requestsQuery.Where(r => r.ClientId == currentUserId);

            var requests = await requestsQuery.ToListAsync();

            if (requests.Count == 0)
                return Ok(Array.Empty<RepairRequestDto>());

            var userIds = requests
                .Select(r => r.ClientId)
                .Concat(requests.Where(r => r.TechnicianId.HasValue).Select(r => r.TechnicianId!.Value))
                .Distinct()
                .ToList();

            var users = await _db.Users
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id);

            var result = requests.Select(r => MapToListDto(r, users)).ToList();

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Error] GetRepairRequests: {ex.Message}\n{ex.StackTrace}");
            return StatusCode(500, new { message = "Внутренняя ошибка сервера при получении списка заявок.", details = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<RepairRequestDto>> GetRepairRequestById(int id)
    {
        var currentUserIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUserRoleStr = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(currentUserIdStr)) return Unauthorized();

        var currentUserId = int.Parse(currentUserIdStr);
        var currentUserRole = int.Parse(currentUserRoleStr ?? "0");

        // Ищем конкретную заявку по ID в базе
        var r = await _db.RepairRequests
            .Include(r => r.Comments)
            .Include(r => r.RepairServices)
                .ThenInclude(rs => rs.Service)
            .Include(r => r.RepairParts)
                .ThenInclude(rp => rp.SparePart)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (r == null)
        {
            return NotFound(); // Если заявки нет, возвращаем 404
        }

        // Безопасность: Запрещаем клиенту смотреть детали чужих заявок
        if (currentUserRole == 0 && r.ClientId != currentUserId)
        {
            return Forbid();
        }

        // Загружаем только нужных пользователей (клиента и мастера)
        var client = await _db.Users.FindAsync(r.ClientId);
        var technician = r.TechnicianId.HasValue
            ? await _db.Users.FindAsync(r.TechnicianId.Value)
            : null;

        // Достаем отзыв к этой заявке, если он есть
        var review = await _db.Reviews.FirstOrDefaultAsync(rev => rev.RepairRequestId == id);

        // Вычисляем скиданную цену
        decimal? discountedPrice = r.Price;
        if (r.Price.HasValue && client != null)
        {
            // Применяем скидку, если статус заявки ещё не переведен в Готова
            if (r.Status != "Ready" && r.Status != "Готова" && r.Status != "Closed" && r.Status != "Закрыта" && r.Status != "Выдан")
            {
                decimal discountMultiplier = (100m - client.PersonalDiscount) / 100m;
                discountedPrice = r.Price.Value * discountMultiplier;
            }
        }

        // Создаем DTO для одной заявки
        var result = new RepairRequestDto
        {
            Id = r.Id,
            ClientId = r.ClientId,
            ClientName = client?.Name ?? "Неизвестно",
            TechnicianId = r.TechnicianId,
            TechnicianName = technician?.Name ?? "Не назначен",
            Device = r.Device ?? string.Empty,
            IssueDescription = r.IssueDescription ?? string.Empty,
            Status = r.Status ?? string.Empty,
            CreatedAt = r.CreatedAt,
            Comments = MapComments(r.Comments),
            Price = r.Price,
            DiscountedPrice = discountedPrice,
            IsPaid = r.IsPaid,
            HasReview = review != null, // Флаг наличия
            ReviewRating = review?.Rating,
            ReviewBody = review?.Body,

            RepairServices = r.RepairServices.ToList(),
            RepairParts = r.RepairParts.ToList()
        };

        return Ok(result);
    }

    [HttpGet("technician/{id}")]
    public async Task<IEnumerable<RepairRequestDto>> GetByTechnician(int id)
    {
        try
        {
            var requests = await _db.RepairRequests
                .Include(r => r.Comments)
                .Where(r => r.TechnicianId == id)
                .ToListAsync();

            if (requests.Count == 0)
                return Array.Empty<RepairRequestDto>();

            var userIds = requests
                .Select(r => r.ClientId)
                .Concat(requests.Where(r => r.TechnicianId.HasValue).Select(r => r.TechnicianId!.Value))
                .Distinct()
                .ToList();

            var users = await _db.Users
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id);

            return requests.Select(r => MapToListDto(r, users)).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Error] GetByTechnician: {ex.Message}\n{ex.StackTrace}");
            return Array.Empty<RepairRequestDto>();
        }
    }

    [HttpPost]
    public async Task<ActionResult<RepairRequest>> CreateRepairRequest([FromBody] RepairRequestCreateDto dto)
    {
        if (!await _db.Users.AnyAsync(u => u.Id == dto.ClientId))
            return BadRequest("Client not found");

        if (dto.TechnicianId.HasValue)
        {
            if (!await _db.Users.AnyAsync(u => u.Id == dto.TechnicianId.Value))
                return BadRequest("Technician not found");
        }

        var request = new RepairRequest
        {
            ClientId = dto.ClientId,
            TechnicianId = dto.TechnicianId,
            Device = dto.Device,
            IssueDescription = dto.IssueDescription,
            Status = "New",
            CreatedAt = DateTime.UtcNow
        };

        _db.RepairRequests.Add(request);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRepairRequests),
                            new { id = request.Id },
                            request);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRepairRequest(int id, [FromBody] RepairRequestUpdateDto dto)
    {
        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var request = await _db.RepairRequests
                .Include(r => r.Client)
                .Include(r => r.RepairParts)
                .ThenInclude(rp => rp.SparePart)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null)
                return NotFound($"Repair request with id={id} not found.");

            request.Device = dto.Device;
            request.IssueDescription = dto.IssueDescription;

            bool partsReturned = false;

            // Возврат запчастей при отмене/переводе в работу (кроме Готова / Закрыта / Выдан / Ready)
            if (dto.Status != "Готова" && dto.Status != "Закрыта" && dto.Status != "Выдан" && dto.Status != "Ready")
            {
                if (request.RepairParts.Any())
                {
                    partsReturned = true;
                    foreach (var rp in request.RepairParts)
                    {
                        if (rp.SparePart != null)
                        {
                            rp.SparePart.StockQuantity += rp.Quantity;
                            _db.Set<StockMovement>().Add(new StockMovement
                            {
                                SparePartId = rp.SparePart.Id,
                                Quantity = rp.Quantity,
                                Type = "Приход",
                                Date = DateTime.UtcNow,
                                Comment = $"Возврат: удалена из заявки №{id}",
                                RemainingStock = rp.SparePart.StockQuantity
                            });
                        }

                        request.Price -= rp.PriceAtTheTime;
                        if (request.Price < 0) request.Price = 0;
                        request.PartsCost -= (rp.Quantity * (rp.SparePart?.PurchasePrice ?? 0));
                        if (request.PartsCost < 0) request.PartsCost = 0;
                    }
                    _db.RepairParts.RemoveRange(request.RepairParts);
                }
            }

            string oldStatus = request.Status;

            request.Status = dto.Status;

            if (dto.TechnicianId.HasValue && dto.TechnicianId.Value > 0)
            {
                bool technicianExists = await _db.Users.AnyAsync(u => u.Id == dto.TechnicianId.Value && u.Role == 1);
                if (!technicianExists)
                    return BadRequest("Technician not found or user is not a technician.");

                request.TechnicianId = dto.TechnicianId;
            }
            else
            {
                // Если пришел null или 0, сбрасываем мастера (Не назначен)
                request.TechnicianId = null;
            }

            if (dto.Price.HasValue)
            {
                if (dto.Price.Value < 0)
                    return BadRequest("Price cannot be negative.");

                request.Price = dto.Price.Value;
            }
            await _db.SaveChangesAsync();

            // == БЛОК УВЕДОМЛЕНИЙ В БД ДЛЯ КЛИЕНТА ===
            if (oldStatus != "Ready" && oldStatus != "Готова" && (request.Status == "Ready" || request.Status == "Готова"))
            {
                if (request.Client != null)
                {
                    decimal currentPrice = request.Price.GetValueOrDefault();
                    decimal discountMultiplier = (100m - request.Client.PersonalDiscount) / 100m;
                    currentPrice *= discountMultiplier;

                    // Вычитаем списанные ранее бонусы, если они были применены при предоплате
                    if (request.BonusesSubtracted.HasValue && request.BonusesSubtracted.Value > 0)
                    {
                        currentPrice -= request.BonusesSubtracted.Value;
                        if (currentPrice < 0) currentPrice = 0;
                    }

                    request.Price = currentPrice;

                    request.Client.TotalSpent += currentPrice;
                    request.Client.BonusPoints += currentPrice * 0.05m;

                    if (request.Client.TotalSpent >= 50000)
                    {
                        request.Client.LoyaltyTier = LoyaltyTier.Gold;
                        request.Client.PersonalDiscount = 15;
                    }
                    else if (request.Client.TotalSpent >= 10000)
                    {
                        request.Client.LoyaltyTier = LoyaltyTier.Silver;
                        request.Client.PersonalDiscount = 10;
                    }
                }

                _db.Notifications.Add(new Notification
                {
                    Message = $"Ваше устройство {request.Device} готово к выдаче!",
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false,
                    UserId = request.ClientId
                });
            }

            // == БЛОК С ТЕЛЕГРАМОМ ===
            // Меняем "Готово" на "Ready", так как именно это слово приходит с фронтенда
            if (request.Client != null && request.Client.TelegramChatId.HasValue && request.Status == "Ready")
            {
                var message = $"🔧 <b>Заявка #{request.Id} готова!</b>\n\n" +
                              $"Устройство: {request.Device}\n" +
                              $"Вы можете забрать ваше устройство.";

                await _telegramService.SendNotificationAsync(request.Client.TelegramChatId.Value, message);
            }

            // === БЛОК ДЛЯ БРАУЗЕРНЫХ WEB PUSH УВЕДОМЛЕНИЙ ===
            if (request.Client != null && !string.IsNullOrEmpty(request.Client.PushEndpoint) && request.Status == "Ready")
            {
                var subject = _configuration["VapidKeys:Subject"];
                var publicKey = _configuration["VapidKeys:PublicKey"];
                var privateKey = _configuration["VapidKeys:PrivateKey"];

                var vapidDetails = new VapidDetails(subject, publicKey, privateKey);
                var webPushClient = new WebPushClient();

                var subscription = new PushSubscription(
                    request.Client.PushEndpoint,
                    request.Client.PushP256DH,
                    request.Client.PushAuth
                );

                var payload = $"{{\"title\":\"SmartFix\", \"message\":\"Ваше устройство {request.Device} готово!\", \"url\":\"/\"}}";

                try
                {
                    await webPushClient.SendNotificationAsync(subscription, payload, vapidDetails);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Ошибка отправки Web Push: {ex.Message}");
                }
            }

            await transaction.CommitAsync();
            await _hubContext.Clients.All.SendAsync("ReceiveNotification");
            return Ok(new { request, partsReturned });
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, "Ошибка при обновлении заявки");
        }
    }

    // Отдельный метод для обновления только цены заявки
    [HttpPut("{id}/price")]
    public async Task<IActionResult> UpdatePrice(int id, [FromBody] UpdatePriceDto dto)
    {
        var request = await _db.RepairRequests
                .Include(r => r.RepairServices)
                .Include(r => r.RepairParts)
                .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null) return NotFound();
        if (dto == null || dto.Price < 0) return BadRequest("Invalid price");

        var servicesList = request.RepairServices.ToList();
        if (!servicesList.Any()) return BadRequest("В заказе нет услуг.");

        // 1. Определяем целевую сумму для услуг
        decimal totalPartsPrice = dto.HidePartsPrices ? 0 : request.RepairParts.Sum(p => p.PriceAtTheTime);

        if (dto.HidePartsPrices)
        {
            foreach (var part in request.RepairParts) part.PriceAtTheTime = 0;
        }

        decimal newServicesTarget = dto.Price - totalPartsPrice;
        if (newServicesTarget < 0) return BadRequest("Цена ниже стоимости запчастей.");

        // 2. Распределяем стоимость между услугами
        decimal currentServicesSum = servicesList.Sum(s => s.PriceAtTheTime ?? 0);
        decimal distributedSum = 0;

        for (int i = 0; i < servicesList.Count; i++)
        {
            var service = servicesList[i];
            if (i == servicesList.Count - 1)
            {
                service.PriceAtTheTime = newServicesTarget - distributedSum;
            }
            else
            {
                // Используем пропорциональное распределение или равные доли, если текущая сумма 0
                decimal newPrice = currentServicesSum > 0
                    ? Math.Round((service.PriceAtTheTime ?? 0) * (newServicesTarget / currentServicesSum), 2)
                    : Math.Round(newServicesTarget / servicesList.Count, 2);

                service.PriceAtTheTime = newPrice;
                distributedSum += newPrice;
            }
        }

        // 3. Расчет бонуса (ВНЕ ЦИКЛА)
        var employee = await _db.Employees.FirstOrDefaultAsync(e => e.UserId == request.TechnicianId);
        if (employee != null)
        {
            // ВАЖНО: Бонус лучше пересчитывать от всей суммы услуг, а не прибавлять разницу
            // иначе при повторном запросе бонус удвоится
            request.MasterBonus = newServicesTarget * (employee.BonusPercentage / 100);
        }

        decimal finalPrice = dto.Price;
        if (request.Status == "Ready" || request.Status == "Готова" || request.Status == "Closed" || request.Status == "Закрыта" || request.Status == "Выдан")
        {
            var client = await _db.Users.FindAsync(request.ClientId);
            if (client != null)
            {
                decimal discountMultiplier = (100m - client.PersonalDiscount) / 100m;
                finalPrice *= discountMultiplier;
            }
        }

        request.Price = finalPrice;
        if (request.MasterBonus < 0) request.MasterBonus = 0;

        await _db.SaveChangesAsync(); // EF сам поймет, какие RecordId в RepairServices нужно обновить

        return Ok(new { id = request.Id, price = request.Price });
    }
    // Получить информацию о цене заявки
    [HttpGet("{id}/price")]
    public async Task<IActionResult> GetPrice(int id)
    {
        var request = await _db.RepairRequests.FindAsync(id);

        if (request == null)
            return NotFound(new { message = $"Repair request with id={id} not found." });

        return Ok(new { id = request.Id, price = request.Price });
    }

    // НОВЫЙ МЕТОД ДЛЯ ИМПОРТА
    [HttpPost("import")]
    public async Task<ActionResult<ImportResult>> ImportRequests([FromBody] List<RepairRequestImportDto> requests)
    {
        try
        {
            int imported = 0;
            int skipped = 0;
            var errors = new List<string>();

            foreach (var dto in requests)
            {
                // Валидация обязательных полей
                if (dto.ClientId <= 0)
                {
                    errors.Add($"Пропущена запись: не указан ID клиента");
                    skipped++;
                    continue;
                }

                if (string.IsNullOrEmpty(dto.Device))
                {
                    errors.Add($"Пропущена запись (ClientId={dto.ClientId}): не указано устройство");
                    skipped++;
                    continue;
                }

                // Проверка существования клиента
                if (!await _db.Users.AnyAsync(u => u.Id == dto.ClientId))
                {
                    errors.Add($"Пропущена запись: клиент с ID {dto.ClientId} не найден");
                    skipped++;
                    continue;
                }

                // Проверка существования мастера (если указан)
                if (dto.TechnicianId.HasValue)
                {
                    if (!await _db.Users.AnyAsync(u => u.Id == dto.TechnicianId.Value && u.Role == 1))
                    {
                        errors.Add($"Пропущена запись: мастер с ID {dto.TechnicianId} не найден");
                        skipped++;
                        continue;
                    }
                }

                var request = new RepairRequest
                {
                    ClientId = dto.ClientId,
                    TechnicianId = dto.TechnicianId,
                    Device = dto.Device,
                    IssueDescription = dto.IssueDescription ?? "",
                    Status = string.IsNullOrEmpty(dto.Status) ? "New" : dto.Status,
                    CreatedAt = dto.CreatedAt ?? DateTime.UtcNow,
                    Comments = new List<Comment>()
                };

                _db.RepairRequests.Add(request);
                imported++;
            }

            // Сохраняем все изменения одной транзакцией
            if (imported > 0)
            {
                await _db.SaveChangesAsync();
            }

            return Ok(new ImportResult
            {
                Imported = imported,
                Skipped = skipped,
                Errors = errors
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Ошибка импорта", error = ex.Message });
        }
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRepairRequest(int id)
    {
        var request = await _db.RepairRequests
            .Include(r => r.Comments)
            .Include(r => r.RepairServices)
            .Include(r => r.RepairParts)
                .ThenInclude(rp => rp.SparePart)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null)
            return NotFound($"Repair request with id={id} not found.");

        // 1. Удаляем комментарии
        if (request.Comments.Any())
            _db.Comments.RemoveRange(request.Comments);

        // 2. Удаляем услуги
        if (request.RepairServices.Any())
            _db.RepairServices.RemoveRange(request.RepairServices);

        // 3. Возвращаем запчасти на склад и удаляем их из заявки
        if (request.RepairParts.Any())
        {
            foreach (var rp in request.RepairParts)
            {
                if (rp.SparePart != null)
                {
                    rp.SparePart.StockQuantity += rp.Quantity;
                    _db.Set<StockMovement>().Add(new StockMovement
                    {
                        SparePartId = rp.SparePart.Id,
                        Quantity = rp.Quantity,
                        Type = "Приход",
                        Date = DateTime.UtcNow,
                        Comment = $"Возврат: удалена заявка №{id}",
                        RemainingStock = rp.SparePart.StockQuantity
                    });
                }
            }
            _db.RepairParts.RemoveRange(request.RepairParts);
        }

        // 4. Ищем связанные отзывы и удаляем их (включая ответы)
        var reviews = await _db.Reviews.Where(r => r.RepairRequestId == id).ToListAsync();
        if (reviews.Any())
        {
            var parentIds = reviews.Select(r => r.Id).ToList();
            var replies = await _db.Reviews.Where(r => r.ParentId.HasValue && parentIds.Contains(r.ParentId.Value)).ToListAsync();
            _db.Reviews.RemoveRange(replies);
            _db.Reviews.RemoveRange(reviews);
        }

        _db.RepairRequests.Remove(request);
        await _db.SaveChangesAsync();

        return NoContent(); // 204
    }


    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateRequestStatusDto dto)
    {
        var request = await _db.RepairRequests
            .Include(r => r.Client)
            .Include(r => r.RepairServices)
            .Include(r => r.Technician)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null) return NotFound();

        // 2. ОТСЛЕЖИВАНИЕ ВРЕМЕНИ
        // Если статус меняется на "Готова" или "Закрыта" впервые — фиксируем время
        if ((dto.Status == "Готова" || dto.Status == "Закрыта") && request.CompletedAt == null)
        {
            request.CompletedAt = DateTime.UtcNow;
        }

        // 1. СВЯЗЬ УСЛУГ И 3. ФИКСАЦИЯ ФИНАНСОВ
        // Если ремонт завершен, фиксируем цены и бонусы
        if (dto.Status == "Готова" && dto.ServiceIds != null)
        {
            // Очищаем старые привязки услуг (если были)
            _db.RepairServices.RemoveRange(request.RepairServices);

            decimal totalServicesPrice = 0;
            foreach (var sId in dto.ServiceIds)
            {
                var service = await _db.Services.FindAsync(sId);
                if (service != null)
                {
                    totalServicesPrice += service.Price;
                    _db.RepairServices.Add(new RepairServices
                    {
                        RepairRequestId = id,
                        ServiceId = sId,
                        PriceAtTheTime = service.Price // Фиксируем цену на момент ремонта
                    });
                }
            }

            request.Price = totalServicesPrice;

            // Расчет бонуса мастера (3. Фиксация финансов)
            if (request.TechnicianId != null)
            {
                var employee = await _db.Employees
                    .FirstOrDefaultAsync(e => e.UserId == request.TechnicianId);

                if (employee != null)
                {
                    // Считаем бонус от стоимости услуг
                    request.MasterBonus = totalServicesPrice * (employee.BonusPercentage / 100);
                }
            }

            // Фиксация затрат на запчасти (вытягиваем из таблицы repairparts)
            request.PartsCost = await _db.RepairParts
                .Where(p => p.RepairRequestId == id)
                .SumAsync(p => p.Quantity * p.SparePart.PurchasePrice);
        }

        if (request.Status != "Ready" && request.Status != "Готова" && (dto.Status == "Ready" || dto.Status == "Готова"))
        {
            if (request.Client != null)
            {
                decimal currentPrice = request.Price.GetValueOrDefault();
                decimal discountMultiplier = (100m - request.Client.PersonalDiscount) / 100m;
                currentPrice *= discountMultiplier;
                request.Price = currentPrice;

                request.Client.TotalSpent += currentPrice;
                request.Client.BonusPoints += currentPrice * 0.05m;

                if (request.Client.TotalSpent >= 50000)
                {
                    request.Client.LoyaltyTier = LoyaltyTier.Gold;
                    request.Client.PersonalDiscount = 15;
                }
                else if (request.Client.TotalSpent >= 10000)
                {
                    request.Client.LoyaltyTier = LoyaltyTier.Silver;
                    request.Client.PersonalDiscount = 10;
                }
            }

            _db.Notifications.Add(new Notification
            {
                Message = $"Ваша заявка №{id} (Устройство: {request.Device}) выполнена и готова к выдаче!",
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
                UserId = request.ClientId
            });
        }

        request.Status = dto.Status;
        await _db.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("ReceiveNotification");

        return Ok(new { message = "Статус и финансовые показатели обновлены" });
    }

    [HttpPost("{id}/services")]
    public async Task<IActionResult> AddServiceToRequest(int id, [FromBody] RepairServiceItemDto dto)
    {
        var request = await _db.RepairRequests.FindAsync(id);
        if (request == null) return NotFound("Заявка не найдена");

        var service = await _db.Services.FindAsync(dto.Id);
        if (service == null) return NotFound("Услуга не найдена");

        var newService = new RepairServices
        {
            RepairRequestId = id,
            ServiceId = service.Id,
            PriceAtTheTime = dto.Price > 0 ? dto.Price : service.Price
        };

        _db.RepairServices.Add(newService);
        request.Price += newService.PriceAtTheTime;

        if (request.TechnicianId != null)
        {
            var employee = await _db.Employees.FirstOrDefaultAsync(e => e.UserId == request.TechnicianId);
            if (employee != null)
            {
                request.MasterBonus = (request.MasterBonus ?? 0) + newService.PriceAtTheTime * (employee.BonusPercentage / 100);
            }
        }

        await _db.SaveChangesAsync();

        return Ok(new { message = "Услуга добавлена", id = newService.Id });
    }

    [HttpPost("{id}/parts")]
    public async Task<IActionResult> AddPartToRequest(int id, [FromBody] RepairPartItemDto dto)
    {
        var request = await _db.RepairRequests.FindAsync(id);
        if (request == null) return NotFound("Заявка не найдена");

        var part = await _db.SpareParts.FindAsync(dto.Id);
        if (part == null) return NotFound("Запчасть не найдена");

        if (part.StockQuantity < 1)
            return BadRequest(new { message = "Недостаточно запчастей на складе" });

        var newPart = new RepairPart
        {
            RepairRequestId = id,
            SparePartId = part.Id,
            PriceAtTheTime = dto.Price > 0 ? dto.Price : part.PurchasePrice,
            Quantity = 1
        };

        _db.RepairParts.Add(newPart);

        decimal priceToAdd = newPart.PriceAtTheTime;
        string status = request.Status?.Trim().ToLowerInvariant() ?? "";
        if (status == "Ready")
        {
            var client = await _db.Users.FindAsync(request.ClientId);
            if (client != null) priceToAdd *= (100m - client.PersonalDiscount) / 100m;
        }

        request.Price += priceToAdd;
        request.PartsCost += newPart.Quantity * part.PurchasePrice;

        part.StockQuantity -= 1;
        _db.Set<StockMovement>().Add(new StockMovement
        {
            SparePartId = part.Id,
            Quantity = -1,
            Type = "Расход",
            Date = DateTime.UtcNow,
            Comment = $"Использовано в заявке №{id}",
            RemainingStock = part.StockQuantity
        });

        // Проверка на низкий остаток на складе
        if (part.StockQuantity <= 3) // Укажите нужный порог
        {
            _db.Notifications.Add(new Notification
            {
                Message = $"Внимание: запас детали '{part.Name}' заканчивается. Осталось: {part.StockQuantity} шт.",
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            });
        }

        await _db.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("ReceiveNotification");

        return Ok(new { message = "Запчасть добавлена", id = newPart.Id });
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> CompleteRepair(int id, [FromBody] CompleteRepairPayloadDto dto)
    {
        var request = await _db.RepairRequests
            .Include(r => r.Client)
            .Include(r => r.RepairServices)
            .Include(r => r.RepairParts)
            .ThenInclude(rp => rp.SparePart)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null) return NotFound();

        // --- ШАГ 1: ВОЗВРАТ ОСТАТКОВ И ОЧИСТКА ---
        foreach (var oldPart in request.RepairParts)
        {
            if (oldPart.SparePart != null)
            {
                oldPart.SparePart.StockQuantity += oldPart.Quantity;
                _db.Set<StockMovement>().Add(new StockMovement
                {
                    SparePartId = oldPart.SparePart.Id,
                    Quantity = oldPart.Quantity,
                    Type = "Приход",
                    Date = DateTime.UtcNow,
                    Comment = $"Корректировка при сохранении заявки №{id}",
                    RemainingStock = oldPart.SparePart.StockQuantity
                });
            }
        }

        _db.RepairServices.RemoveRange(request.RepairServices);
        _db.RepairParts.RemoveRange(request.RepairParts);

        decimal totalCostForClient = 0;

        // --- ШАГ 2: ДОБАВЛЕНИЕ НОВЫХ УСЛУГ ---
        foreach (var sItem in dto.Services)
        {
            var service = await _db.Services.FindAsync(sItem.Id);
            if (service != null)
            {
                var newRepairService = new RepairServices
                {
                    RepairRequestId = id,
                    ServiceId = service.Id,
                    PriceAtTheTime = sItem.Price
                };
                _db.RepairServices.Add(newRepairService);
                totalCostForClient += sItem.Price;
            }
        }

        // --- ШАГ 3: ДОБАВЛЕНИЕ ЗАПЧАСТЕЙ С ПРОВЕРКОЙ ОСТАТКОВ ---
        foreach (var pItem in dto.Parts)
        {
            var part = await _db.SpareParts.FindAsync(pItem.Id);
            if (part != null)
            {
                if (part.StockQuantity <= 0)
                    return BadRequest(new { message = "Запчасти нет в наличии" });

                part.StockQuantity -= 1;
                _db.Set<StockMovement>().Add(new StockMovement
                {
                    SparePartId = part.Id,
                    Quantity = -1,
                    Type = "Расход",
                    Date = DateTime.UtcNow,
                    Comment = $"Списание по заказу №{id}",
                    RemainingStock = part.StockQuantity
                });

                // Проверка на низкий остаток на складе при закрытии заявки
                if (part.StockQuantity <= 3)
                {
                    _db.Notifications.Add(new Notification
                    {
                        Message = $"Внимание: запас детали '{part.Name}' заканчивается. Осталось: {part.StockQuantity} шт.",
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false
                    });
                }

                var newRepairPart = new RepairPart
                {
                    RepairRequestId = id,
                    SparePartId = part.Id,
                    PriceAtTheTime = pItem.Price,
                    Quantity = 1
                };
                _db.RepairParts.Add(newRepairPart);
                totalCostForClient += pItem.Price;
            }
        }

        if (request.Client != null)
        {
            decimal discountMultiplier = (100m - request.Client.PersonalDiscount) / 100m;
            totalCostForClient *= discountMultiplier;

            if (dto.BonusesSubtracted > 0 && dto.BonusesSubtracted <= request.Client.BonusPoints)
            {
                request.Client.BonusPoints -= dto.BonusesSubtracted;
                totalCostForClient -= dto.BonusesSubtracted;
                if (totalCostForClient < 0) totalCostForClient = 0;
            }
        }

        // --- ШАГ 3.5: РАСЧЁТ KPI-БОНУСА МАСТЕРА ---
        if (request.TechnicianId != null)
        {
            var employee = await _db.Employees
                .FirstOrDefaultAsync(e => e.UserId == request.TechnicianId);
            if (employee != null)
            {
                var totalServicesPrice = dto.Services.Sum(s => s.Price);
                request.MasterBonus = totalServicesPrice * (employee.BonusPercentage / 100);
                if (request.MasterBonus < 0) request.MasterBonus = 0;
            }
        }

        request.Status = "Ready";
        request.Price = totalCostForClient;
        request.CompletedAt = DateTime.Now;

        if (request.Client != null)
        {
            decimal currentPrice = request.Price.GetValueOrDefault();
            request.Client.TotalSpent += currentPrice;
            request.Client.BonusPoints += currentPrice * 0.05m;

            if (request.Client.TotalSpent >= 50000)
            {
                request.Client.LoyaltyTier = LoyaltyTier.Gold;
                request.Client.PersonalDiscount = 15;
            }
            else if (request.Client.TotalSpent >= 10000)
            {
                request.Client.LoyaltyTier = LoyaltyTier.Silver;
                request.Client.PersonalDiscount = 10;
            }
        }

        _db.Notifications.Add(new Notification
        {
            Message = $"Ваше устройство {request.Device} готово к выдаче!",
            CreatedAt = DateTime.UtcNow,
            IsRead = false,
            UserId = request.ClientId
        });

        // --- ШАГ 4: СОХРАНЕНИЕ ---
        await _db.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("ReceiveNotification");

        return Ok(new { message = "Repair completed and data cleaned up" });
    }
    [HttpDelete("{id}/services/{repairServiceId}")]
    public async Task<IActionResult> RemoveServiceFromRequest(int id, int repairServiceId)
    {
        var request = await _db.RepairRequests.Include(r => r.RepairServices).FirstOrDefaultAsync(r => r.Id == id);
        if (request == null) return NotFound("Заявка не найдена");

        var rs = request.RepairServices.FirstOrDefault(s => s.Id == repairServiceId);
        if (rs != null)
        {
            request.Price -= rs.PriceAtTheTime;
            if (request.Price < 0) request.Price = 0;

            if (request.TechnicianId != null)
            {
                var employee = await _db.Employees.FirstOrDefaultAsync(e => e.UserId == request.TechnicianId);
                if (employee != null)
                {
                    request.MasterBonus = (request.MasterBonus ?? 0) - rs.PriceAtTheTime * (employee.BonusPercentage / 100);
                    if (request.MasterBonus < 0) request.MasterBonus = 0;
                }
            }

            _db.RepairServices.Remove(rs);
            await _db.SaveChangesAsync();
        }
        return Ok(new { message = "Услуга удалена из заказа" });
    }

    [HttpDelete("{id}/parts/{repairPartId}")]
    public async Task<IActionResult> RemovePartFromRequest(int id, int repairPartId)
    {
        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var request = await _db.RepairRequests.Include(r => r.RepairParts).ThenInclude(rp => rp.SparePart).FirstOrDefaultAsync(r => r.Id == id);
            if (request == null) return NotFound("Заявка не найдена");

            var rp = request.RepairParts.FirstOrDefault(p => p.Id == repairPartId);
            if (rp != null)
            {
                request.Price -= rp.PriceAtTheTime;
                if (request.Price < 0) request.Price = 0;

                if (rp.SparePart != null)
                {
                    request.PartsCost -= (rp.Quantity * rp.SparePart.PurchasePrice);
                    if (request.PartsCost < 0) request.PartsCost = 0;
                    rp.SparePart.StockQuantity += rp.Quantity; // Возвращаем на склад

                    // Логируем историю возврата на склад
                    _db.Set<StockMovement>().Add(new StockMovement
                    {
                        SparePartId = rp.SparePart.Id,
                        Quantity = rp.Quantity,
                        Type = "Приход",
                        Date = DateTime.UtcNow,
                        Comment = $"Возврат: удалена из заявки №{id}",
                        RemainingStock = rp.SparePart.StockQuantity
                    });
                }

                _db.RepairParts.Remove(rp);
                await _db.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            return Ok(new { message = "Запчасть удалена из заказа" });
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { message = "Ошибка при удалении запчасти" });
        }
    }

    [HttpPut("{id}/services/{repairServiceId}/price")]
    public async Task<IActionResult> UpdateServicePriceInRequest(int id, int repairServiceId, [FromBody] UpdateItemPriceDto dto)
    {
        var request = await _db.RepairRequests.Include(r => r.RepairServices).FirstOrDefaultAsync(r => r.Id == id);
        if (request == null) return NotFound("Заявка не найдена");

        var rs = request.RepairServices.FirstOrDefault(s => s.Id == repairServiceId);
        if (rs != null)
        {
            request.Price = request.Price - rs.PriceAtTheTime + dto.Price;
            if (request.Price < 0) request.Price = 0;

            if (request.TechnicianId != null)
            {
                var employee = await _db.Employees.FirstOrDefaultAsync(e => e.UserId == request.TechnicianId);
                if (employee != null)
                {
                    request.MasterBonus = (request.MasterBonus ?? 0) + (dto.Price - rs.PriceAtTheTime) * (employee.BonusPercentage / 100);
                    if (request.MasterBonus < 0) request.MasterBonus = 0;
                }
            }

            rs.PriceAtTheTime = dto.Price;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Цена услуги обновлена" });
        }
        return NotFound("Услуга в заявке не найдена");
    }

    [HttpPut("{id}/parts/{repairPartId}/price")]
    public async Task<IActionResult> UpdatePartPriceInRequest(int id, int repairPartId, [FromBody] UpdateItemPriceDto dto)
    {
        var request = await _db.RepairRequests.Include(r => r.RepairParts).FirstOrDefaultAsync(r => r.Id == id);
        if (request == null) return NotFound("Заявка не найдена");

        var rp = request.RepairParts.FirstOrDefault(p => p.Id == repairPartId);
        if (rp != null)
        {
            request.Price = request.Price - rp.PriceAtTheTime + dto.Price;
            if (request.Price < 0) request.Price = 0;

            rp.PriceAtTheTime = dto.Price;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Цена запчасти обновлена" });
        }
        return NotFound("Запчасть в заявке не найдена");
    }

    [Authorize]
    [HttpPost("{id}/apply-bonuses")]
    public async Task<IActionResult> ApplyBonuses(int id, [FromBody] ApplyBonusesDto dto)
    {
        var currentUserIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(currentUserIdStr)) return Unauthorized();
        var currentUserId = int.Parse(currentUserIdStr);

        var currentUserRoleStr = User.FindFirst(ClaimTypes.Role)?.Value;
        int.TryParse(currentUserRoleStr, out int currentUserRole);

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var request = await _db.RepairRequests
                .Include(r => r.Client)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null) return NotFound("Заявка не найдена");
            if (request.ClientId != currentUserId && currentUserRole == 0) return Forbid();

            if (dto.BonusesToSubtract <= 0) return BadRequest("Неверная сумма бонусов");
            if (request.Client.BonusPoints < dto.BonusesToSubtract)
                return BadRequest("Недостаточно бонусов");

            decimal currentPrice = request.Price ?? 0;
            if (dto.BonusesToSubtract > currentPrice)
                return BadRequest("Сумма бонусов превышает стоимость ремонта");

            // Списываем бонусы у клиента
            request.Client.BonusPoints -= dto.BonusesToSubtract;
            request.Price -= dto.BonusesToSubtract;

            // Обновляем уровень лояльности на основе TotalSpent
            if (request.Client.TotalSpent >= 50000)
            {
                request.Client.LoyaltyTier = LoyaltyTier.Gold;
                request.Client.PersonalDiscount = 15;
            }
            else if (request.Client.TotalSpent >= 10000)
            {
                request.Client.LoyaltyTier = LoyaltyTier.Silver;
                request.Client.PersonalDiscount = 10;
            }

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { price = request.Price, bonusPoints = request.Client.BonusPoints });
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, "Ошибка при списании бонусов");
        }
    }

    private static List<CommentDto> MapComments(IEnumerable<Comment>? comments) =>
        (comments ?? Enumerable.Empty<Comment>())
            .Select(c => new CommentDto
            {
                Id = c.Id,
                RepairRequestId = c.RepairRequestId,
                UserId = c.UserId,
                Text = c.Text ?? string.Empty
            })
            .ToList();

    private static RepairRequestDto MapToListDto(RepairRequest r, IReadOnlyDictionary<int, User> users)
    {
        users.TryGetValue(r.ClientId, out var client);
        string? technicianName = "Не назначен";
        if (r.TechnicianId.HasValue && users.TryGetValue(r.TechnicianId.Value, out var technician))
            technicianName = technician.Name;

        // Вычисляем скиданную цену
        decimal? discountedPrice = r.Price;
        if (r.Price.HasValue && client != null)
        {
            // Применяем скидку, если статус заявки ещё не переведен в Готова
            if (r.Status != "Ready" && r.Status != "Готова" && r.Status != "Closed" && r.Status != "Закрыта" && r.Status != "Выдан")
            {
                decimal discountMultiplier = (100m - client.PersonalDiscount) / 100m;
                discountedPrice = r.Price.Value * discountMultiplier;
            }
        }

        return new RepairRequestDto
        {
            Id = r.Id,
            ClientId = r.ClientId,
            ClientName = client?.Name ?? "Неизвестно",
            TechnicianId = r.TechnicianId,
            TechnicianName = technicianName,
            Device = r.Device ?? string.Empty,
            IssueDescription = r.IssueDescription ?? string.Empty,
            Status = r.Status ?? string.Empty,
            CreatedAt = r.CreatedAt,
            Comments = MapComments(r.Comments),
            Price = r.Price,
            MasterBonus = r.MasterBonus,
            DiscountedPrice = discountedPrice,
            IsPaid = r.IsPaid
        };
    }
}

// DTO для импорта
public class RepairRequestImportDto
{
    public int ClientId { get; set; }
    public int? TechnicianId { get; set; }
    public string Device { get; set; } = string.Empty;
    public string? IssueDescription { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? Comments { get; set; }
}

// Результат импорта
public class ImportResult
{
    public int Imported { get; set; }
    public int Skipped { get; set; }
    public List<string> Errors { get; set; } = new();
}

public class CompleteRepairPayloadDto
{
    public List<RepairServiceItemDto> Services { get; set; } = new();
    public List<RepairPartItemDto> Parts { get; set; } = new();
    public decimal BonusesSubtracted { get; set; }
}
public class RepairServiceItemDto { public int Id { get; set; } public decimal Price { get; set; } }
public class RepairPartItemDto { public int Id { get; set; } public decimal Price { get; set; } }
public class UpdateItemPriceDto { public decimal Price { get; set; } }
public class ApplyBonusesDto { public decimal BonusesToSubtract { get; set; } }
