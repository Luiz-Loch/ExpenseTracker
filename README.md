# ExpenseTracker

Aplicação full-stack para gerenciamento de finanças pessoais. Permite registrar despesas e receitas, organizá-las em categorias e acompanhar a saúde financeira através de relatórios e gráficos.

## Como funciona

O projeto é composto por três serviços orquestrados via Docker Compose:

| Serviço | Descrição | Porta padrão |
|---|---|---|
| **PostgreSQL** | Banco de dados relacional | Definida por `PG_PORT` |
| **Backend** | API REST em NestJS (autenticação, CRUD, relatórios) | Definida por `COMPOSE_BACKEND_PORT` |
| **Frontend** | Interface web em Nuxt 4 + Vuetify | Definida por `COMPOSE_FRONTEND_PORT` |

O fluxo é: **Frontend → Backend → PostgreSQL**. As migrações do banco são executadas automaticamente ao iniciar o container do backend.

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no modelo disponível em `.env.example`.

## Subir o projeto com Docker

```bash
# Buildar e subir todos os serviços
docker compose up --build -d
```

Após a inicialização:
- **Frontend** estará acessível em `http://localhost:<COMPOSE_FRONTEND_PORT>`
- **API** estará acessível em `http://localhost:<COMPOSE_BACKEND_PORT>`
- **Swagger (docs da API)** em `http://localhost:<COMPOSE_BACKEND_PORT>/docs`

## Destruir o projeto com Docker

```bash
# Parar e remover containers, networks
docker compose down

# Parar, remover containers e também os volumes (apaga os dados do banco)
docker compose down -v

# Parar, remover containers, os volumes (apaga os dados do banco) e as imagens utilizadas pelos serviços
docker compose down --rmi all
```

## Estrutura do projeto

```
ExpenseTracker/
├── compose.yml          # Orquestração dos serviços
├── .env                 # Variáveis de ambiente (não versionado)
├── backend/             # API REST — NestJS + TypeORM + PostgreSQL
│   └── README.md
└── frontend/            # Interface web — Nuxt 4 + Vuetify + Pinia
    └── README.md
```

Consulte o README de cada subprojeto para detalhes sobre rotas, telas e tecnologias.
