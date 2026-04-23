namespace Twitter_backend.Models
{
  public class User
  {
    public long Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Dob { get; set; }
    public string? Image { get; set; }
    public string? Banner { get; set; }
    public string? Bio { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string? CreatedAt { get; set; }
    public List<string> Followers { get; set; } = [];
    public List<string> Following { get; set; } = [];
    public string? DefaultPrimaryColor { get; set; }
  }
}
