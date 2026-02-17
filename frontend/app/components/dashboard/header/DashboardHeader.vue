<template>
  <header class="d-flex justify-space-between align-center mb-6 flex-wrap ga-4">
    <div>
      <h1 class="text-h4 font-weight-bold">Dashboard</h1>
      <p class="text-body-2 text-medium-emphasis mt-1">
        Visão geral dos seus gastos mensais
      </p>
    </div>

    <v-btn
      color="primary"
      prepend-icon="mdi-plus"
      size="large"
      to="/app/expenses"
      aria-label="Adicionar gasto"
    >
      Adicionar gasto
    </v-btn>
  </header>
</template>
