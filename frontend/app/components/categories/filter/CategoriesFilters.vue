<template>
  <v-text-field
    v-model="searchModel"
    prepend-inner-icon="mdi-magnify"
    label="Buscar categorias..."
    variant="outlined"
    density="comfortable"
    hide-details
    clearable
    class="mb-6"
    style="max-width: 400px"
  />
</template>

<script setup lang="ts">
const searchModel = defineModel<string>('search', { required: true });
</script>
