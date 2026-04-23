using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Twitter_backend.Data;
using Twitter_backend.Models;

namespace Twitter_backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UsersController(TwitterDbContext db) : ControllerBase
  {
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAll()
    {
      return Ok(await db.Users.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> Get(long id)
    {
      var user = await db.Users.FindAsync(id);
      return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<User>> Add(User user)
    {
      user.CreatedAt = string.IsNullOrWhiteSpace(user.CreatedAt) ? DateTime.Now.ToShortDateString() : user.CreatedAt;
      user.Followers ??= [];
      user.Following ??= [];
      db.Users.Add(user);
      await db.SaveChangesAsync();
      return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, User user)
    {
      var existing = await db.Users.FindAsync(id);
      if (existing is null)
      {
        return NotFound();
      }

      existing.FirstName = user.FirstName;
      existing.LastName = user.LastName;
      existing.Bio = user.Bio;
      existing.Location = user.Location;
      existing.Website = user.Website;
      existing.UserName = user.UserName;
      existing.Dob = user.Dob;
      existing.Email = user.Email;
      existing.Image = user.Image;
      existing.Banner = user.Banner;
      existing.DefaultPrimaryColor = user.DefaultPrimaryColor;
      await db.SaveChangesAsync();

      return NoContent();
    }

    [HttpPost("{followerId}/follow/{followedId}")]
    public async Task<IActionResult> Follow(long followerId, long followedId)
    {
      var follower = await db.Users.FindAsync(followerId);
      var followed = await db.Users.FindAsync(followedId);
      if (follower is null || followed is null)
      {
        return NotFound();
      }

      var followerIdValue = followerId.ToString();
      var followedIdValue = followedId.ToString();
      if (!followed.Followers.Contains(followerIdValue))
      {
        followed.Followers.Add(followerIdValue);
      }

      if (!follower.Following.Contains(followedIdValue))
      {
        follower.Following.Add(followedIdValue);
      }

      await db.SaveChangesAsync();
      return NoContent();
    }

    [HttpDelete("{followerId}/follow/{followedId}")]
    public async Task<IActionResult> Unfollow(long followerId, long followedId)
    {
      var follower = await db.Users.FindAsync(followerId);
      var followed = await db.Users.FindAsync(followedId);
      if (follower is null || followed is null)
      {
        return NotFound();
      }

      followed.Followers.Remove(followerId.ToString());
      follower.Following.Remove(followedId.ToString());

      await db.SaveChangesAsync();
      return NoContent();
    }
  }
}
