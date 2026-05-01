using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Twitter_backend.Data;
using Twitter_backend.Models;

namespace Twitter_backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TweetsController(TwitterDbContext db) : ControllerBase
  {
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tweet>>> GetAll()
    {
      return Ok(await db.Tweets.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Tweet>> Get(long id)
    {
      var tweet = await db.Tweets.FindAsync(id);
      return tweet is null ? NotFound() : Ok(tweet);
    }

    [HttpPost]
    public async Task<ActionResult<Tweet>> Add(Tweet tweet)
    {
      tweet.CreatedAt = string.IsNullOrWhiteSpace(tweet.CreatedAt) ? DateTime.Now.ToString() : tweet.CreatedAt;
      tweet.Likes ??= [];
      db.Tweets.Add(tweet);
      await db.SaveChangesAsync();

      return CreatedAtAction(nameof(Get), new { id = tweet.Id }, tweet);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
      var tweet = await db.Tweets.FindAsync(id);
      if (tweet is null)
      {
        return NotFound();
      }

      db.Tweets.Remove(tweet);
      await db.Bookmarks.Where(bookmark => bookmark.TweetId == id).ExecuteDeleteAsync();
      await db.SaveChangesAsync();
      return NoContent();
    }

    [HttpPost("{id}/likes/{userId}")]
    public async Task<IActionResult> Like(long id, long userId)
    {
      var tweet = await db.Tweets.FindAsync(id);
      if (tweet is null)
      {
        return NotFound();
      }

      var userIdValue = userId.ToString();
      if (!tweet.Likes.Contains(userIdValue))
      {
        tweet.Likes.Add(userIdValue);
      }

      await db.SaveChangesAsync();
      return NoContent();
    }

    [HttpDelete("{id}/likes/{userId}")]
    public async Task<IActionResult> Unlike(long id, long userId)
    {
      var tweet = await db.Tweets.FindAsync(id);
      if (tweet is null)
      {
        return NotFound();
      }

      tweet.Likes.Remove(userId.ToString());
      await db.SaveChangesAsync();
      return NoContent();
    }
  }
}
