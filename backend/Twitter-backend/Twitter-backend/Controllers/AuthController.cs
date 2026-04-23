using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Twitter_backend.Data;
using Twitter_backend.Models;

namespace Twitter_backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController(TwitterDbContext db) : ControllerBase
  {
    public record LoginRequest(string Email, string Password);

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(User user)
    {
      if (await db.Users.AnyAsync(existing => existing.Email == user.Email))
      {
        return Conflict("Email is already registered.");
      }

      user.CreatedAt = string.IsNullOrWhiteSpace(user.CreatedAt) ? DateTime.Now.ToShortDateString() : user.CreatedAt;
      user.Followers ??= [];
      user.Following ??= [];
      db.Users.Add(user);
      await db.SaveChangesAsync();

      return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<object>> Login(LoginRequest request)
    {
      var user = await db.Users.FirstOrDefaultAsync(existing =>
        existing.Email == request.Email &&
        existing.Password == request.Password);

      return user is null ? Unauthorized("Invalid email or password.") : Ok(new { token = user.Id, user });
    }

    [HttpPost("forgot-password")]
    public IActionResult ForgotPassword()
    {
      return Ok("Password reset is not configured for the local .NET API yet.");
    }
  }
}
