<template>
  <tr>
    <td :colspan="colspan" class="text-center text-medium-emphasis pa-8">
      <v-icon v-if="icon" size="40" color="#94a3b8" class="mb-2">{{ icon }}</v-icon>
      <div>{{ message }}</div>
    </td>
  </tr>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
    colspan?: number
    icon?: string
  }>(),
  {
    message: 'Nenhum resultado encontrado',
    colspan: 1,
    icon: undefined,
  },
)
</script>
