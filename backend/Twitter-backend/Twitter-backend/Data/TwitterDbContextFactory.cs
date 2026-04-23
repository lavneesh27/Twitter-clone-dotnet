using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Twitter_backend.Data
{
  public class TwitterDbContextFactory : IDesignTimeDbContextFactory<TwitterDbContext>
  {
    public TwitterDbContext CreateDbContext(string[] args)
    {
      var optionsBuilder = new DbContextOptionsBuilder<TwitterDbContext>();
      optionsBuilder.UseSqlServer(
        "Server=CJPC10\\SQLEXPRESS;Database=TwitterDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;",
        sqlOptions => sqlOptions.EnableRetryOnFailure());

      return new TwitterDbContext(optionsBuilder.Options);
    }
  }
}
