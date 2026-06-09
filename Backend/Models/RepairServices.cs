namespace SmartFixApi.Models
{
    public class RepairServices
    {
        public int Id { get; set; }
        public int RepairRequestId { get; set; }
        public int ServiceId { get; set; }
        public decimal? PriceAtTheTime { get; set; }
        public RepairRequest RepairRequest { get; set; } = null!;
        public Service Service { get; set; } = null!;
    }
}