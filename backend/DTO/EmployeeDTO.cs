public class EmployeeDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int UserRole { get; set; }
    public string Avatar { get; set; } = string.Empty;
    public decimal BaseSalary { get; set; }
    public decimal BonusPercentage { get; set; }
}

public class CreateEmployeeDto
{
    public int UserId { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal BonusPercentage { get; set; }
}

public class UpdateEmployeeDto
{
    public decimal BaseSalary { get; set; }
    public decimal BonusPercentage { get; set; }
    public string? Avatar { get; set; }
}