public class EmployeeKpiDto
{
    public int EmployeeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal BaseSalary { get; set; }
    public decimal BonusPercentage { get; set; }
    public decimal BonusAmount { get; set; }
    public decimal TotalPayout { get; set; }
    public int CompletedRequests { get; set; }
    public decimal PersonalRevenue { get; set; }
    public decimal TimeBasedSalary { get; set; }
    public decimal HourlyRate { get; set; }
    public decimal HoursWorked { get; set; }
}
