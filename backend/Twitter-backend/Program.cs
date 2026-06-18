using Microsoft.EntityFrameworkCore;
using Twitter_backend.Data;
using Twitter_backend.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Add services to the container.

builder.Services.AddCors(options =>
{
  options.AddPolicy("AngularApp", policy =>
  {
    policy.WithOrigins("http://localhost:4200", "https://twitter-firebase-xi.vercel.app", "https://project-anidb.vercel.app")
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials();
  });
});
builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddDbContext<TwitterDbContext>(options =>
  options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection"),
    sqlOptions => sqlOptions.EnableRetryOnFailure()));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Configuration.GetValue<bool>("Database:AutoMigrate"))
{
  using var scope = app.Services.CreateScope();
  var db = scope.ServiceProvider.GetRequiredService<TwitterDbContext>();
  db.Database.Migrate();
}

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();

app.UseStaticFiles();
app.UseCors("AngularApp");

app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

app.Run();
