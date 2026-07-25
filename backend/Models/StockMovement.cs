using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartFixApi.Models
{
    public class StockMovement
    {
        [Key]
        public int Id { get; set; }
        
        public int SparePartId { get; set; }
        [ForeignKey("SparePartId")]
        public virtual SparePart? SparePart { get; set; }

        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        public int Quantity { get; set; } // Положительное (Приход) или отрицательное (Расход/Списание)
        public string Type { get; set; } = string.Empty; // "Приход", "Расход", "Списание"
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Comment { get; set; } = string.Empty;
        public int RemainingStock { get; set; } // Остаток после операции
    }
}