namespace SmartFixApi.Models;

public class Service {
    public int Id {get;set;}
    public string Name {get;set;} = "";
    public string? Description {get;set;}
    public decimal Price {get;set;}

    public string? ImageUrl { get; set; }
    public ICollection<RepairServices> RepairServices { get; set; } = new List<RepairServices>();
}
