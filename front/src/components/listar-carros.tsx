import React, { useEffect, useState } from "react";
import axios from "axios";
import { carro } from "../models/carro";

function ListarCarros() {
    const [carros, setCarros] = useState<carro[]>([]);
    const [estacionados, setEstacionados] = useState<carro[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingEstacionados, setLoadingEstacionados] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorEstacionados, setErrorEstacionados] = useState<string | null>(null);
    const [acaoLoadingIds, setAcaoLoadingIds] = useState<number[]>([]);
    const [removendoIds, setRemovendoIds] = useState<number[]>([]);
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [ultimoEstacionado, setUltimoEstacionado] = useState<carro | null>(null);

    useEffect(() => {
        carregarCarros();
        carregarEstacionados();
    }, []);

    async function carregarCarros() {
        setLoading(true);
        setError(null);
        setMensagem(null);
        try {
            const resposta = await axios.get<carro[]>("http://localhost:5117/api/carro/listar");
            setCarros(resposta.data ?? []);
        } catch (err: any) {
            console.error("Erro ao carregar carros:", err);
            setError(err?.response?.data ?? err.message ?? String(err));
            setCarros([]);
        } finally {
            setLoading(false);
        }
    }

    async function carregarEstacionados() {
        setLoadingEstacionados(true);
        setErrorEstacionados(null);
        try {
            const resposta = await axios.get("http://localhost:5117/api/carro/estacionados");
            const d: any = resposta.data;
            const lista =
                Array.isArray(d) ? d :
                Array.isArray(d?.data) ? d.data :
                Array.isArray(d?.carros) ? d.carros :
                Array.isArray(d?.items) ? d.items :
                (d && (d.id !== undefined || d.placa !== undefined || d.modelo !== undefined)) ? [d] :
                [];
            setEstacionados(lista as carro[]);
        } catch (err: any) {
            console.error("Erro ao carregar carros estacionados:", err);
            setErrorEstacionados(err?.response?.data ?? err?.message ?? "Erro na requisição");
            setEstacionados([]);
        } finally {
            setLoadingEstacionados(false);
        }
    }

    async function removerCarro(c: carro) {
        const id = (c as any).id as number | undefined;
        if (!id) return;

        setMensagem(null);
        setRemovendoIds((prev) => [...prev, id]);

        try {
            const url = `http://localhost:5117/api/carro/remover/${encodeURIComponent(String(id))}`;
            const resp = await axios.delete(url);

            const serverMsg = resp?.data
                ? (typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data))
                : `Carro ${id} removido com sucesso.`;
            setMensagem(serverMsg);

            
            setCarros((prev) => prev.filter((x) => (x as any).id !== id));
            setEstacionados((prev) => prev.filter((x) => (x as any).id !== id));
        } catch (err: any) {
            console.error("Erro ao remover carro:", err);
            const status = err?.response?.status;
            if (status === 404) setMensagem("Carro não encontrado.");
            else {
                const server = err?.response?.data;
                const msg = typeof server === "string" ? server : server ? JSON.stringify(server) : err?.message ?? "Erro desconhecido";
                setMensagem(`Falha ao remover: ${msg}`);
            }
        } finally {
            setRemovendoIds((prev) => prev.filter((v) => v !== id));
        }
    }

    async function estacionarCarro(c: carro) {
        const id = (c as any).id;
        const placa = (c as any).placa;
        if (!placa) return;

        setMensagem(null);
        if (id) setAcaoLoadingIds((prev) => [...prev, id]);

        try {
            const resp = await axios.post<carro>(
                `http://localhost:5117/api/carro/entrada/${encodeURIComponent(placa)}`
            );

            const atualizado = resp.data;
            setUltimoEstacionado(atualizado);
            setMensagem(`Estacionado: ID ${ (atualizado as any).id } | ${ (atualizado as any).modelo } | ${ (atualizado as any).placa }`);

            
            setCarros(prev =>
                prev.map(x => ((x as any).id === (atualizado as any).id ? { ...x, ...atualizado } : x))
            );
            
            await carregarEstacionados();
        } catch (err: any) {
            console.error("Erro ao estacionar:", err);
            setMensagem(`Falha ao estacionar: ${err?.response?.data ?? err.message}`);
        } finally {
            if (id) setAcaoLoadingIds((prev) => prev.filter(v => v !== id));
        }
    }

    async function sairDaVaga(c: carro) {
        const id = (c as any).id;
        if (!id) return;

        setMensagem(null);
        setAcaoLoadingIds((prev) => [...prev, id]);

        try {
            const resp = await axios.post<{ Saida: any; TempoMinutos: number }>(
                `http://localhost:5117/api/carro/saida/${encodeURIComponent(id)}`
            );

            const tempoMinutos = (resp as any)?.data?.TempoMinutos;
            setMensagem(
                `Saída registrada: ID ${(c as any).id} | ${(c as any).modelo} | ${(c as any).placa}` +
                    (tempoMinutos != null ? ` | ${tempoMinutos} min` : "")
            );

            
            setCarros((prev) =>
                prev.map((x) =>
                    (x as any).id === id
                        ? { ...x, estacionado: false, vagaId: null, horaEntrada: null }
                        : x
                )
            );
            await carregarEstacionados();
        } catch (err: any) {
            console.error("Erro na saída:", err);
            setMensagem(`Falha na saída: ${err?.response?.data ?? err.message}`);
        } finally {
            setAcaoLoadingIds((prev) => prev.filter((v) => v !== id));
        }
    }

    return (
        <div>
            <h1>Listar Carros</h1>

            <div style={{ marginBottom: 12 }}>
                <button onClick={carregarCarros} disabled={loading}>
                    {loading ? "Carregando..." : "Atualizar lista"}
                </button>
            </div>

            {error && <div style={{ color: "red" }}>Erro: {error}</div>}
            {mensagem && <div style={{ color: "#006400" }}>{mensagem}</div>}
            {ultimoEstacionado && (
                <div style={{ margin: "8px 0" }}>
                    Último estacionado: ID {(ultimoEstacionado as any).id} | {(ultimoEstacionado as any).modelo} | {(ultimoEstacionado as any).placa}
                </div>
            )}

            {!loading && carros.length === 0 && !error && (
                <div>Nenhum carro encontrado.</div>
            )}

            {!loading && carros.length > 0 && (
                <table border={1} cellPadding={6} cellSpacing={0}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Modelo</th>
                            <th>Placa</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carros.map((c) => {
                            const id = (c as any).id;
                            const btnLoading = acaoLoadingIds.includes(id ?? -1);
                            const btnRemoving = removendoIds.includes(id ?? -1);
                            const estacionado = (c as any).estacionado === true;
                            return (
                                <tr key={id ?? Math.random()}>
                                    <td>{id}</td>
                                    <td>{(c as any).modelo}</td>
                                    <td>{(c as any).placa}</td>
                                    <td>
                                        <button
                                            disabled={!id || btnLoading || estacionado}
                                            onClick={() => estacionarCarro(c)}
                                        >
                                            {btnLoading ? "Estacionando..." : (estacionado ? "Já estacionado" : "Estacionar")}
                                        </button>
                                        {" "}
                                        <button
                                            disabled={!id || btnLoading || !estacionado}
                                            onClick={() => sairDaVaga(c)}
                                        >
                                            {btnLoading ? "Saindo..." : "Sair"}
                                        </button>
                                        {" "}
                                        <button
                                            disabled={!id || btnRemoving}
                                            onClick={() => removerCarro(c)}
                                            style={{ color: "#b00020" }}
                                        >
                                            {btnRemoving ? "Removendo..." : "Remover"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <h2 style={{ marginTop: 24 }}>Carros Estacionados</h2>
            {loadingEstacionados && <div>Carregando...</div>}
            {errorEstacionados && <div style={{ color: "red" }}>Erro: {errorEstacionados}</div>}
            {!loadingEstacionados && estacionados.length === 0 && !errorEstacionados && (
                <div>Nenhum carro estacionado encontrado.</div>
            )}

            {!loadingEstacionados && estacionados.length > 0 && (
                <table border={1} cellPadding={6} cellSpacing={0}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Modelo</th>
                            <th>Placa</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estacionados.map((c, idx) => {
                            const id = (c as any).id ?? (c as any).carroId ?? (c as any).idCarro ?? idx;
                            const btnLoading = acaoLoadingIds.includes(id ?? -1);
                            return (
                                <tr key={id ?? idx}>
                                    <td>{id}</td>
                                    <td>{(c as any).modelo}</td>
                                    <td>{(c as any).placa}</td>
                                    <td>
                                        <button
                                            disabled={btnLoading}
                                            onClick={() => sairDaVaga(c)}
                                        >
                                            {btnLoading ? "Saindo..." : "Sair"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ListarCarros;
