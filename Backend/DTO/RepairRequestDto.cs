using SmartFixApi.DTO;
using SmartFixApi.Models;

public class RepairRequestDto
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string ClientName { get; set; } = null!;
    public int? TechnicianId { get; set; }
    public string? TechnicianName { get; set; }
    public string Device { get; set; } = null!;
    public string IssueDescription { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public List<CommentDto> Comments { get; set; } = new();
    public decimal? Price { get; set; }
    public bool HasReview { get; set; }
    public int? ReviewRating { get; set; }
    public string? ReviewBody { get; set; }
    public bool IsPaid { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public List<RepairServices> RepairServices { get; set; } = new();
    public List<RepairPart> RepairParts { get; set; } = new();
}
