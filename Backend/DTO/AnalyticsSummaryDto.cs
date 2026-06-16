public class AnalyticsSummaryDto
{
    public int TotalRequests { get; set; }
    public int CompletedRequests { get; set; }
    public decimal TotalRevenue { get; set; }           // Выручка (оплаченные клиентами услуги)
    public decimal TotalMasterBonuses { get; set; }     // KPI-бонусы сотрудникам (% от выручки)
    public decimal TotalPartsCost { get; set; }         // Затраты на запчасти
    public decimal TotalSalary { get; set; }            // ФОТ по часам (TimeLogs.HoursWorked × Employee.HourlyRate)
    public decimal ActualProfit { get; set; }           // Чистая прибыль (Revenue - PartsCost - Salary - MasterBonuses)
    public decimal AverageCheck { get; set; }
}