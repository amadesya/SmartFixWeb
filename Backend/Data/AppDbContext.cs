using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using SmartFixApi.Models;

namespace SmartFixApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<RepairRequest> RepairRequests => Set<RepairRequest>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<SparePart> SpareParts { get; set; }
    public DbSet<RepairPart> RepairParts { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<RepairServices> RepairServices => Set<RepairServices>();
    public DbSet<WikiArticle> WikiArticles => Set<WikiArticle>();
    public DbSet<WikiCategory> WikiCategories => Set<WikiCategory>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<User>(entity =>
    {
        entity.Property(u => u.Name).IsRequired();              
        entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
        entity.Property(u => u.PasswordHash).IsRequired(false);      

        entity.Property(u => u.Role)
              .HasDefaultValue(0);    

        entity.HasIndex(u => u.Email).IsUnique();
    });

        modelBuilder.Entity<Employee>()
        .HasOne(e => e.User)
        .WithOne(u => u.EmployeeInfo)
        .HasForeignKey<Employee>(e => e.UserId);
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RepairServices>()
    .Property(p => p.PriceAtTheTime)
    .HasPrecision(18, 2);
    }

public DbSet<SmartFixApi.Models.SparePartType> SparePartType { get; set; } = default!;
}