# 🚗 Gerenciamento de Estacionamento

Sistema full-stack desenvolvido para a disciplina **Desenvolvimento de Software Visual**, com **Backend em C# (.NET 8)** com **Minimal API** e **Entity Framework Core**, e **Frontend em React com TypeScript**.

---

## 📁 Estrutura do Projeto

```
Estacionamento/
├── front/                          # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── alterar-carro.tsx
│   │   │   ├── cadastrar-carro.tsx
│   │   │   ├── listar-carros.tsx
│   │   │   └── relatorio-diario-saidas.tsx
│   │   ├── models/
│   │   │   ├── carro.ts
│   │   │   ├── saida.ts
│   │   │   └── vagas.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
│
└── ProjectEstacionamento/          # Backend .NET 8
    ├── Models/
    │   ├── Carro.cs
    │   ├── Saida.cs
    │   ├── Vagas.cs
    │   └── AppDataContext.cs
    ├── Migrations/
    ├── Program.cs
    └── ProjectEstacionamento.csproj
```

---

## 🧩 Funcionalidades

* ✅ Cadastro, listagem, alteração e remoção de carros (**CRUD**)
* ✅ Registro de entrada e saída de veículos nas vagas
* ✅ Listagem de veículos estacionados
* ✅ Relatório diário com total de saídas e tempo médio de permanência
* ✅ Interface amigável em React com TypeScript

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

* [.NET 8 SDK](https://dotnet.microsoft.com/download)
* [Node.js (v18+)](https://nodejs.org/)
* [SQLite](https://www.sqlite.org/download.html)
* Uma ferramenta para testar APIs:
  * [VS Code + REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
  * ou [Postman](https://www.postman.com/)

---

## 🚀 Como Configurar

### Backend (.NET)

```bash
cd ProjectEstacionamento
dotnet restore
dotnet ef database update
dotnet run
```

O servidor estará disponível em `http://localhost:5117`

### Frontend (React)

```bash
cd front
npm install
npm start
```

A aplicação estará disponível em `http://localhost:3000`

---

## 🔗 Endpoints da API

| Método   | Endpoint                      | Descrição                        |
| -------- | ----------------------------- | -------------------------------- |
| `POST`   | `/api/carro/cadastrar`        | Cadastra um novo carro           |
| `GET`    | `/api/carro/listar`           | Lista todos os carros            |
| `PATCH`  | `/api/carro/alterar/{id}`     | Altera um carro existente        |
| `DELETE` | `/api/carro/remover/{id}`     | Remove um carro                  |
| `POST`   | `/api/carro/entrada`          | Registra a entrada de um veículo |
| `POST`   | `/api/carro/saida/{id}`       | Registra a saída de um veículo   |
| `GET`    | `/api/carro/estacionados`     | Lista veículos estacionados      |
| `GET`    | `/api/carro/relatorio-diario` | Gera o relatório diário          |

---

## 🧪 Como Testar

### Via REST Client (VS Code)

Use o arquivo `ProjectEstacionamento/Test.http` ou `ProjectEstacionamento/ProjectEstacionamento.http` para testar os endpoints.

**Exemplo - Entrada de veículo:**

```http
POST http://localhost:5117/api/carro/entrada
Content-Type: application/json

{
  "placa": "ABC1234",
  "modelo": "Civic"
}
```

**Exemplo - Saída de veículo:**

```http
POST http://localhost:5117/api/carro/saida/40afae3f-b121-4660-949c-411894fc6197
```

**Exemplo - Relatório diário:**

```http
GET http://localhost:5117/api/carro/relatorio-diario
```

### Via Interface Web

Após iniciar o frontend, você poderá:
- Cadastrar novos carros
- Alterar informações de carros
- Listar todos os carros
- Registrar entrada e saída de veículos
- Visualizar relatório diário

---

## 🗄️ Modelos de Dados

### Carro
```csharp
public class Carro
{
    public Guid Id { get; set; }
    public string Placa { get; set; }
    public string Modelo { get; set; }
}
```

### Saída
```csharp
public class Saida
{
    public Guid Id { get; set; }
    public DateTime DataSaida { get; set; }
    public TimeSpan TempoMedio { get; set; }
}
```

### Vagas
```csharp
public class Vagas
{
    public Guid Id { get; set; }
    public Guid CarroId { get; set; }
    public DateTime DataEntrada { get; set; }
    public DateTime? DataSaida { get; set; }
}
```

---

## ✅ Fluxo de Uso

1. **Cadastrar um carro** - Use a interface web ou endpoint `/api/carro/cadastrar`
2. **Registrar entrada** - Registre a entrada do veículo em uma vaga
3. **Visualizar estacionados** - Veja todos os veículos atualmente estacionados
4. **Registrar saída** - Registre a saída do veículo
5. **Consultar relatório** - Verifique o relatório diário de movimentações

---

## 📝 Notas

- O banco de dados utiliza **SQLite** e é criado automaticamente
- As migrações estão disponíveis em `ProjectEstacionamento/Migrations/`
- A aplicação frontend se conecta ao backend via `http://localhost:5117`

---

## 👨‍💻 Desenvolvedor

**Luan399**

Projeto desenvolvido como trabalho de conclusão da disciplina de Desenvolvimento de Software Visual.
