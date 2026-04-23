using Microsoft.AspNetCore.Mvc;

namespace Twitter_backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UploadsController(IWebHostEnvironment environment) : ControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<object>> Upload(IFormFile file)
    {
      if (file.Length == 0 || !file.ContentType.StartsWith("image/"))
      {
        return BadRequest("Please upload an image file.");
      }

      var uploadsPath = Path.Combine(environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot"), "uploads");
      Directory.CreateDirectory(uploadsPath);

      var extension = Path.GetExtension(file.FileName);
      var fileName = $"{Guid.NewGuid():N}{extension}";
      var filePath = Path.Combine(uploadsPath, fileName);

      await using var stream = System.IO.File.Create(filePath);
      await file.CopyToAsync(stream);

      var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
      return Ok(new { url });
    }
  }
}
