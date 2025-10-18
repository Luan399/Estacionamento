using System;
using System.Text.Json.Serialization;

namespace MinimalApiEstacionamento.Models
{

    public class Vaga
    {
        public int Id { get; set; }
        public int Numero { get; set; }
        public bool Ocupada { get; set; } = false;

        public string? VeiculoId { get; set; }

        [JsonIgnore]
        public Carro? Veiculo { get; set; }
    }
}
