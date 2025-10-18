using System;
using System.Text.Json.Serialization;

namespace MinimalApiEstacionamento.Models
{
    public class Carro
    {
        public Carro()
        {
            Id = Guid.NewGuid().ToString();
            CriadoEm = DateTime.Now;
        }

        public string Id { get; set; }
        public string? Placa { get; set; }
        public string? Modelo { get; set; }
        public DateTime CriadoEm { get; set; }

        // Relacionamento com vaga
        public int? VagaId { get; set; }

        [JsonIgnore] // Evita referência cíclica
        public Vaga? Vaga { get; set; }

        // Para calcular saída
        public DateTime? HoraEntrada { get; set; }
        public bool Estacionado { get; set; } = false;
    }
}