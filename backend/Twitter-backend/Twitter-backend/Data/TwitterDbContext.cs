using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Twitter_backend.Models;

namespace Twitter_backend.Data
{
  public class TwitterDbContext(DbContextOptions<TwitterDbContext> options) : DbContext(options)
  {
    public DbSet<User> Users => Set<User>();
    public DbSet<Tweet> Tweets => Set<Tweet>();
    public DbSet<Bookmark> Bookmarks => Set<Bookmark>();
    public DbSet<Chat> Messages => Set<Chat>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      ConfigureUsers(modelBuilder);
      ConfigureTweets(modelBuilder);
      ConfigureBookmarks(modelBuilder);
      ConfigureMessages(modelBuilder);
    }

    private static void ConfigureUsers(ModelBuilder modelBuilder)
    {
      var listComparer = CreateStringListComparer();

      modelBuilder.Entity<User>(entity =>
      {
        entity.ToTable("Users");
        entity.HasKey(user => user.Id);
        entity.Property(user => user.Email).HasMaxLength(256).IsRequired();
        entity.Property(user => user.Password).IsRequired();
        entity.Property(user => user.UserName).HasMaxLength(100).IsRequired();
        entity.Property(user => user.FirstName).HasMaxLength(100).IsRequired();
        entity.Property(user => user.LastName).HasMaxLength(100).IsRequired();
        entity.HasIndex(user => user.Email).IsUnique();

        entity.Property(user => user.Followers)
          .HasConversion(
            value => JsonSerializer.Serialize(value, (JsonSerializerOptions?)null),
            value => JsonSerializer.Deserialize<List<string>>(value, (JsonSerializerOptions?)null) ?? new List<string>())
          .Metadata.SetValueComparer(listComparer);

        entity.Property(user => user.Following)
          .HasConversion(
            value => JsonSerializer.Serialize(value, (JsonSerializerOptions?)null),
            value => JsonSerializer.Deserialize<List<string>>(value, (JsonSerializerOptions?)null) ?? new List<string>())
          .Metadata.SetValueComparer(listComparer);
      });
    }

    private static void ConfigureTweets(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Tweet>(entity =>
      {
        entity.ToTable("Tweets");
        entity.HasKey(tweet => tweet.Id);
        entity.Property(tweet => tweet.Content).IsRequired();
        entity.Property(tweet => tweet.UserId).IsRequired();
        entity.Property(tweet => tweet.CreatedAt).HasMaxLength(100).IsRequired();

        entity.HasOne<User>()
          .WithMany()
          .HasForeignKey(tweet => tweet.UserId)
          .OnDelete(DeleteBehavior.Cascade);

        entity.Property(tweet => tweet.Likes)
          .HasConversion(
            value => JsonSerializer.Serialize(value, (JsonSerializerOptions?)null),
            value => JsonSerializer.Deserialize<List<string>>(value, (JsonSerializerOptions?)null) ?? new List<string>())
          .Metadata.SetValueComparer(CreateStringListComparer());
      });
    }

    private static void ConfigureBookmarks(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Bookmark>(entity =>
      {
        entity.ToTable("Bookmarks");
        entity.HasKey(bookmark => bookmark.Id);
        entity.Property(bookmark => bookmark.UserId).IsRequired();
        entity.Property(bookmark => bookmark.TweetId).IsRequired();
        entity.HasIndex(bookmark => new { bookmark.UserId, bookmark.TweetId }).IsUnique();

        entity.HasOne<User>()
          .WithMany()
          .HasForeignKey(bookmark => bookmark.UserId)
          .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne<Tweet>()
          .WithMany()
          .HasForeignKey(bookmark => bookmark.TweetId)
          .OnDelete(DeleteBehavior.NoAction);
      });
    }

    private static void ConfigureMessages(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Chat>(entity =>
      {
        entity.ToTable("Messages");
        entity.HasKey(message => message.Id);
        entity.Property(message => message.SenderId).IsRequired();
        entity.Property(message => message.RecieverId).IsRequired();
        entity.Property(message => message.CreatedAt).HasMaxLength(100).IsRequired();
        entity.Property(message => message.Text).HasDefaultValue(string.Empty);
        entity.Property(message => message.Attachment).HasDefaultValue(string.Empty);
      });
    }

    private static ValueComparer<List<string>> CreateStringListComparer()
    {
      return new ValueComparer<List<string>>(
        (left, right) => left != null && right != null && left.SequenceEqual(right),
        value => value.Aggregate(0, (hash, item) => HashCode.Combine(hash, item.GetHashCode())),
        value => value.ToList());
    }
  }
}
