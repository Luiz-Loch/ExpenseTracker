<template>
  <div class="d-flex justify-center align-center" :style="{ minHeight: `${minHeight}px` }">
    <v-progress-circular indeterminate color="primary" :size="size" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    minHeight?: number
    size?: number
  }>(),
  {
    minHeight: 400,
    size: 48,
  },
)
</script>
