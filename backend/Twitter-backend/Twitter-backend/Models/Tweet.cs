namespace Twitter_backend.Models
{
  public class Tweet
  {
    public long Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public List<string> Likes { get; set; } = [];
    public long UserId { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string? Image { get; set; }
  }
}
