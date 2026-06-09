using System.ComponentModel.DataAnnotations;

namespace SmartFixApi.Models
{
    public class WikiCategory
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}