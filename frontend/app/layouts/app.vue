<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list nav>
        <v-list-item title="Dashboard" to="/app" />
        <v-list-item title="Categorias" to="/app/categories" />
        <v-list-item title="Expenses" to="/app/expenses" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Expense Tracker</v-app-bar-title>

      <v-spacer />

      <v-btn variant="text" @click="logout">Sair</v-btn>
    </v-app-bar>

    <v-main class="pa-6">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const drawer = ref(true)
const auth = useAuthStore()

function logout() {
  auth.logout()
  navigateTo('/auth/login')
}
</script>
