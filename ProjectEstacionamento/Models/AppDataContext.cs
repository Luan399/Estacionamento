using Microsoft.EntityFrameworkCore;

namespace MinimalApiEstacionamento.Models
{
    public class AppDataContext : DbContext
    {
        public AppDataContext(DbContextOptions<AppDataContext> options) : base(options) { }

        public DbSet<Carro> Carros { get; set; } = null!;
        public DbSet<Vaga> Vagas { get; set; } = null!;
        public DbSet<Saida> Saidas { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Carro>()
                .HasOne(c => c.Vaga)
                .WithOne(v => v.Veiculo)
                .HasForeignKey<Carro>(c => c.VagaId);
        }
    }
}
