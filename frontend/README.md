# ExpenseTracker — Frontend

Interface web para gerenciamento de finanças pessoais, construída com **Nuxt 4** e **Vuetify**.
Responsável pela experiência visual, autenticação do lado do cliente, e consumo da API REST.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| [Nuxt 4](https://nuxt.com/) | Framework Vue com SSR e file-based routing |
| [Vue 3](https://vuejs.org/) | Biblioteca reativa de UI |
| [Vuetify 3](https://vuetifyjs.com/) | Biblioteca de componentes Material Design |
| [Pinia](https://pinia.vuejs.org/) | Gerenciamento de estado |
| [Axios](https://axios-http.com/) | Cliente HTTP para consumir a API |
| [Chart.js](https://www.chartjs.org/) + [vue-chartjs](https://vue-chartjs.org/) | Gráficos interativos |
| [TypeScript](https://www.typescriptlang.org/) | Linguagem de programação |
| [Material Design Icons](https://pictogrammers.com/library/mdi/) | Ícones |

## Arquitetura

### Estrutura de pastas

```
app/
├── pages/                   # Rotas (file-based routing do Nuxt)
│   ├── auth/                # Páginas de autenticação (login, register)
│   └── app/                 # Páginas da aplicação (logadas)
├── components/              # Componentes reutilizáveis
│   ├── common/              # Componentes genéricos
│   ├── dashboard/           # Componentes do dashboard
│   ├── expenses/            # Componentes de despesas
│   ├── categories/          # Componentes de categorias
│   └── profile/             # Componentes de perfil
├── composables/             # Lógica reutilizável
│   └── services/            # Serviços HTTP (abstração da API)
├── stores/                  # State management com Pinia
├── layouts/                 # Layouts reutilizáveis
├── middleware/              # Middlewares de rota (proteção, redirecionamentos)
├── plugins/                 # Plugins do Nuxt
├── types/                   # Tipos TypeScript compartilhados
└── public/                  # Arquivos estáticos
```

### State Management

O projeto utiliza **Pinia** para gerenciar estado global de autenticação e dados da aplicação.
Cada módulo Pinia encapsula a lógica de estado relacionada.

### Services (Composables)

Os serviços encapsulam chamadas HTTP para a API e são utilizados nos componentes via composables.
Cada serviço corresponde a um domínio da aplicação.

| Serviço | Endpoints |
|---|---|
| `useAuthService()` | Login, Registro |
| `useUserService()` | Obter/atualizar perfil, alterar senha, deletar conta |
| `useExpenseService()` | CRUD de despesas |
| `useCategoryService()` | CRUD de categorias |
| `useReportService()` | Relatórios (summary, mensal, por categoria) |

## Telas

### Autenticação

| Rota | Tela | Descrição |
|---|---|---|
| `/auth/login` | Login | Formulário de autenticação com e-mail e senha |
| `/auth/register` | Registro | Cadastro de novo usuário |

### Aplicação (área logada)

| Rota | Tela | Descrição |
|---|---|---|
| `/app` | Dashboard | Painel principal com resumo financeiro, gráficos mensais/por categoria e últimas despesas |
| `/app/expenses` | Despesas | Listagem, criação, edição e exclusão de despesas com cards de resumo e filtros |
| `/app/categories` | Categorias | Listagem, criação, edição e exclusão de categorias com filtro |
| `/app/profile` | Perfil | Visualização e edição de dados do usuário, alteração de senha e exclusão de conta |

### Componentes principais

- **Dashboard** — _Cards_ de resumo com comparativo ao mês anterior, gráficos e tabela com as 5 últimas despesas.
- **Expenses** — Tabela paginada com filtros, cards de resumo (contagem, receita, despesa, balanço), _dialogs_ para criar/editar/excluir.
- **Categories** — Tabela com filtro por nome/cor, _dialogs_ para criar/editar/excluir.
- **Profile** — Dados do usuário, formulário de alteração de senha, zona de perigo para exclusão de conta.

## Variáveis de ambiente

Configuradas via `.env`. Veja `.env.example` para referência.

| Variável | Descrição | Exemplo |
|---|---|---|
| `NUXT_PUBLIC_API_BASE_URL` | URL base da API | `http://localhost:8080` |

## Padrões e Convenções

### Estrutura de Componentes

Componentes são organizados por **domínio** (_feature_), não por tipo.
Dentro de cada domínio (ex: `expenses/`), subpastas são usadas para organizar por responsabilidade:

```
components/expenses/
├── ExpenseDialog.vue        # Dialog para criar/editar
├── ExpenseTable.vue         # Tabela principal
├── dialog/                  # Componentes internos do dialog
├── table/                   # Componentes internos da tabela
├── filter/                  # Componentes de filtro
├── header/                  # Componentes de header/toolbar
└── summary/                 # Componentes de resumo/cards
```

## Autenticação e Armazenamento de Tokens

### Fluxo

1. **Login/Registro** — O endpoint da API retorna um token JWT (`accessToken`)
2. **Armazenamento** — O token é armazenado em **dois lugares**:
   - **localStorage** — Persistência entre sessions
   - **Pinia store** — Estado reativo da aplicação (seção `useAuthStore`)
3. **Injeção automática** — Um interceptor global do Axios adiciona o token em todo request: `Authorization: Bearer <token>`
4. **Invalidação** — Respostas 401 logout automaticamente e redirecionam para `/auth/login`

### Recuperação ao Recarregar

O _middleware_ global `route-guard.global.ts` chama `auth.loadTokenFromStorage()` em toda navegação, restaurando o token do localStorage para Pinia.

## Middlewares

O projeto usa um middleware global para proteger rotas:

### `route-guard.global.ts`

Executado em **toda navegação** de rota.
Responsável por:

1. **Recuperar token** — Carrega o token do localStorage para Pinia
2. **Proteger rotas privadas** — Se não autenticado, redireciona para `/auth/login`
3. **Proteger rotas públicas** — Se autenticado, redireciona para `/app` (evita relocar em login depois de logado)

| Rota | Requer Auth? | Comportamento |
|---|---|---|
| `/auth/login`, `/auth/register` | ❌ | Públicas; se autenticado, redireciona para `/app` |
| `/app/*` | ✅ | Privadas; se não autenticado, redireciona para `/auth/login` |

## Docker

O `Dockerfile` usa um **multi-stage build**:

| Estágio | Base | Responsabilidade |
|---|---|---|
| **builder** | `node:20-alpine` | Instala dependências (`npm ci`) e compila com Nuxt (`npm run build`) |
| **production** | `node:20-alpine` | Copia apenas o build compilado (`.output`) e executa o servidor |
