<template>
  <v-card variant="outlined" rounded="lg" class="pa-5 summary-card">
    <div class="d-flex justify-space-between align-start">
      <div>
        <div class="text-body-2 text-medium-emphasis mb-2">{{ title }}</div>
        <div class="text-h5 font-weight-bold" :class="valueClass">{{ value }}</div>
        <slot />
      </div>
      <v-icon color="#94a3b8" size="28">{{ icon }}</v-icon>
    </div>
  </v-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string,
    value: string,
    icon: string,
    valueClass?: string,
  }>(),
  { valueClass: '' },
);
</script>
