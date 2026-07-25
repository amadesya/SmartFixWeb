namespace SmartFixApi.Models
{
    public class RepairPart
    {
        public int Id { get; set; }
        public int RepairRequestId { get; set; }
        public int SparePartId { get; set; }
        public int Quantity { get; set; }
        public decimal PriceAtTheTime { get; set; }

        public RepairRequest? RepairRequest { get; set; }
        public SparePart? SparePart { get; set; }
    }
}
