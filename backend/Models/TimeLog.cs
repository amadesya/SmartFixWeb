namespace SmartFixApi.Models;

public class TimeLog
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public decimal HoursWorked { get; set; }
    public DateTime Date { get; set; }
    public int? RepairRequestId { get; set; }

    public Employee Employee { get; set; } = null!;
    public RepairRequest? RepairRequest { get; set; }
}
