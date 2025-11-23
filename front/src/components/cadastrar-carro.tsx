
import React, { useState } from "react";
import { carro } from "../models/carro";
import axios from "axios";


function CadastrarCarro() {
    
    const [placa, setPlaca] = useState("");
    const [modelo, setModelo] = useState("");

    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await submeterProdutoAPI();
    }

     async function submeterProdutoAPI() {
    
    try {
      
      const carroPayload: Partial<carro> = {
       placa, modelo
      };
      const resposta = await axios.post("http://localhost:5117/api/carro/cadastrar", carroPayload);
      console.log(resposta.data);
    } catch (error : any) {
      const status = error?.response?.status;
      if(status === 409){
        console.log("já cadastrado");
      } else {
        console.log("Erro ao cadastrar:", error);
      }
    }
  }

    return (
        <div>
            <h1>Cadastrar Carro</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Placa:</label>
                    <input value={placa} onChange={(e) => setPlaca(e.target.value)} type="text" />
                </div>
                <div>
                    <label>Modelo:</label>
                    <input
                        value={modelo}
                        type="text"
                        onChange={(e) => setModelo(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit">Cadastrar</button>
                </div>
            </form>
        </div>
    );
}

export default CadastrarCarro;