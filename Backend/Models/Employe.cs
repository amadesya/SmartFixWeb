namespace SmartFixApi.Models;

﻿public class Employee
{
    public int Id { get; set; }
    public decimal BaseSalary { get; set; } = 0;
    public decimal BonusPercentage { get; set; } = 0;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}