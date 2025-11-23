import { useEffect, useState } from "react";
import { carro } from "../models/carro";
import axios from "axios";


function AlterarCarro() {
    const [carros, setCarros] = useState<carro[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPlaca, setEditPlaca] = useState("");
    const [editModelo, setEditModelo] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        carregarCarro();
    }, []);

    async function carregarCarro() {
        setLoading(true);
        setErrorMsg(null);
        try {
            const resposta = await axios.get<carro[]>("http://localhost:5117/api/carro/listar");
            console.log("GET /carro/listar =>", resposta.data);
            setCarros(resposta.data ?? []);
        } catch (error: any) {
            console.error("Erro na requisição:", error);
            setErrorMsg(error?.response?.data ?? String(error));
            setCarros([]);
        } finally {
            setLoading(false);
        }
    }

    function iniciarEdicao(c: carro) {
        setEditingId(c.id != null ? String(c.id) : null);
        setEditPlaca(c.placa ?? "");
        setEditModelo(c.modelo ?? "");
    }

    function cancelarEdicao() {
        setEditingId(null);
        setEditPlaca("");
        setEditModelo("");
    }

    async function salvarEdicao(id: string) {
        try {
            
            await axios.patch(http://localhost:5117/api/carro/alterar/${id}, {
                placa: editPlaca,
                modelo: editModelo,
            });
            await carregarCarro();
            cancelarEdicao();
        } catch (error) {
            console.error("Erro ao alterar carro:", error);
            
        }
    }

    return (
        <div>
            <h1>Alterar Carro</h1>

            <div style={{ marginBottom: 12 }}>
                <button onClick={carregarCarro} disabled={loading}>
                    {loading ? "Carregando..." : "Atualizar lista"}
                </button>
                {loading && <span style={{ marginLeft: 8 }}>Carregando...</span>}
                {errorMsg && <div style={{ color: "red", marginTop: 8 }}>Erro: {errorMsg}</div>}
            </div>

            {!loading && carros.length === 0 && !errorMsg ? (
                <div>Nenhum carro encontrado. Verifique se a API está ativa e a rota está correta.</div>
            ) : (
                <table border={1} cellPadding={6} cellSpacing={0} style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left" }}>#</th>
                            <th style={{ textAlign: "left" }}>Placa</th>
                            <th style={{ textAlign: "left" }}>Modelo</th>
                            <th style={{ textAlign: "left" }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carros.map((c) => (
                            <tr key={c.id ?? Math.random()}>
                                <td>{c.id}</td>

                                {editingId === String(c.id) ? (
                                    <>
                                        <td>
                                            <input
                                                value={editPlaca}
                                                onChange={(e) => setEditPlaca(e.target.value)}
                                                type="text"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                value={editModelo}
                                                onChange={(e) => setEditModelo(e.target.value)}
                                                type="text"
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => salvarEdicao(String(c.id))}>Salvar</button>
                                            <button onClick={cancelarEdicao} style={{ marginLeft: 8 }}>Cancelar</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{c.placa}</td>
                                        <td>{c.modelo}</td>
                                        <td>
                                            <button onClick={() => iniciarEdicao(c)}>Editar</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AlterarCarro;