using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinimalApiEstacionamento.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuração SQLite banco
builder.Services.AddDbContext<AppDataContext>(options =>
    options.UseSqlite("Data Source=Estacionamento.db"));


builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.WriteIndented = true;
});

var app = builder.Build();

app.MapGet("/", () => "API Estacionamento");



app.Run();
