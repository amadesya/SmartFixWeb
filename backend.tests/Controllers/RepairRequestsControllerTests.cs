using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using SmartFixApi.Controllers;
using SmartFixApi.Data;
using SmartFixApi.DTO;
using SmartFixApi.Hubs;
using SmartFixApi.Models;
using System.Security.Claims;

namespace SmartFixApi.Tests.Controllers;

public class RepairRequestsControllerTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly Mock<ITelegramService> _telegramMock;
    private readonly Mock<IConfiguration> _configMock;
    private readonly Mock<IHubContext<NotificationHub>> _hubMock;
    private readonly RepairRequestsController _controller;

    public RepairRequestsControllerTests()
    {
        var connection = new Microsoft.Data.Sqlite.SqliteConnection("DataSource=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        _db = new AppDbContext(options);
        _db.Database.EnsureCreated();

        _telegramMock = new Mock<ITelegramService>();

        _configMock = new Mock<IConfiguration>();

        var mockClients = new Mock<IHubClients>();
        var mockClientProxy = new Mock<IClientProxy>();
        mockClientProxy
            .Setup(p => p.SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        mockClients.Setup(c => c.All).Returns(mockClientProxy.Object);
        _hubMock = new Mock<IHubContext<NotificationHub>>();
        _hubMock.Setup(h => h.Clients).Returns(mockClients.Object);

        _controller = new RepairRequestsController(_db, _telegramMock.Object, _configMock.Object, _hubMock.Object);
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }

    private void SetUser(int userId, int role = 0)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Role, role.ToString())
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) }
        };
    }

    private async Task AddUser(int id, int role = 0, string name = "User")
    {
        _db.Users.Add(new User { Id = id, Name = name, Email = $"{name}@t.com", Role = role });
        await _db.SaveChangesAsync();
    }

    [Fact]
    public async Task GetRepairRequests_AsClient_ReturnsOwnRequests()
    {
        SetUser(1, 0);
        await AddUser(1, 0, "Client1");
        await AddUser(2, 0, "Client2");
        _db.RepairRequests.AddRange(
            new RepairRequest { ClientId = 1, Device = "Phone A", IssueDescription = "Broken", Status = "New", CreatedAt = DateTime.UtcNow },
            new RepairRequest { ClientId = 2, Device = "Phone B", IssueDescription = "Wet", Status = "New", CreatedAt = DateTime.UtcNow }
        );
        await _db.SaveChangesAsync();

        var result = await _controller.GetRepairRequests();
        var actionResult = Assert.IsType<ActionResult<IEnumerable<RepairRequestDto>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var list = Assert.IsAssignableFrom<IEnumerable<RepairRequestDto>>(okResult.Value);
        Assert.Single(list);
        Assert.Equal("Phone A", list.First().Device);
    }

    [Fact]
    public async Task GetRepairRequests_AsAdmin_ReturnsAll()
    {
        SetUser(1, 2);
        _db.Users.AddRange(
            new User { Id = 1, Name = "Admin", Email = "a@t.com", Role = 2 },
            new User { Id = 2, Name = "Client", Email = "c@t.com", Role = 0 }
        );
        _db.RepairRequests.AddRange(
            new RepairRequest { ClientId = 1, Device = "A", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow },
            new RepairRequest { ClientId = 2, Device = "B", IssueDescription = "Y", Status = "New", CreatedAt = DateTime.UtcNow }
        );
        await _db.SaveChangesAsync();

        var result = await _controller.GetRepairRequests();
        var actionResult = Assert.IsType<ActionResult<IEnumerable<RepairRequestDto>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var list = Assert.IsAssignableFrom<IEnumerable<RepairRequestDto>>(okResult.Value);
        Assert.Equal(2, list.Count());
    }

    [Fact]
    public async Task GetRepairRequests_Unauthenticated_ReturnsUnauthorized()
    {
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };

        var result = await _controller.GetRepairRequests();
        Assert.IsType<ActionResult<IEnumerable<RepairRequestDto>>>(result);
        Assert.IsType<UnauthorizedResult>(result.Result);
    }

    [Fact]
    public async Task GetRepairRequestById_OwnRequest_ReturnsDto()
    {
        SetUser(1, 0);
        await AddUser(1);
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "Phone", IssueDescription = "Issue", Status = "New", CreatedAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();

        var result = await _controller.GetRepairRequestById(10);
        var actionResult = Assert.IsType<ActionResult<RepairRequestDto>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var dto = Assert.IsType<RepairRequestDto>(okResult.Value);
        Assert.Equal(10, dto.Id);
        Assert.Equal("Phone", dto.Device);
    }

    [Fact]
    public async Task GetRepairRequestById_OtherClient_ReturnsForbid()
    {
        SetUser(2, 0);
        _db.Users.AddRange(
            new User { Id = 1, Name = "A", Email = "a@t.com", Role = 0 },
            new User { Id = 2, Name = "B", Email = "b@t.com", Role = 0 }
        );
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "Phone", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();

        var result = await _controller.GetRepairRequestById(10);
        Assert.IsType<ForbidResult>(result.Result);
    }

    [Fact]
    public async Task GetRepairRequestById_NotFound_ReturnsNotFound()
    {
        SetUser(1, 0);
        var result = await _controller.GetRepairRequestById(999);
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task GetByTechnician_ReturnsFiltered()
    {
        await AddUser(1, 1, "Tech");
        await AddUser(2, 0, "ClientA");
        await AddUser(3, 0, "ClientB");
        _db.RepairRequests.AddRange(
            new RepairRequest { ClientId = 2, TechnicianId = 1, Device = "A", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow },
            new RepairRequest { ClientId = 3, Device = "B", IssueDescription = "Y", Status = "New", CreatedAt = DateTime.UtcNow }
        );
        await _db.SaveChangesAsync();

        var result = await _controller.GetByTechnician(1);
        var list = Assert.IsAssignableFrom<IEnumerable<RepairRequestDto>>(result);
        Assert.Single(list);
    }

    [Fact]
    public async Task CreateRepairRequest_Valid_ReturnsCreated()
    {
        await AddUser(1, 0, "Client");

        var dto = new RepairRequestCreateDto { ClientId = 1, Device = "Phone", IssueDescription = "Broken" };
        var result = await _controller.CreateRepairRequest(dto);
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var request = Assert.IsType<RepairRequest>(createdResult.Value);
        Assert.Equal("Phone", request.Device);
        Assert.Equal("New", request.Status);
    }

    [Fact]
    public async Task CreateRepairRequest_InvalidClient_ReturnsBadRequest()
    {
        var dto = new RepairRequestCreateDto { ClientId = 999, Device = "X", IssueDescription = "Y" };
        var result = await _controller.CreateRepairRequest(dto);
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task UpdateRepairRequest_Valid_UpdatesAndReturns()
    {
        await AddUser(1, 0, "Client");
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "Old", IssueDescription = "OldIssue", Status = "New", CreatedAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();

        var dto = new RepairRequestUpdateDto { Device = "New Phone", IssueDescription = "New Issue", Status = "InWork" };
        var result = await _controller.UpdateRepairRequest(10, dto);
        var okResult = Assert.IsType<OkObjectResult>(result);

        var updated = await _db.RepairRequests.FindAsync(10);
        Assert.Equal("New Phone", updated!.Device);
    }

    [Fact]
    public async Task UpdateRepairRequest_NotFound_ReturnsNotFound()
    {
        var dto = new RepairRequestUpdateDto { Device = "X", IssueDescription = "Y", Status = "New" };
        var result = await _controller.UpdateRepairRequest(999, dto);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdatePrice_Valid_UpdatesPrice()
    {
        await AddUser(1, 0, "Client");
        _db.Services.Add(new Service { Id = 1, Name = "Fix", Price = 100 });
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();
        _db.RepairServices.Add(new RepairServices { RepairRequestId = 10, ServiceId = 1, PriceAtTheTime = 100 });
        await _db.SaveChangesAsync();

        var dto = new UpdatePriceDto { Price = 200, HidePartsPrices = false };
        var result = await _controller.UpdatePrice(10, dto);
        var okResult = Assert.IsType<OkObjectResult>(result);

        var updated = await _db.RepairRequests.FindAsync(10);
        Assert.Equal(200, updated!.Price);
    }

    [Fact]
    public async Task UpdatePrice_NoServices_ReturnsBadRequest()
    {
        await AddUser(1, 0, "Client");
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();

        var dto = new UpdatePriceDto { Price = 100 };
        var result = await _controller.UpdatePrice(10, dto);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UpdatePrice_NotFound_ReturnsNotFound()
    {
        var dto = new UpdatePriceDto { Price = 100 };
        var result = await _controller.UpdatePrice(999, dto);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetPrice_ReturnsPrice()
    {
        await AddUser(1, 0, "Client");
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow, Price = 500 });
        await _db.SaveChangesAsync();

        var result = await _controller.GetPrice(10);
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetPrice_NotFound_ReturnsNotFound()
    {
        var result = await _controller.GetPrice(999);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdateStatus_Valid_Updates()
    {
        await AddUser(1, 0, "Client");
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();

        var dto = new UpdateRequestStatusDto { Status = "InWork" };
        var result = await _controller.UpdateStatus(10, dto);
        var okResult = Assert.IsType<OkObjectResult>(result);

        var updated = await _db.RepairRequests.FindAsync(10);
        Assert.Equal("InWork", updated!.Status);
    }

    [Fact]
    public async Task UpdateStatus_ToReady_SetsCompletedAt()
    {
        await AddUser(1, 0, "Client");
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "InWork", CreatedAt = DateTime.UtcNow });
        _db.Services.Add(new Service { Id = 1, Name = "Fix", Price = 100 });
        await _db.SaveChangesAsync();

        var dto = new UpdateRequestStatusDto { Status = "Готова", ServiceIds = new List<int> { 1 } };
        var result = await _controller.UpdateStatus(10, dto);
        var updated = await _db.RepairRequests.FindAsync(10);
        Assert.NotNull(updated!.CompletedAt);
    }

    [Fact]
    public async Task UpdateStatus_NotFound_ReturnsNotFound()
    {
        var dto = new UpdateRequestStatusDto { Status = "New" };
        var result = await _controller.UpdateStatus(999, dto);
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task AddServiceToRequest_Valid_AddsService()
    {
        await AddUser(1, 0, "Client");
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow, Price = 0 });
        _db.Services.Add(new Service { Id = 1, Name = "Fix", Price = 150 });
        await _db.SaveChangesAsync();

        var dto = new RepairServiceItemDto { Id = 1, Price = 150 };
        var result = await _controller.AddServiceToRequest(10, dto);
        var okResult = Assert.IsType<OkObjectResult>(result);

        var updated = await _db.RepairRequests.Include(r => r.RepairServices).FirstAsync(r => r.Id == 10);
        Assert.Single(updated.RepairServices);
        Assert.Equal(150, updated.Price);
    }

    [Fact]
    public async Task AddServiceToRequest_InvalidRequest_ReturnsNotFound()
    {
        var dto = new RepairServiceItemDto { Id = 1, Price = 100 };
        var result = await _controller.AddServiceToRequest(999, dto);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task AddPartToRequest_Valid_AddsPart()
    {
        await AddUser(1, 0, "Client");
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow });
        _db.SpareParts.Add(new SparePart { Id = 1, Name = "Screen", StockQuantity = 5, PurchasePrice = 50 });
        await _db.SaveChangesAsync();

        var dto = new RepairPartItemDto { Id = 1, Price = 100 };
        var result = await _controller.AddPartToRequest(10, dto);
        var okResult = Assert.IsType<OkObjectResult>(result);

        var part = await _db.SpareParts.FindAsync(1);
        Assert.Equal(4, part!.StockQuantity);
    }

    [Fact]
    public async Task AddPartToRequest_NoStock_ReturnsBadRequest()
    {
        await AddUser(1, 0, "Client");
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow });
        _db.SpareParts.Add(new SparePart { Id = 1, Name = "Screen", StockQuantity = 0, PurchasePrice = 50 });
        await _db.SaveChangesAsync();

        var dto = new RepairPartItemDto { Id = 1, Price = 100 };
        var result = await _controller.AddPartToRequest(10, dto);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task DeleteRepairRequest_Valid_RemovesAndReturnsNoContent()
    {
        await AddUser(1, 0, "Client");
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();

        var result = await _controller.DeleteRepairRequest(10);
        Assert.IsType<NoContentResult>(result);
        Assert.Null(await _db.RepairRequests.FindAsync(10));
    }

    [Fact]
    public async Task DeleteRepairRequest_NotFound_ReturnsNotFound()
    {
        var result = await _controller.DeleteRepairRequest(999);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task ApplyBonuses_Valid_DeductsBonuses()
    {
        SetUser(1, 0);
        _db.Users.Add(new User { Id = 1, Name = "Client", Email = "c@t.com", Role = 0, BonusPoints = 200, TotalSpent = 1000 });
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow, Price = 500 });
        await _db.SaveChangesAsync();

        var dto = new ApplyBonusesDto { BonusesToSubtract = 50 };
        var result = await _controller.ApplyBonuses(10, dto);
        var okResult = Assert.IsType<OkObjectResult>(result);

        var updated = await _db.RepairRequests.FindAsync(10);
        Assert.Equal(450, updated!.Price);
        var client = await _db.Users.FindAsync(1);
        Assert.Equal(150, client!.BonusPoints);
    }

    [Fact]
    public async Task ApplyBonuses_NotOwner_ReturnsForbid()
    {
        SetUser(2, 0);
        _db.Users.AddRange(
            new User { Id = 1, Name = "A", Email = "a@t.com", Role = 0 },
            new User { Id = 2, Name = "B", Email = "b@t.com", Role = 0 }
        );
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow, Price = 500 });
        await _db.SaveChangesAsync();

        var dto = new ApplyBonusesDto { BonusesToSubtract = 50 };
        var result = await _controller.ApplyBonuses(10, dto);
        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task ApplyBonuses_Insufficient_ReturnsBadRequest()
    {
        SetUser(1, 0);
        _db.Users.Add(new User { Id = 1, Name = "Client", Email = "c@t.com", Role = 0, BonusPoints = 10 });
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow, Price = 500 });
        await _db.SaveChangesAsync();

        var dto = new ApplyBonusesDto { BonusesToSubtract = 50 };
        var result = await _controller.ApplyBonuses(10, dto);
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task GetByTechnician_NoRequests_ReturnsEmpty()
    {
        var result = await _controller.GetByTechnician(1);
        Assert.Empty(Assert.IsAssignableFrom<IEnumerable<RepairRequestDto>>(result));
    }

    [Fact]
    public async Task RemoveServiceFromRequest_Valid_Removes()
    {
        await AddUser(1, 0, "Client");
        _db.Services.Add(new Service { Id = 1, Name = "Fix", Price = 200 });
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow, Price = 200 });
        await _db.SaveChangesAsync();
        _db.RepairServices.Add(new RepairServices { Id = 1, RepairRequestId = 10, ServiceId = 1, PriceAtTheTime = 200 });
        await _db.SaveChangesAsync();

        var result = await _controller.RemoveServiceFromRequest(10, 1);
        Assert.IsType<OkObjectResult>(result);
        Assert.Empty(await _db.RepairServices.Where(s => s.RepairRequestId == 10).ToListAsync());
    }

    [Fact]
    public async Task RemovePartFromRequest_Valid_RemovesAndReturnsStock()
    {
        await AddUser(1, 0, "Client");
        _db.RepairRequests.Add(new RepairRequest { Id = 10, ClientId = 1, Device = "P", IssueDescription = "X", Status = "New", CreatedAt = DateTime.UtcNow, Price = 100 });
        _db.SpareParts.Add(new SparePart { Id = 1, Name = "Bat", StockQuantity = 3, PurchasePrice = 30 });
        await _db.SaveChangesAsync();
        _db.RepairParts.Add(new RepairPart { Id = 1, RepairRequestId = 10, SparePartId = 1, Quantity = 1, PriceAtTheTime = 100 });
        await _db.SaveChangesAsync();

        var result = await _controller.RemovePartFromRequest(10, 1);
        Assert.IsType<OkObjectResult>(result);

        var part = await _db.SpareParts.FindAsync(1);
        Assert.Equal(4, part!.StockQuantity);
    }

    [Fact]
    public async Task ImportRequests_Valid_Imports()
    {
        await AddUser(1, 0, "Client");

        var list = new List<RepairRequestImportDto>
        {
            new() { ClientId = 1, Device = "Phone", IssueDescription = "X" },
            new() { ClientId = 1, Device = "Tablet", IssueDescription = "Y" }
        };

        var result = await _controller.ImportRequests(list);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var importResult = Assert.IsType<ImportResult>(okResult.Value);
        Assert.Equal(2, importResult.Imported);
        Assert.Equal(2, await _db.RepairRequests.CountAsync());
    }

    [Fact]
    public async Task ImportRequests_SkipsInvalidClient()
    {
        var list = new List<RepairRequestImportDto>
        {
            new() { ClientId = 999, Device = "Phone", IssueDescription = "X" }
        };

        var result = await _controller.ImportRequests(list);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var importResult = Assert.IsType<ImportResult>(okResult.Value);
        Assert.Equal(0, importResult.Imported);
        Assert.Equal(1, importResult.Skipped);
    }
}
