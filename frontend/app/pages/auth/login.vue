<template>
  <v-card class="pa-4">
    <v-card-title>Login</v-card-title>
    <v-card-text>Layout auth OK.</v-card-text>
    <v-card-actions>
      <v-btn to="/app" variant="tonal">Entrar (teste)</v-btn>
      <v-spacer />
      <v-btn to="/auth/register" variant="text">Cadastro</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
</script>
