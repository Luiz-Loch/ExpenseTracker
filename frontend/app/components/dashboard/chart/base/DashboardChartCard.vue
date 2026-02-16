<template>
  <v-card variant="outlined" rounded="lg" class="pa-5 chart-card">
    <div class="text-subtitle-1 font-weight-bold mb-4">{{ title }}</div>
    <div v-if="hasData" :style="{ height: `${height}px` }">
      <slot />
    </div>
    <div v-else class="d-flex justify-center align-center" :style="{ height: `${height}px` }">
      <span class="text-medium-emphasis">{{ emptyText }}</span>
    </div>
  </v-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    hasData: boolean
    height?: number
    emptyText?: string
  }>(),
  {
    height: 320,
    emptyText: 'Sem dados para exibir',
  },
)
</script>
