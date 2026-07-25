using System.ComponentModel.DataAnnotations.Schema;

namespace SmartFixApi.Models;

public class RepairRequest
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public int? TechnicianId { get; set; } 
    public string Device { get; set; } = null!;
    public string IssueDescription { get; set; } = null!;
    public string Status { get; set; } = null!;
    public decimal? Price { get; set; }
    public decimal? MasterBonus { get; set; }
    public decimal? PartsCost { get; set; }
    public decimal? BonusesSubtracted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsPaid { get; set; } = false;
    public List<Comment> Comments { get; set; } = new();
    [ForeignKey("ClientId")]
    public virtual User Client { get; set; } = null!;

    [ForeignKey("TechnicianId")]
    public virtual User? Technician { get; set; }
    public ICollection<RepairServices> RepairServices { get; set; } = new List<RepairServices>();
    public virtual ICollection<RepairPart> RepairParts { get; set; } = new List<RepairPart>();
}
