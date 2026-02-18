# ExpenseTracker — Backend

API REST para gerenciamento de finanças pessoais, construída com **NestJS**.

## Propósito

O backend é responsável por toda a lógica de negócio do ExpenseTracker: autenticação de usuários, gerenciamento de despesas e categorias, e geração de relatórios financeiros. Ele expõe uma API RESTful consumida pelo frontend e conta com documentação interativa via Swagger.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| [NestJS](https://nestjs.com/) | Framework principal da API |
| [TypeORM](https://typeorm.io/) | ORM e migrações de banco de dados |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional |
| [Passport + JWT](https://www.passportjs.org/) | Autenticação e autorização |
| [Swagger / OpenAPI](https://swagger.io/) | Documentação interativa da API |
| [class-validator](https://github.com/typestack/class-validator) | Validação de DTOs |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Hash de senhas |
| [TypeScript](https://www.typescriptlang.org/) | Linguagem de programação |

## Rotas

A API roda na porta `3000` por padrão. A documentação Swagger fica acessível em `/docs`.

### Auth (`/auth`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Autenticar usuário e obter token JWT |
| `POST` | `/auth/register` | Registrar novo usuário e obter token JWT |

### Users (`/users`) 🔒

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/users/me` | Obter perfil do usuário autenticado |
| `PATCH` | `/users/me` | Atualizar dados do perfil |
| `PATCH` | `/users/me/password` | Alterar senha |
| `DELETE` | `/users/me` | Excluir conta |

### Categories (`/categories`) 🔒

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/categories` | Criar categoria |
| `GET` | `/categories` | Listar todas as categorias |
| `GET` | `/categories/:id` | Buscar categoria por ID |
| `PATCH` | `/categories/:id` | Atualizar categoria |
| `DELETE` | `/categories/:id` | Excluir categoria |

### Expenses (`/expenses`) 🔒

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/expenses` | Criar despesa |
| `GET` | `/expenses` | Listar todas as despesas |
| `GET` | `/expenses/:id` | Buscar despesa por ID |
| `PATCH` | `/expenses/:id` | Atualizar despesa |
| `DELETE` | `/expenses/:id` | Excluir despesa |

### Reports (`/reports`) 🔒

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/reports/summary` | Resumo financeiro (total, balanço, etc.) |
| `GET` | `/reports/monthly` | Relatório mensal |
| `GET` | `/reports/by-category` | Relatório por categoria |

### Health (`/health`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verificar saúde da aplicação e do banco |

> 🔒 Rotas protegidas requerem o header `Authorization: Bearer <token>`.

## Scripts úteis

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run start:dev

# Build de produção
npm run build

# Gerar migração
npm run migration:generate

# Executar migrações
npm run migration:run

# Reverter última migração
npm run migration:revert
```
