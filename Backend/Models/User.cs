namespace SmartFixApi.Models;

public enum LoyaltyTier { Bronze, Silver, Gold }

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? PasswordHash { get; set; }
    public int Role { get; set; }
    public bool IsVerified { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public long? TelegramChatId { get; set; }
    public string? PushEndpoint { get; set; }
    public string? PushP256DH { get; set; }
    public string? PushAuth { get; set; }
    
    public decimal TotalSpent { get; set; } = 0;
    public int PersonalDiscount { get; set; } = 0;
    public decimal BonusPoints { get; set; } = 0;
    public LoyaltyTier LoyaltyTier { get; set; } = LoyaltyTier.Bronze;
    
    public string? ClientNotes { get; set; }

    public Employee? EmployeeInfo { get; set; }
}