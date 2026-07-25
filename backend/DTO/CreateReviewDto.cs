public class CreateReviewDto
{
    public int RepairRequestId { get; set; }
    public int UserId { get; set; }
    public string Body { get; set; } = string.Empty;
    public int Rating { get; set; }
    public int? ParentId { get; set; }
}