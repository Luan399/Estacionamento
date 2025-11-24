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
  const [estacionados, setEstacionados] = useState<any[]>([]); // carros ainda estacionados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // força re-render para atualização de tempo

  const base = "http://localhost:5117";
  const resumoEndpoint = `${base}/api/carro/relatorio-diario`;
  const saidasDiaEndpoint = (d: string) => `${base}/api/carro/saidas-dia/${d}`;
  const saidasTodasEndpoint = `${base}/api/carro/saidas`;
  const estacionadosEndpoint = `${base}/api/carro/estacionados`;

  useEffect(() => {
    carregarDia();
    carregarEstacionados();
  }, []);

  // Intervalo para atualizar tempo dos carros ativos a cada minuto
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
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

  async function carregarEstacionados() {
    try {
      const r = await axios.get(estacionadosEndpoint);
      const raw = r.data;
      const lista = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.carros) ? raw.carros : [];
      setEstacionados(lista);
    } catch (err) {
      console.error("Erro ao carregar estacionados", err);
      setEstacionados([]);
    }
  }

  // Recarregar estacionados ocasionalmente (ex: saída/entrada de veículos) a cada 2 minutos
  useEffect(() => {
    const id = setInterval(() => carregarEstacionados(), 120000);
    return () => clearInterval(id);
  }, []);

  

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

  const totalMinutosSaidas = itens.reduce((acc, it) => acc + minutosItem(it), 0);

  // Tempo atual dos carros estacionados (dinâmico)
  const agora = new Date();
  const totalMinutosAtivos = estacionados.reduce((acc, c) => {
    const horaEntrada = (c as any).horaEntrada || (c as any).HoraEntrada || (c as any).criadoEm;
    if (!horaEntrada) return acc;
    const dEntrada = new Date(horaEntrada);
    if (isNaN(dEntrada.getTime())) return acc;
    const diff = (agora.getTime() - dEntrada.getTime()) / 60000;
    return acc + (diff > 0 ? diff : 0);
  }, 0);

  const totalMinutosItens = totalMinutosSaidas + Math.round(totalMinutosAtivos);
  
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
        <h2>Tempo Total (Saídos + Ativos Hoje): {loading ? 'Calculando...' : textoTotalFormatado}</h2>
        <p>Veículos Saídos Hoje: {resumo ? resumo.TotalSaidas : itens.length}</p>
        <p>Veículos Ativos Agora: {estacionados.length}</p>
        <p>Minutos acumulados apenas das saídas: {Math.round(totalMinutosSaidas)}</p>
        <p>Minutos em progresso (ativos): {Math.round(totalMinutosAtivos)}</p>
        <p>Atualiza a cada minuto automaticamente.</p>
        {error && <p style={{color:'red'}}>{error}</p>}
      </div>
    </div>
  );
}