using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Twitter_backend.Data;
using Twitter_backend.Hubs;
using Twitter_backend.Models;

namespace Twitter_backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ChatController(TwitterDbContext db, IHubContext<ChatHub> hubContext) : ControllerBase
  {
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Chat>>> GetAll()
    {
      return Ok(await db.Messages.ToListAsync());
    }

    [HttpGet("recent")]
    public async Task<ActionResult<IEnumerable<Chat>>> GetRecent([FromQuery] long receiverId, [FromQuery] long senderId)
    {
      var messages = await db.Messages.ToListAsync();

      var latestToReceiver = messages
        .Where(message => message.RecieverId == receiverId && message.SenderId == senderId)
        .OrderByDescending(message => DateTime.TryParse(message.CreatedAt, out var createdAt) ? createdAt : DateTime.MinValue)
        .Take(1);

      var latestToSender = messages
        .Where(message => message.RecieverId == senderId && message.SenderId == receiverId)
        .OrderByDescending(message => DateTime.TryParse(message.CreatedAt, out var createdAt) ? createdAt : DateTime.MinValue)
        .Take(1);

      return Ok(latestToReceiver.Concat(latestToSender));
    }

    [HttpPost]
    public async Task<ActionResult<Chat>> Send(Chat chat)
    {
      chat.CreatedAt = string.IsNullOrWhiteSpace(chat.CreatedAt) ? DateTime.Now.ToString() : chat.CreatedAt;
      db.Messages.Add(chat);
      await db.SaveChangesAsync();
      await hubContext.Clients.All.SendAsync("ReceiveMessage", chat);
      return CreatedAtAction(nameof(GetAll), new { id = chat.Id }, chat);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
      await db.Messages.Where(message => message.Id == id).ExecuteDeleteAsync();
      return NoContent();
    }
  }
}
