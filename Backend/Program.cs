using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.IdentityModel.Tokens;
using SmartFixApi.Data;
using System.Text;
using System.Text.Json;
using SmartFixApi.Models;
using SmartFixApi.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue;
    options.MemoryBufferThreshold = int.MaxValue;
});

builder.WebHost.ConfigureKestrel(serverOptions =>   
{
    serverOptions.Limits.MaxRequestBodySize = 52428800; 
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 33))
    )
);
builder.Services.AddHttpClient();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ------------------- JWT Authentication -------------------
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });

// ------------------- Authorization -------------------
builder.Services.AddAuthorization();

// ------------------- CORS -------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        // Если проект запущен локально (в режиме разработки)
        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(origin => true) // Разрешает любой origin (включая localhost с любым портом)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials(); // На локалке SignalR не будет ругаться
        }
        else
        {
            // На сервере (Production) оставляем ваш рабочий вариант
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
    });
});

builder.Services.AddSingleton<ITelegramService, TelegramService>();
builder.Services.AddHostedService<TelegramBotListener>();
builder.Services.AddSignalR();

var app = builder.Build();

// ------------------- Swagger -------------------
// ВРЕМЕННЫЙ ТЕСТОВЫЙ ВАРИАНТ (Swagger доступен всегда)
// if (app.Environment.IsDevelopment())
// {
app.UseCors("AllowAll");      
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartFix API v1");
    c.RoutePrefix = "swagger"; // Гарантирует, что путь будет именно /swagger
});
// }

// ------------------- Middleware -------------------

var avatarsPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "avatars");
if (!Directory.Exists(avatarsPath))
{
    Directory.CreateDirectory(avatarsPath);
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(avatarsPath),
    RequestPath = "/avatars"
});
app.UseStaticFiles(); // На случай, если есть другие статические файлы

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");
app.Run();
