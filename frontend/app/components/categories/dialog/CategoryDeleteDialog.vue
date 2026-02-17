<template>
  <AppDialog
    v-model="dialog"
    title="Excluir categoria"
    :max-width="440"
  >
    <p>
      Tem certeza que deseja excluir <strong>{{ category?.name }}</strong>?
    </p>
    <p class="text-body-2 text-medium-emphasis mt-1">
      Transações associadas a esta categoria ficarão sem categoria. Esta ação não pode ser desfeita.
    </p>

    <template #actions>
      <v-btn variant="outlined" @click="dialog = false">Cancelar</v-btn>
      <v-btn color="error" variant="flat" @click="emit('confirmed')">Excluir</v-btn>
    </template>
  </AppDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CategoryResponse } from '~/types/category'
import AppDialog from '~/components/common/AppDialog.vue'

const props = defineProps<{
  modelValue: boolean,
  category: CategoryResponse | null,
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean],
  confirmed: [],
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});
</script>
