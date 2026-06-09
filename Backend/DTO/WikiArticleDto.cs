namespace SmartFixApi.DTO
{
    public class WikiArticleDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string ReadTime { get; set; } = string.Empty;
    }

    public class CreateWikiArticleDto
    {
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public int AuthorId { get; set; }
    }
}