<template>
  <v-app>
    <v-navigation-drawer permanent width="260" class="app-drawer" elevation="0">
      <div class="drawer-header pa-5 pb-2">
        <div class="text-h6 font-weight-bold">ExpenseTracker</div>
        <div class="text-caption text-medium-emphasis">Gestão Financeira</div>
      </div>

      <v-list nav density="comfortable" class="px-3 mt-2">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          class="mb-1"
          active-class="active-nav-item"
        />
      </v-list>

      <template #append>
        <v-list nav density="comfortable" class="px-3 mb-2">
          <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            rounded="lg"
            class="mb-1"
            @click="logout"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main class="main-content">
      <div class="pa-8">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const navItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/app' },
  { title: 'Gastos', icon: 'mdi-cash-register', to: '/app/expenses' },
  { title: 'Categorias', icon: 'mdi-shape-outline', to: '/app/categories' },
  { title: 'Relatórios', icon: 'mdi-chart-bar', to: '/app/reports' },
  { title: 'Perfil', icon: 'mdi-account-outline', to: '/app/profile' },
]

function logout() {
  auth.logout()
  navigateTo('/auth/login')
}
</script>


