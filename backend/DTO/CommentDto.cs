namespace SmartFixApi.DTO
{
    public class CommentDto
    {
        public int Id { get; set; }
        public int RepairRequestId { get; set; }
        public int UserId { get; set; }
        public string Text { get; set; }
    }
}
