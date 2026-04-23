namespace Twitter_backend.Models
{
  public class Chat
  {
    public long Id { get; set; }
    public long SenderId { get; set; }
    public long RecieverId { get; set; }
    public string Text { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public string Attachment { get; set; } = string.Empty;
  }
}
