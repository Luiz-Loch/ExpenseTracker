# ExpenseTracker — Frontend

Interface web para gerenciamento de finanças pessoais, construída com **Nuxt 4** e **Vuetify**.

## Propósito

O frontend oferece a experiência visual do ExpenseTracker, permitindo que o usuário registre e acompanhe suas despesas, organize-as em categorias e visualize relatórios com gráficos interativos — tudo através de uma interface moderna e responsiva.

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

## Scripts úteis

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento (porta 4000)
npm run dev

# Build de produção
npm run build

# Pré-visualizar build
npm run preview
```
