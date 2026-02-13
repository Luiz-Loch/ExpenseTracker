<template>
  <v-card class="pa-4">
    <v-card-title>Cadastro</v-card-title>
    <v-card-text>Layout auth OK.</v-card-text>
    <v-card-actions>
      <v-btn to="/auth/login" variant="text">Voltar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
</script>
