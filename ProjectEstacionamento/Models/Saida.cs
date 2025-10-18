using System;

namespace MinimalApiEstacionamento.Models
{
    public class Saida
    {
        public int Id { get; set; }
        public string VeiculoId { get; set; } = string.Empty;
        public string? VeiculoPlaca { get; set; }
        public DateTime HoraEntrada { get; set; }
        public DateTime HoraSaida { get; set; }
        public int TempoPermanenciaMinutos { get; set; }
    }
}

