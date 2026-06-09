public class UserDto
{
    public int Id { get; set; }
    public int PersonalDiscount { get; set; }
    public decimal BonusPoints { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public int Role { get; set; }
    public bool IsVerified { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
}
