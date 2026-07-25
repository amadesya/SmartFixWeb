namespace SmartFixApi.Models
{
    public class SparePart
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int StockQuantity { get; set; } 
        public decimal PurchasePrice { get; set; } 
        public int MinimumThreshold { get; set; } = 0;
        public int? TypeId { get; set;}
        public SparePartType? Type { get; set; } = null!;
    }
}
