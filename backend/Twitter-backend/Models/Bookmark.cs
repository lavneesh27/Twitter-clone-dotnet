namespace Twitter_backend.Models
{
  public class Bookmark
  {
    public long Id { get; set; }
    public long UserId { get; set; }
    public long TweetId { get; set; }
  }
}
