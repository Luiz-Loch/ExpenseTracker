<template>
  <header class="d-flex justify-space-between align-center mb-6 flex-wrap ga-4">
    <div>
      <h1 class="text-h4 font-weight-bold">Categorias</h1>
      <p class="text-body-2 text-medium-emphasis mt-1">
        Gerencie suas categorias de transações
      </p>
    </div>

    <v-btn
      color="primary"
      prepend-icon="mdi-plus"
      size="large"
      type="button"
      @click="onCreate"
      aria-label="Criar nova categoria"
    >
      Nova categoria
    </v-btn>
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'create'): void,
}>();

function onCreate() {
  emit('create');
}
</script>
