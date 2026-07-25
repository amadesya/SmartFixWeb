public class CreateUserDto
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public int Role { get; set; } = 0;  
    public bool? isVerified { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public IFormFile? AvatarFile { get; set; }
    public string? AvatarUrl { get; set; }
}