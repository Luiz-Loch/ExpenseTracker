# ExpenseTracker — Backend

API REST para gerenciamento de finanças pessoais, construída com **NestJS**. Responsável por autenticação, gerenciamento de despesas e categorias, relatórios financeiros, e documentação interativa via Swagger.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| [TypeScript](https://www.typescriptlang.org/) | Linguagem de programação |
| [NestJS](https://nestjs.com/) | Framework principal da API |
| [TypeORM](https://typeorm.io/) | ORM e migrações de banco de dados |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional |
| [Redis](https://redis.io/) | Cache com invalidação por mutação |
| [Passport + JWT](https://www.passportjs.org/) | Autenticação e autorização |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Hash de senhas |
| [Swagger / OpenAPI](https://swagger.io/) | Documentação interativa da API |
| [class-validator](https://github.com/typestack/class-validator) + [class-transformer](https://github.com/typestack/class-transformer) | Validação e transformação de DTOs |
| [Terminus](https://docs.nestjs.com/recipes/terminus) | Health check |

## Arquitetura

### Estrutura de pastas

```
src/
├── auth/                   # Autenticação (login, registro, JWT strategy, guards)
├── category/               # CRUD de categorias
├── expense/                # CRUD de despesas
├── user/                   # Gerenciamento de usuários
├── report/                 # Relatórios financeiros
├── health/                 # Health check
├── common/                 # Decorators, DTOs e utilitários compartilhados
├── configuration/          # Configuração do banco de dados
├── database/               # Data source e migrações
├── app.module.ts
└── main.ts
```

Cada módulo de domínio (`category`, `expense`, `user`) segue a mesma organização interna:

```
module/
├── dto/                    # Data Transfer Objects (request/response)
├── entities/               # Entidade TypeORM
├── validations/            # Validators de regras de negócio
│   ├── tokens.ts           # Tokens de injeção de dependência
│   ├── create/             # Validators para criação
│   └── update/             # Validators para atualização
├── module.controller.ts
├── module.service.ts
└── module.module.ts
```

### Design Patterns — Strategy + Chain of Responsibility

As validações de regras de negócio seguem uma combinação de **Strategy** e **Chain of Responsibility**, separadas da validação de DTOs.

O fluxo funciona assim:

1. Uma **interface** define o contrato do validator (Strategy):

```typescript
export interface CategoryCreateValidator {
  validate(userId: string, dto: CategoryCreateDto): Promise<void> | void;
}
```

2. **Implementações concretas** contêm uma única regra cada:

| Domínio | Validator | Regra |
|---|---|---|
| Category | `NameUniqueValidator` | Nome da categoria é único por usuário |
| Category | `NameUniqueOnUpdateValidator` | Nome não conflita ao atualizar |
| Expense | `CategoryExistsOnCreateValidator` | Categoria referenciada existe |
| Expense | `CategoryExistsOnUpdateValidator` | Categoria referenciada existe ao atualizar |
| User | `EmailUniqueValidator` | E-mail é único no sistema |
| User | `EmailUniqueOnUpdateValidator` | E-mail não conflita ao atualizar |

3. Os validators são registrados como **array via DI tokens** e iterados sequencialmente no service (Chain):

```typescript
for (const validator of this.createValidators) {
  await validator.validate(userId, dto);
}
```

Cada validator pode lançar uma exceção (`ConflictException`, `NotFoundException`) para interromper a cadeia. Para adicionar uma nova regra, basta criar uma classe que implemente a interface e registrá-la no array do módulo — sem alterar código existente (Open/Closed Principle).

### Validação em duas camadas

| Camada | Responsabilidade | Mecanismo |
|---|---|---|
| **DTO** | Formato e tipo dos dados (string, e-mail, tamanho, campos obrigatórios) | `class-validator` + `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`) |
| **Regras de negócio** | Unicidade, existência de referências, regras de domínio | Validators com Strategy + Chain of Responsibility |

### Cache

O cache é feito com **Redis** via `cache-manager`. Operações de leitura individual (`findOne`, `findMe`) são cacheadas, e mutações (`PATCH`, `DELETE`) invalidam o cache correspondente via `cache.del(key)`. As chaves seguem o padrão `{entidade}:{userId}:{entityId}`.

### Armazenamento monetário

Valores monetários são armazenados como **inteiros em minor units** (centavos) no banco, evitando problemas de precisão com ponto flutuante. A classe `CurrencyConfig` centraliza a conversão entre major e minor units, com suporte a diferentes quantidades de casas decimais por moeda.

### Soft Delete

Todas as entidades usam `@DeleteDateColumn` do TypeORM. Registros nunca são removidos fisicamente do banco — um `DELETE` apenas preenche o campo `deletedAt`.

### CORS

O CORS é configurado para aceitar apenas requisições da origem definida em `FRONTEND_ENDPOINT` (e requisições sem origin, como Postman/curl). Métodos permitidos: `GET`, `POST`, `PATCH`, `DELETE`.

## Rotas

A documentação Swagger fica acessível em `/docs`.

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
| `GET` | `/categories` | Listar categorias (paginado) |
| `GET` | `/categories/:id` | Buscar categoria por ID |
| `PATCH` | `/categories/:id` | Atualizar categoria |
| `DELETE` | `/categories/:id` | Excluir categoria |

### Expenses (`/expenses`) 🔒

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/expenses` | Criar despesa |
| `GET` | `/expenses` | Listar despesas (paginado) |
| `GET` | `/expenses/:id` | Buscar despesa por ID |
| `PATCH` | `/expenses/:id` | Atualizar despesa |
| `DELETE` | `/expenses/:id` | Excluir despesa |

### Reports (`/reports`) 🔒

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/reports/summary` | Resumo financeiro (total, balanço) |
| `GET` | `/reports/monthly` | Relatório mensal |
| `GET` | `/reports/by-category` | Relatório por categoria |

### Health (`/health`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verificar saúde da aplicação e do banco |

> 🔒 Rotas protegidas requerem o header `Authorization: Bearer <token>`.
>
> Endpoints de listagem suportam paginação via query params `page` (default: 1) e `limit` (default: 10, max: 100), retornando `data`, `total`, `page`, `limit` e `totalPages`.

## Variáveis de ambiente

Configuradas via `.env`. Veja `.env.example` para referência.

| Variável | Descrição | Exemplo |
|---|---|---|
| `PG_USERNAME` | Usuário do PostgreSQL | `root` |
| `PG_PASSWORD` | Senha do PostgreSQL | `change_me` |
| `PG_DATABASE` | Nome do banco | `expense-tracker` |
| `PG_HOST` | Host do PostgreSQL | `127.0.0.1` |
| `PG_PORT` | Porta do PostgreSQL | `5432` |
| `REDIS_HOST` | Host do Redis | `127.0.0.1` |
| `REDIS_PORT` | Porta do Redis | `6379` |
| `PORT` | Porta da aplicação | `8080` |
| `FRONTEND_ENDPOINT` | Origem permitida pelo CORS | `http://localhost` |
| `JWT_SECRET_KEY` | Chave para assinatura dos tokens JWT | — |
| `HASH_SALT_ROUNDS` | Rounds do bcrypt para hash de senhas | `10` |

## Docker

O `Dockerfile` usa um **multi-stage build** com duas etapas:

| Estágio | Base | O que faz |
|---|---|---|
| **builder** | `node:20-alpine` | Instala todas as dependências (`npm ci`) e compila o TypeScript (`npm run build`) |
| **production** | `node:20-alpine` | Instala apenas dependências de produção (`npm ci --omit=dev`) e copia o `dist/` compilado |

Ao iniciar, o container executa as migrações automaticamente antes de subir a aplicação:

```bash
npx typeorm migration:run -d dist/database/data-source.js && node dist/main.js
```

### Migrações

O projeto usa migrações manuais do TypeORM (sem `synchronize`). A última migração inclui um seed de dados iniciais. O fluxo de migrações é gerenciado pelos scripts:

| Script | Descrição |
|---|---|
| `migration:generate` | Gera uma migração a partir das diferenças entre as entidades e o banco |
| `migration:run` | Executa as migrações pendentes |
| `migration:revert` | Reverte a última migração executada |
