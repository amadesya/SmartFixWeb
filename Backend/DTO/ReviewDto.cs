namespace SmartFixApi.DTO
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public string Body { get; set; } = string.Empty;
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }

        // Данные автора (чтобы фронтенд не делал лишних запросов)
        public string? AuthorName { get; set; }
        public string? AuthorAvatar { get; set; }
        public string? AuthorEmail { get; set; }

        // САМОЕ ВАЖНОЕ ПОЛЕ ДЛЯ ОТВЕТОВ:
        public int? ParentId { get; set; }
        public int? RepairRequestId { get; set; }
        public string? DeviceName { get; set; }

    }
}