public class UpdateRequestStatusDto
{
    public string Status { get; set; } = null!;
    public List<int>? ServiceIds { get; set; } // Список оказанных услуг
}