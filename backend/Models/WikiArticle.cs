using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartFixApi.Models
{
    public class WikiArticle
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        
        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public virtual WikiCategory? Category { get; set; }
        
        // Текст статьи в формате Markdown
        public string Body { get; set; } = string.Empty; 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public virtual User? Author { get; set; }
    }
}