<template>
  <v-dialog v-model="dialog" :max-width="maxWidth" :persistent="persistent">
    <v-card variant="elevated">
      <v-card-title class="d-flex justify-space-between align-center pa-5 pb-3">
        <span class="text-h6 font-weight-bold">{{ title }}</span>
        <v-btn icon variant="text" size="small" @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-5 pt-2">
        <slot />
      </v-card-text>

      <v-card-actions v-if="$slots.actions" class="pa-5 pt-0">
        <v-spacer />
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string,
    maxWidth?: number,
    persistent?: boolean,
  }>(),
  {
    maxWidth: 560,
    persistent: false,
  },
);

const dialog = defineModel<boolean>({ required: true });
</script>
