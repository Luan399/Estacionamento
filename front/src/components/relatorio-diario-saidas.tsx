import React, { useEffect, useState } from "react";
import axios from "axios";

interface SaidaRegistro {
  horaEntrada?: string;
  horaSaida?: string;
  tempoPermanenciaMinutos?: number;
}

interface ResumoDiario {
  Data: string;
  TotalSaidas: number;
  TempoMedioMinutos: number;
  TotalMinutos?: number;
}

export default function RelatorioDiarioSaidas() {
  const [data] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [resumo, setResumo] = useState<ResumoDiario | null>(null);
  const [itens, setItens] = useState<SaidaRegistro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const base = "http://localhost:5117";
  const resumoEndpoint = `${base}/api/carro/relatorio-diario`;
  const saidasDiaEndpoint = (d: string) => `${base}/api/carro/saidas-dia/${d}`;
  const saidasTodasEndpoint = `${base}/api/carro/saidas`;

  useEffect(() => {
    carregarDia();
  }, []);

  async function carregarDia() {
    const d = new Date().toISOString().slice(0, 10);
    setLoading(true);
    setError(null);
    try {
      
      const rResumo = await axios.get<ResumoDiario>(resumoEndpoint);
      setResumo(rResumo.data);
      
      let listaSaidas: any[] = [];
      try {
        const rSaidasDia = await axios.get(saidasDiaEndpoint(d));
        listaSaidas = Array.isArray(rSaidasDia.data) ? rSaidasDia.data : [];
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          
          const rTodas = await axios.get(saidasTodasEndpoint);
          const todas = Array.isArray(rTodas.data) ? rTodas.data : [];
          listaSaidas = todas.filter((s: any) => {
            const saida = s.HoraSaida || s.horaSaida;
            if (!saida) return false;
            return new Date(saida).toISOString().slice(0,10) === d;
          });
        } else {
          throw err;
        }
      }
      const itensDetalhados = normalizarLista(listaSaidas);
      setItens(itensDetalhados);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  

  function normalizarLista(raw: any): SaidaRegistro[] {
    const baseArr = Array.isArray(raw) ? raw : Array.isArray(raw?.saidas) ? raw.saidas : [];
    
    return baseArr.map((x: any) => ({
      horaEntrada: x?.HoraEntrada ?? x?.horaEntrada,
      horaSaida: x?.HoraSaida ?? x?.horaSaida,
      tempoPermanenciaMinutos: x?.TempoPermanenciaMinutos ?? x?.tempoPermanenciaMinutos
    })).filter((x: SaidaRegistro) => x.horaEntrada && x.horaSaida); 
  }

  function minutosItem(it: SaidaRegistro): number {
    
    if (it.tempoPermanenciaMinutos && it.tempoPermanenciaMinutos > 0) {
        return it.tempoPermanenciaMinutos;
    }

    
    const entrada = new Date(it.horaEntrada!);
    const saida = new Date(it.horaSaida!);

    if (isNaN(entrada.getTime()) || isNaN(saida.getTime())) {
        console.error("Data inválida encontrada:", it);
        return 0;
    }

    const diff = (saida.getTime() - entrada.getTime()) / 60000; // ms para minutos
    return diff > 0 ? Math.round(diff) : 0;
  }

  const totalMinutosItens = itens.reduce((acc, it) => acc + minutosItem(it), 0);
  
  const totalFinal = resumo && (resumo as any).TotalMinutos !== undefined
    ? (resumo as any).TotalMinutos
    : totalMinutosItens;

  function formatarTotal(min: number): string {
    if (min <= 0) return "0 min";
    const horas = Math.floor(min / 60);
    const minutos = min % 60;
    if (horas === 0) return `${minutos} min`;
    return `${horas}h ${minutos}min`;
  }

  const textoTotalFormatado = formatarTotal(totalFinal);

  return (
    <div>
      <h1>Relatório Diário de Saídas</h1>
      <div style={{ background: '#eef', padding: '20px', borderRadius: 8 }}>
        <h2>Total de Minutos (Saídas Hoje): {loading ? 'Calculando...' : totalFinal}</h2>
        <p>Total de Veículos que Saíram Hoje: {resumo ? resumo.TotalSaidas : itens.length}</p>
        <p>Tempo total de carros que passaram hoje é: {loading ? 'Calculando...' : textoTotalFormatado}</p>
        {error && <p style={{color:'red'}}>{error}</p>}
      </div>
    </div>
  );
}