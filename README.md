# API de Cadastro de Usuários — NestJS

Trabalho acadêmico (MBA).

**Alunos:** Limber Jhonathan e Vinicius Franco

## Descrição

API REST feita com Node.js + NestJS que permite:

- Cadastrar um usuário (nome e e-mail)
- Listar todos os usuários
- Consultar um usuário específico pelo id
- Excluir um usuário

Os dados são persistidos em um banco **MySQL**, acessado através do **Prisma ORM**. A versão inicial deste trabalho usava apenas um array em memória (sem banco de dados); a camada de persistência com Prisma foi adicionada depois, como exercício extra para aprender a integração entre NestJS e um ORM.

Também está incluído um **frontend bem simples**, feito em HTML, CSS e JavaScript puro (sem framework), apenas para consumir a API visualmente e demonstrar o funcionamento do CRUD.

## Tecnologias

- Node.js
- NestJS
- TypeScript
- Prisma ORM + MySQL
- class-validator / class-transformer (validação dos dados de entrada)
- Frontend: HTML + CSS + JavaScript puro (fetch API)

## Estrutura do projeto

```
prisma/
  schema.prisma           # definição do model User e do datasource MySQL
  migrations/              # histórico de migrations do banco
src/
  prisma/
    prisma.service.ts      # cliente Prisma (conexão com o MySQL via driver adapter)
    prisma.module.ts       # módulo global, injeta o PrismaService em toda a aplicação
  users/
    dto/
      create-user.dto.ts   # validação dos dados de entrada
    users.controller.ts    # rotas HTTP
    users.service.ts       # regra de negócio + acesso ao banco via Prisma
    users.module.ts
  app.module.ts
  main.ts                  # bootstrap, CORS e validação global
frontend/
  index.html
  style.css
  script.js
```

## Pré-requisitos

- Node.js
- Um banco MySQL acessível (local ou via Docker)

### Subindo um MySQL local com Docker (mais simples)

```bash
docker run -d --name api-nest-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=api_nest \
  -p 3306:3306 \
  mysql:8
```

## Configuração

1. Copie `.env.example` para `.env` e ajuste a `DATABASE_URL` se necessário:

```bash
cp .env.example .env
```

```
DATABASE_URL="mysql://root:rootpass@localhost:3306/api_nest"
```

2. Instale as dependências e aplique as migrations (cria a tabela `users` no banco):

```bash
npm install
npx prisma migrate dev
```

## Como rodar a API

```bash
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

## Prisma — comandos úteis

```bash
# Aplicar/criar uma nova migration a partir de mudanças no schema.prisma
npx prisma migrate dev

# Gerar novamente o Prisma Client (após alterar o schema)
npx prisma generate

# Abrir o Prisma Studio (interface visual para ver/editar os dados)
npx prisma studio
```
