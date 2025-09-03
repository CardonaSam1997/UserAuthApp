using Microsoft.EntityFrameworkCore;
using UserAuthenticationApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ?? Configurar DbContext con la cadena de conexión del appsettings.json
builder.Services.AddDbContext<UserAuthDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
