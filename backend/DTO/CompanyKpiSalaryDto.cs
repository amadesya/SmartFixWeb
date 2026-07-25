using SmartFixApi.DTO;

namespace SmartFixApi.DTO
{
    public class CompanyKpiSalaryDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public decimal CostPerOrder { get; set; }
        public decimal TotalBonuses { get; set; }
        public decimal BonusPerOrder { get; set; }
        public List<EmployeeKpiDto> Employees { get; set; } = new();
    }
}