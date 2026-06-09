using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SmartFixApi.Data;
using SmartFixApi.Models;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace SmartFixApi.Controllers
{
    public class PayRequest
    {
        public decimal BonusesToSubtract { get; set; }
    }

    [Route("api/[controller]")] 
    [ApiController]
    public class PayController : Controller
    {
        private readonly AppDbContext _db;
        public PayController(AppDbContext db) { _db = db; }

        [HttpPost("requests/{id}/pay")]
        public async Task<IActionResult> Pay(int id, [FromBody] PayRequest dto)
        {
            var requestOrder = await _db.RepairRequests.FindAsync(id);

            if (requestOrder == null)
            {
                return NotFound(new { message = "Заявка не найдена" });
            }

            if (requestOrder.Price == null || requestOrder.Price <= 0)
            {
                return BadRequest(new { message = "Мастер еще не установил стоимость ремонта." });
            }

            var user = await _db.Users.FindAsync(requestOrder.ClientId);

            if (user == null)
            {
                return NotFound(new { message = "Клиент не найден" });
            }

            if (dto.BonusesToSubtract < 0 || dto.BonusesToSubtract > user.BonusPoints)
            {
                return BadRequest(new { message = "Недостаточно бонусов на счете." });
            }

            decimal finalPrice = requestOrder.Price.Value;

            string status = requestOrder.Status?.Trim().ToLowerInvariant() ?? "";
            bool isFinished = status == "closed" || status == "закрыта" || status == "выдан";

            if (!isFinished)
            {
                decimal discountMultiplier = (100m - user.PersonalDiscount) / 100m;
                finalPrice = finalPrice * discountMultiplier;
            }

            var amountToPay = finalPrice - dto.BonusesToSubtract;

            if (amountToPay <= 0)
            {
                requestOrder.Status = "Ready";
                requestOrder.Price = 0; // Полностью оплачено бонусами
                requestOrder.BonusesSubtracted = dto.BonusesToSubtract;
                user.BonusPoints -= dto.BonusesToSubtract;

                // Начисляем баллы лояльности за заявку
                user.TotalSpent += finalPrice;
                user.BonusPoints += finalPrice * 0.05m;
                if (user.TotalSpent >= 50000) { user.LoyaltyTier = LoyaltyTier.Gold; user.PersonalDiscount = 15; }
                else if (user.TotalSpent >= 10000) { user.LoyaltyTier = LoyaltyTier.Silver; user.PersonalDiscount = 10; }

                await _db.SaveChangesAsync();
                return Ok(new { url = $"http://localhost:3000/requests/" });
            }

            var shopId = "1338519";
            var secretKey = "test_qTu11_rp4Eyn0Syd6MP_ToQo1tl9tN5k-XpqgQoDCMA";

            using var client = new HttpClient();
            var authToken = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{shopId}:{secretKey}"));
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);
            client.DefaultRequestHeaders.Add("Idempotence-Key", Guid.NewGuid().ToString());

            var paymentData = new
            {
                amount = new
                {
                    value = Math.Round(amountToPay, 2).ToString("0.00", System.Globalization.CultureInfo.InvariantCulture),
                    currency = "RUB"
                },
                confirmation = new
                {
                    type = "redirect",
                    return_url = $"http://localhost:3000/requests/"
                },
                description = $"Оплата ремонта по заявке #{id}",
                capture = true
            };

            var json = JsonConvert.SerializeObject(paymentData);
            using var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync("https://api.yookassa.ru/v3/payments", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<dynamic>(jsonResponse);

                string yookassaId = result?.id;
                string url = result?.confirmation?.confirmation_url;

                var paymentRecord = new Payment
                {
                    RepairRequestId = id,
                    Amount = amountToPay,
                    YooKassaPaymentId = yookassaId,
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow
                };

                requestOrder.BonusesSubtracted = dto.BonusesToSubtract;
                // УДАЛЕНО: user.BonusPoints -= dto.BonusesToSubtract; (перенесено в момент факта оплаты через триггер)

                _db.Payments.Add(paymentRecord);
                await _db.SaveChangesAsync();

                return Ok(new { url = url });
            }

            return BadRequest("Ошибка ЮKassa: " + await response.Content.ReadAsStringAsync());
        }
        
    }
}
