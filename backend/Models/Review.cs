using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartFixApi.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Body { get; set; } = string.Empty;
        public int Rating { get; set; }
        public int UserId { get; set; }

        // 1. Верни поле IsApproved (на него ругается строка 68 в контроллере)
        public bool IsApproved { get; set; } = true;

        // 2. Верни навигационное свойство User (на него ругаются строки 25 и 44)
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Поле для ответов (Nullable)
        public int? ParentId { get; set; }
        public int? RepairRequestId{ get; set; }

        // Навигационные свойства для ответов
        [ForeignKey("ParentId")]
        public virtual Review? Parent { get; set; }
        public virtual ICollection<Review> Replies { get; set; } = new List<Review>();
        [ForeignKey("RepairRequestId")]
        public virtual RepairRequest? RepairRequest { get; set; }
    }
}