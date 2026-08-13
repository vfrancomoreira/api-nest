# API de Cadastro de Usuários — NestJS

Trabalho acadêmico (MBA).

**Alunos:** Limber Jhonathan e Vinicius Franco

## Descrição

API REST feita com Node.js + NestJS que permite:

- Cadastrar um usuário (nome e e-mail)
- Listar todos os usuários
- Consultar um usuário específico pelo id
- Excluir um usuário

Os dados são armazenados **apenas em memória** (um array dentro do serviço), ou seja, são perdidos toda vez que a API é reiniciada. Não há banco de dados.

Também está incluído um **frontend bem simples**, feito em HTML, CSS e JavaScript puro (sem framework), apenas para consumir a API visualmente e demonstrar o funcionamento do CRUD.

## Tecnologias

- Node.js
- NestJS
- TypeScript
- class-validator / class-transformer (validação dos dados de entrada)
- Frontend: HTML + CSS + JavaScript puro (fetch API)

## Estrutura do projeto

```
src/
  users/
    dto/
      create-user.dto.ts   # validação dos dados de entrada
    user.entity.ts         # formato do usuário
    users.controller.ts    # rotas HTTP
    users.service.ts       # regra de negócio + armazenamento em memória
    users.module.ts
  app.module.ts
  main.ts                  # bootstrap, CORS e validação global
frontend/
  index.html
  style.css
  script.js
```

## Como rodar a API

Pré-requisito: Node.js instalado.

```bash
npm install
npm run start
```

A API sobe em `http://localhost:3000`.

## Endpoints

| Método | Rota          | Descrição                          |
|--------|---------------|-------------------------------------|
| POST   | `/users`      | Cria um usuário (`nome`, `email`)   |
| GET    | `/users`      | Lista todos os usuários             |
| GET    | `/users/:id`  | Retorna um usuário específico       |
| DELETE | `/users/:id`  | Remove um usuário                   |

### Exemplo de criação (POST /users)

```json
{
  "nome": "Vinicius Franco",
  "email": "vinicius@example.com"
}
```

### Exemplos com curl

```bash
# Criar usuário
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"nome\":\"Vinicius Franco\",\"email\":\"vinicius@example.com\"}"

# Listar todos
curl http://localhost:3000/users

# Consultar um usuário
curl http://localhost:3000/users/{id}

# Excluir um usuário
curl -X DELETE http://localhost:3000/users/{id}
```

## Como rodar o frontend

O frontend é estático (não precisa de build). Com a API rodando em `http://localhost:3000`, basta abrir o arquivo `frontend/index.html` diretamente no navegador, ou servir a pasta com qualquer servidor estático, por exemplo:

```bash
npx serve frontend
```

O frontend permite cadastrar usuários, listar todos, ver um usuário específico e excluir — tudo consumindo a API via `fetch`.
