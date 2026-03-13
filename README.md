# ExpenseTracker

Aplicação full-stack para gerenciamento de finanças pessoais.
Permite registrar despesas e receitas, organizá-las em categorias e acompanhar a saúde financeira através de relatórios e gráficos.

## Tech Stack

| Camada | Tecnologias |
|---|---|
| **Frontend** | [Nuxt 4](https://nuxt.com/), [Vue 3](https://vuejs.org/), [Vuetify 3](https://vuetifyjs.com/), [Pinia](https://pinia.vuejs.org/), [Chart.js](https://www.chartjs.org/) |
| **Backend** | [NestJS 11](https://nestjs.com/), [TypeORM](https://typeorm.io/), [Passport JWT](https://www.passportjs.org/), [Swagger](https://swagger.io/) |
| **Banco de dados** | [PostgreSQL 18](https://www.postgresql.org/) |
| **Cache** | [Redis 7](https://redis.io/) |
| **Infraestrutura** | [Terraform](https://www.terraform.io/), [Docker](https://www.docker.com/) |
| **Cloud** | AWS (ECS Fargate, RDS, ElastiCache, ALB, Route 53, ECR, ACM, SSM) |

## Arquitetura

```
┌──────────┐       ┌──────────┐       ┌────────────┐
│ Frontend │──────▶│ Backend  │──────▶│ PostgreSQL │
│ Nuxt 4   │       │ NestJS   │       └────────────┘
└──────────┘       │          │       ┌────────────┐
                   │          │──────▶│   Redis    │
                   └──────────┘       └────────────┘
```

O Frontend consome a API REST do Backend, que persiste dados no PostgreSQL e utiliza Redis como cache.
As migrações do banco são executadas automaticamente ao iniciar o container do Backend.

## Estrutura do repositório

```
ExpenseTracker/
├── compose.yml              # Orquestração dos serviços via Docker Compose
├── .env.example             # Modelo de variáveis de ambiente
├── backend/                 # API REST — NestJS + TypeORM + PostgreSQL + Redis
│   └── README.md            # Documentação detalhada do backend
├── frontend/                # Interface web — Nuxt 4 + Vuetify + Pinia
│   └── README.md            # Documentação detalhada do frontend
└── infrastructure/          # Infraestrutura AWS provisionada com Terraform
    └── README.md            # Documentação detalhada da infraestrutura
```

Consulte o README de cada subprojeto para detalhes sobre rotas, telas, módulos e decisões arquiteturais:

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)
- [Infraestrutura](./infrastructure/README.md)

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no modelo disponível em [`.env.example`](./.env.example):

```bash
cp .env.example .env
```

Edite o `.env` com os valores desejados.
Abaixo a descrição de cada variável:

### Backend

| Variável | Descrição | Valor padrão |
|---|---|---|
| `PG_USERNAME` | Usuário do PostgreSQL | `root` |
| `PG_PASSWORD` | Senha do PostgreSQL | `change_me` |
| `PG_DATABASE` | Nome do banco de dados | `expense-tracker` |
| `PG_PORT` | Porta do PostgreSQL | `5432` |
| `PG_HOST` | Host do PostgreSQL (nome do serviço no Docker Compose) | `postgres` |
| `REDIS_HOST` | Host do Redis (nome do serviço no Docker Compose) | `redis` |
| `REDIS_PORT` | Porta do Redis | `6379` |
| `PORT` | Porta interna da API | `8080` |
| `FRONTEND_ENDPOINT` | Origem permitida pelo CORS | `http://localhost` |
| `JWT_SECRET_KEY` | Chave secreta para assinar tokens JWT | `change_me` |
| `HASH_SALT_ROUNDS` | Rounds do bcrypt para hash de senhas | `10` |

### Frontend

| Variável | Descrição | Valor padrão |
|---|---|---|
| `BACKEND_ENDPOINT` | URL base da API consumida pelo frontend | `http://localhost:8080` |

### Docker Compose

| Variável | Descrição | Valor padrão |
|---|---|---|
| `COMPOSE_BACKEND_PORT` | Porta exposta do backend no host | `8080` |
| `COMPOSE_FRONTEND_PORT` | Porta exposta do frontend no host | `80` |

> **Importante:** altere `PG_PASSWORD` e `JWT_SECRET_KEY` antes de usar em qualquer ambiente.

## Execução local com Docker

### Subir o projeto

```bash
docker compose up --build -d
```

Após a inicialização:

| Serviço | URL |
|---|---|
| **Frontend** | `http://localhost:<COMPOSE_FRONTEND_PORT>` |
| **API** | `http://localhost:<COMPOSE_BACKEND_PORT>` |
| **Swagger (docs da API)** | `http://localhost:<COMPOSE_BACKEND_PORT>/docs` |

### Parar o projeto

```bash
# Parar e remover containers e networks
docker compose down

# Parar e remover containers, networks e volumes (apaga dados do banco e cache)
docker compose down -v
```

## Documentação da API

O backend disponibiliza uma interface Swagger com a documentação interativa de todos os endpoints.
Com o projeto rodando, acesse:

```
http://localhost:<COMPOSE_BACKEND_PORT>/docs
```

## Acesso via AWS

Quando a infraestrutura estiver provisionada na AWS, a aplicação é acessível pelos seguintes endereços:

| Serviço | URL |
|---|---|
| **Frontend** | `https://expense-tracker.link` |
| **API** | `https://api.expense-tracker.link` |
| **Swagger (docs da API)** | `https://api.expense-tracker.link/docs` |

O tráfego é roteado por um Application Load Balancer com HTTPS obrigatório (TLS 1.3) e certificado gerenciado pelo ACM.
Consulte o [README da infraestrutura](./infrastructure/README.md) para detalhes sobre a arquitetura AWS, rede e segurança.
