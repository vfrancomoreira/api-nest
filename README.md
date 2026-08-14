# API de Cadastro de Usuários — NestJS

> Trabalho acadêmico (MBA): API REST com NestJS para cadastro de usuários (nome e e-mail), persistida em MySQL via Prisma ORM, com um frontend estático simples para consumo didático.

**Alunos:** Limber Jhonathan e Vinicius Franco

---

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Status](https://img.shields.io/badge/Status-Acadêmico-blue?style=flat-square)

---

## Sumário

- [Visão Geral](#visão-geral)
- [Objetivo do Trabalho](#objetivo-do-trabalho)
- [Arquitetura](#arquitetura)
  - [Diagrama de Componentes](#diagrama-de-componentes)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
  - [Variáveis de Ambiente (.env)](#variáveis-de-ambiente-env)
- [Como Executar](#como-executar)
  - [Rodando a API](#rodando-a-api)
  - [Rodando o Frontend](#rodando-o-frontend)
- [Endpoints da API](#endpoints-da-api)
- [Tratamento de Erros](#tratamento-de-erros)
- [Prisma — Comandos Úteis](#prisma--comandos-úteis)
- [Segurança](#segurança)
- [Padrões e Convenções](#padrões-e-convenções)
- [Troubleshooting](#troubleshooting)
- [Licença](#licença)

---

## Visão Geral

Esta API expõe um CRUD simples de usuários (`nome` e `email`), construído com **NestJS** e persistido em **MySQL** através do **Prisma ORM**. O objetivo é didático: praticar a estrutura de um projeto NestJS (módulos, controllers, services, DTOs) e a integração com um ORM, sem a complexidade de autenticação, múltiplas entidades ou integrações externas.

```
Frontend (HTML/CSS/JS) → UsersController → UsersService → PrismaService → MySQL
```

Um frontend estático (sem framework) está incluído apenas para exercitar o consumo da API via `fetch`, com os conceitos básicos de formulário, listagem, busca e exclusão.

---

## Objetivo do Trabalho

| Requisito do enunciado | Como foi atendido |
|---|---|
| Armazenar usuários (nome e e-mail) | `POST /users` — validado com `class-validator` |
| Consultar todos os usuários | `GET /users` |
| Ler apenas um usuário | `GET /users/:id` |
| Excluir um usuário | `DELETE /users/:id` |
| Persistência | Inicialmente em memória; evoluído para MySQL via Prisma ORM como exercício extra |
| Frontend simples | HTML + CSS + JavaScript puro, sem framework, em `frontend/` |

---

## Arquitetura

O projeto segue a organização padrão do NestJS por **módulos de feature**, com uma camada de infraestrutura (`PrismaModule`) compartilhada globalmente.

| Camada | Localização | Responsabilidade |
|---|---|---|
| **Entry point** | `src/main.ts` | Bootstrap da aplicação, CORS, validação global (`ValidationPipe`) |
| **Módulo raiz** | `src/app.module.ts` | Importa `PrismaModule` e `UsersModule` |
| **Infraestrutura** | `src/prisma/` | `PrismaService` (conexão com o MySQL) e `PrismaModule` (`@Global`, injetável em qualquer módulo) |
| **Feature — Users** | `src/users/` | `UsersController` (rotas HTTP), `UsersService` (regra de negócio + acesso ao banco), DTO de validação |
| **Persistência** | `prisma/schema.prisma` | Definição do model `User` e das migrations |
| **Frontend** | `frontend/` | Página estática que consome a API via `fetch` |

### Diagrama de Componentes

```mermaid
flowchart LR
    subgraph Frontend
        FE["index.html + script.js"]
    end

    subgraph NestJS
        CTRL["UsersController<br/>src/users/users.controller.ts"]
        SVC["UsersService<br/>src/users/users.service.ts"]
        DTO["CreateUserDto<br/>validação"]
        PSVC["PrismaService<br/>src/prisma/prisma.service.ts"]
    end

    subgraph Banco
        DB[("MySQL<br/>tabela users")]
    end

    FE -->|"fetch /users"| CTRL
    CTRL --> DTO
    CTRL --> SVC
    SVC --> PSVC
    PSVC -->|"Prisma Client"| DB
```

---

## Estrutura de Pastas

```
api-nest/
│
├── prisma/
│   ├── schema.prisma              # Model User + datasource MySQL
│   └── migrations/                # Histórico de migrations aplicadas
│
├── src/
│   ├── main.ts                    # Bootstrap, CORS, ValidationPipe
│   ├── app.module.ts              # Módulo raiz (importa Prisma + Users)
│   ├── prisma/
│   │   ├── prisma.service.ts      # Conexão com o MySQL (driver adapter)
│   │   └── prisma.module.ts       # Módulo global do Prisma
│   └── users/
│       ├── dto/
│       │   └── create-user.dto.ts # Validação (nome, email)
│       ├── users.controller.ts    # Rotas: POST, GET, GET /:id, DELETE /:id
│       ├── users.service.ts       # CRUD via Prisma Client
│       └── users.module.ts
│
├── frontend/                      # Frontend estático (sem framework)
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── test/                          # Testes e2e
├── generated/prisma/              # Prisma Client gerado (gitignored)
├── .env                           # Credenciais do banco (gitignored — ver .env.example)
├── .env.example
└── README.md
```

---

## Pré-requisitos

| Requisito | Notas |
|---|---|
| Node.js | 18+ |
| MySQL | Local ou via Docker |
| Docker | Opcional, mas recomendado para subir o MySQL rapidamente |

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/vfrancomoreira/api-nest.git
cd api-nest
```

### 2. Subir um MySQL local (via Docker)

```bash
docker run -d --name api-nest-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=api_nest \
  -p 3306:3306 \
  mysql:8
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar as variáveis de ambiente

```bash
cp .env.example .env
```

### 5. Aplicar as migrations (cria a tabela `users`)

```bash
npx prisma migrate dev
```

---

## Configuração

### Variáveis de Ambiente (.env)

O `.env` **nunca é commitado** — está no `.gitignore`. Use `.env.example` como referência.

```dotenv
DATABASE_URL="mysql://root:rootpass@localhost:3306/api_nest"
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | ✅ | String de conexão do MySQL no formato `mysql://usuario:senha@host:porta/banco` |

---

## Como Executar

### Rodando a API

```bash
npm run start
```

A API sobe em `http://localhost:3000`.

### Rodando o Frontend

O frontend é estático (não precisa de build). Com a API rodando, abra `frontend/index.html` diretamente no navegador, ou sirva a pasta com:

```bash
npx serve frontend
```

O frontend permite cadastrar usuários, listar todos, consultar um específico e excluir — tudo via `fetch` contra a API.

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/users` | Cria um usuário (`nome`, `email`) |
| `GET` | `/users` | Lista todos os usuários |
| `GET` | `/users/:id` | Retorna um usuário específico |
| `DELETE` | `/users/:id` | Remove um usuário |

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

---

## Tratamento de Erros

| Situação | Resposta |
|---|---|
| Corpo inválido (`nome` vazio ou `email` mal formatado) | `400 Bad Request` |
| `id` não encontrado (`GET` ou `DELETE`) | `404 Not Found` |
| E-mail já cadastrado (constraint única no banco) | `409 Conflict` |

O `UsersService` captura a violação de unicidade do Prisma (`PrismaClientKnownRequestError`, código `P2002`) e converte para `ConflictException`, evitando vazar erro interno do banco (`500`) para o cliente.

---

## Prisma — Comandos Úteis

```bash
# Criar/aplicar uma nova migration a partir de mudanças no schema.prisma
npx prisma migrate dev

# Gerar novamente o Prisma Client (após alterar o schema)
npx prisma generate

# Abrir o Prisma Studio (interface visual para ver/editar os dados)
npx prisma studio
```

---

## Segurança

| Prática | Implementação |
|---|---|
| Credenciais fora do código | `DATABASE_URL` vem do `.env`, nunca hardcoded |
| `.env` fora do controle de versão | Presente no `.gitignore`; `.env.example` documenta o formato esperado |
| Validação de entrada | `class-validator` valida `nome` e `email` antes de qualquer persistência |
| E-mail único | Constraint `@unique` no banco impede duplicidade, mesmo sob concorrência |
| CORS habilitado | Necessário para o frontend estático consumir a API a partir de outra origem |

---

## Padrões e Convenções

- Organização por **módulo de feature** (`UsersModule`), padrão recomendado pelo NestJS.
- `PrismaModule` é `@Global()` — evita reimportar `PrismaService` em cada módulo que precisar do banco.
- DTOs com `class-validator` para toda entrada da API (`whitelist: true` remove campos não esperados).
- Tipos de retorno usam o tipo `UserModel` gerado automaticamente pelo Prisma Client — sem entidade duplicada à mão.
- Regra de negócio (inclusive tratamento de erro do banco) vive no `UsersService`; o `UsersController` só expõe as rotas HTTP.

---

## Troubleshooting

### `PrismaClientInitializationError: ... driver adapter is required`

A `DATABASE_URL` não foi carregada ou o driver adapter do MySQL não está configurado. Confirme que o `.env` existe (`cp .env.example .env`) e que `@prisma/adapter-mariadb` está instalado.

### Erro de conexão com o MySQL

Confirme que o container Docker está no ar:

```bash
docker ps --filter name=api-nest-mysql
```

Se não estiver, suba novamente com o comando da seção [Instalação](#instalação).

### Mudanças no `schema.prisma` não refletem no código

Rode `npx prisma generate` para regenerar o Prisma Client, e reinicie a API.

---

## Licença

Projeto acadêmico, sem fins comerciais — desenvolvido para fins de aprendizado no MBA.
