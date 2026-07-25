namespace SmartFixApi.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int RepairRequestId { get; set; }
        public RepairRequest? RepairRequest { get; set; }

        public decimal Amount { get; set; }

        public string? YooKassaPaymentId { get; set; }
        public string Status { get; set; } = "Pending";

        public bool IsPaid { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PaidAt { get; set; }

        public string PaymentMethod { get; set; } = "Card";
    }
}