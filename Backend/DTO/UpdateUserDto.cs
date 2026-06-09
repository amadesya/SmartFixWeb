public class UpdateUserDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public IFormFile? AvatarFile { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Password { get; set; }

    public int? Role { get; set; }
    public bool? IsVerified { get; set; }
}