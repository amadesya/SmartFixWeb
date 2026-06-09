public class AnalyticsSummaryDto
{
    public int TotalRequests { get; set; }
    public int CompletedRequests { get; set; }
    public decimal TotalRevenue { get; set; }     // Выручка (то, что заплатили клиенты)
    public decimal TotalPartsCost { get; set; }   // Затраты на запчасти
    public decimal ActualProfit { get; set; }     // Чистая прибыль предприятия
    public decimal AverageCheck { get; set; }
}