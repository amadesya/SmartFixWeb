using System;

namespace SmartFixApi.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? UserId { get; set; } // Если null, уведомление общее (для всех админов)
    }
}