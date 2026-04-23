using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Twitter_backend.Data;
using Twitter_backend.Models;

namespace Twitter_backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BookmarksController(TwitterDbContext db) : ControllerBase
  {
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Bookmark>>> GetForUser(long userId)
    {
      return Ok(await db.Bookmarks.Where(bookmark => bookmark.UserId == userId).ToListAsync());
    }

    [HttpGet("exists")]
    public async Task<ActionResult<bool>> Exists([FromQuery] long tweetId, [FromQuery] long userId)
    {
      return Ok(await db.Bookmarks.AnyAsync(bookmark => bookmark.TweetId == tweetId && bookmark.UserId == userId));
    }

    [HttpPost]
    public async Task<ActionResult<Bookmark>> Add(Bookmark bookmark)
    {
      var existing = await db.Bookmarks.FirstOrDefaultAsync(item =>
        item.TweetId == bookmark.TweetId && item.UserId == bookmark.UserId);

      if (existing is not null)
      {
        return Ok(existing);
      }

      db.Bookmarks.Add(bookmark);
      await db.SaveChangesAsync();
      return CreatedAtAction(nameof(GetForUser), new { userId = bookmark.UserId }, bookmark);
    }

    [HttpDelete("user/{userId}")]
    public async Task<IActionResult> ClearForUser(long userId)
    {
      await db.Bookmarks.Where(bookmark => bookmark.UserId == userId).ExecuteDeleteAsync();
      return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Delete([FromQuery] long tweetId, [FromQuery] long userId)
    {
      await db.Bookmarks
        .Where(bookmark => bookmark.TweetId == tweetId && bookmark.UserId == userId)
        .ExecuteDeleteAsync();
      return NoContent();
    }
  }
}
