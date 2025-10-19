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

// ----------------- CARRO -----------------

app.MapPost("/api/carro/cadastrar", ([FromBody] Carro carro, [FromServices] AppDataContext ctx) =>
{
    if (ctx.Carros.Any(c => c.Placa == carro.Placa))
        return Results.Conflict("Carro já cadastrado!");

    ctx.Carros.Add(carro);
    ctx.SaveChanges();
    return Results.Created("/api/carro/cadastrar", carro);
});
// ------------------ LISTAR CARROS -----------------
app.MapGet("/api/carro/listar", ([FromServices] AppDataContext ctx) =>
{
    var lista = ctx.Carros.Include(c => c.Vaga).ToList();
    return lista.Any() ? Results.Ok(lista) : Results.BadRequest("Nenhum carro cadastrado!");
});
// ----------------- REMOVER CARRO -----------------
app.MapDelete("/api/carro/remover/{id}", ([FromRoute] string id, [FromServices] AppDataContext ctx) =>
{
    var carro = ctx.Carros.Find(id);
    if (carro is null) return Results.NotFound("Carro não encontrado!");

    ctx.Carros.Remove(carro);
    ctx.SaveChanges();
    return Results.Ok(carro);
});
// ----------------- ALTERAR CARRO -----------------
app.MapPatch("/api/carro/alterar/{id}", ([FromRoute] string id, [FromBody] Carro carroAlterado, [FromServices] AppDataContext ctx) =>
{
    var carro = ctx.Carros.Find(id);
    if (carro is null) return Results.NotFound("Carro não encontrado!");

    carro.Placa = carroAlterado.Placa;
    carro.Modelo = carroAlterado.Modelo;
    ctx.SaveChanges();
    return Results.Ok(carro);
});

// Criar vagas iniciais
using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<AppDataContext>();
    ctx.Database.EnsureCreated();

    if (!ctx.Vagas.Any())
    {
        for (int i = 1; i <= 10; i++)
            ctx.Vagas.Add(new Vaga { Numero = i });
        ctx.SaveChanges();
    }
}

// ----------------- ESTACIONAMENTO -----------------

// Entrada de veículo
app.MapPost("/api/carro/entrada", async ([FromBody] Carro carro, [FromServices] AppDataContext ctx) =>
{
    if (ctx.Carros.Any(c => c.Placa == carro.Placa && c.Estacionado))
        return Results.Conflict("Veículo já está estacionado.");

    var vaga = await ctx.Vagas.FirstOrDefaultAsync(v => !v.Ocupada);
    if (vaga is null)
        return Results.BadRequest("Estacionamento lotado.");

    carro.Estacionado = true;
    carro.HoraEntrada = DateTime.Now;
    carro.Vaga = vaga;
    carro.VagaId = vaga.Id;

    ctx.Carros.Add(carro);

    vaga.Ocupada = true;
    vaga.VeiculoId = carro.Id;

    await ctx.SaveChangesAsync();
    return Results.Created($"/api/carro/{carro.Id}", carro);
});

// Listar veículos estacionados
app.MapGet("/api/carro/estacionados", async ([FromServices] AppDataContext ctx) =>
{
    var carros = await ctx.Carros
        .Include(c => c.Vaga)
        .Where(c => c.Estacionado)
        .ToListAsync();

    if (!carros.Any())
        return Results.Ok("Não há veículos estacionados" );

    return Results.Ok(carros);
});



app.Run();
