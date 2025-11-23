import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import CadastrarCarro from './components/cadastrar-carro';



function App() {
  return (
    <div>
      <div id="app">
        <BrowserRouter>
          <nav>
            <ul>
              <li><Link to="/">Home </Link></li>
              <li><Link to="/carros">Listar carros</Link></li>
              <li><Link to="/carros/cadastrar">Cadastrar carro</Link></li>
              <li><Link to="/carros/alterar">Alterar carro</Link></li>
              <li><Link to="/relatorio/saidas">Relatório diário de saídas</Link></li>
            </ul>
          </nav>

          <Routes>
            
            <Route path="/" element={<ListarCarros />} />

            
            <Route path="/carros" element={<ListarCarros />} />
            <Route path="/carros/cadastrar" element={<CadastrarCarro />} />

            
            

            
            <Route path="/relatorio/saidas" element={<RelatorioDiarioSaidas />} />

            
            <Route path="/carros/alterar" element={<AlterarCarro />} />
            <Route path="/carros/alterar/:id" element={<AlterarCarro />} />

            
          </Routes>

          <footer>Rodapé da aplicação</footer>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
