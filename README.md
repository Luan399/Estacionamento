# Estacionamento
Trabalho de Desenvolvimento de Software Visual


# 🚗 Gerenciamento de Estacionamento

Sistema desenvolvido para a disciplina **Desenvolvimento de Software Visual**, utilizando **C# (.NET 8)** com **Minimal API**, **Entity Framework Core** e **SQLite**.

---

## 🧩 Funcionalidades

* Cadastro, listagem, alteração e remoção de carros (**CRUD**).
* Registro de entrada e saída de veículos nas vagas.
* Listagem de veículos estacionados.
* Relatório diário com total de saídas e tempo médio de permanência.

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

* [.NET 8 SDK](https://dotnet.microsoft.com/download)
* [SQLite](https://www.sqlite.org/download.html)
* Uma ferramenta para testar APIs:

  * [VS Code + REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
  * ou [Postman](https://www.postman.com/)

---

## 🚀 Como Configurar

Clone o repositório:

```bash
git clone https://github.com/[SEU_USUARIO]/EstacionamentoProjetoFinal.git
cd EstacionamentoProjetoFinal
```

Restaure as dependências:

```bash
dotnet restore
```

Aplique as migrações (caso esteja usando `EnsureCreated`, esse passo é opcional):

```bash
dotnet ef database update
```

Execute o projeto:

```bash
dotnet run
```

## 🧪 Como Testar

Use o arquivo **`Tests/Test.http`** no VS Code (com a extensão REST Client) ou importe a coleção no **Postman**.

### 🔗 Endpoints Disponíveis

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

## 🧠 Exemplos de Testes

**Entrada de veículo:**

```http
POST http://localhost:5214/api/carro/entrada
Content-Type: application/json

{
  "placa": "ABC1234",
  "modelo": "Civic"
}
```

**Saída de veículo:**

```http
POST http://localhost:5214/api/carro/saida/40afae3f-b121-4660-949c-411894fc6197
```

**Relatório diário:**

```http
GET http://localhost:5214/api/carro/relatorio-diario
```

---

## 🤝 Contribuições da Equipe

| Membro      | Responsabilidades                                 |
| ----------- | ------------------------------------------------- |
| **Leandro** | Configuração do projeto e endpoints de CRUD       |
| **Luan F**  | Modelos e configuração do banco de dados          |
| **Gabriel** | Seed de dados, README, testes HTTP e documentação |
| **Juliano** | Endpoints de entrada, saída e relatório diário    |


### ✅ Resultado Esperado

O sistema estará pronto para:

* Executar localmente com `dotnet run`;
* Registrar e liberar vagas dinamicamente;
* Gerar relatório diário de movimentações;
* Ser testado via Postman ou REST Client;
* Ter documentação e testes validados em equipe.




