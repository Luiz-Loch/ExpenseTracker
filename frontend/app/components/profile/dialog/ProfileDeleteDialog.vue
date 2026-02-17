<template>
  <AppDialog
    v-model="dialog"
    title="Excluir conta"
    :max-width="440"
  >
    <p>
      Tem certeza que deseja excluir sua conta?
    </p>
    <p class="text-body-2 text-medium-emphasis mt-1">
      Todos os seus dados, incluindo gastos e categorias, serão permanentemente removidos. Esta ação não pode ser desfeita.
    </p>

    <v-text-field
      v-model="confirmation"
      :label="`Digite ${requiredWord} para confirmar`"
      variant="outlined"
      density="comfortable"
      class="mt-4"
    />

    <template #actions>
      <v-btn variant="outlined" @click="dialog = false">Cancelar</v-btn>
      <v-btn
        color="error"
        variant="flat"
        :disabled="!canConfirm"
        :loading="deleting"
        @click="confirm"
      >
        Excluir minha conta
      </v-btn>
    </template>
  </AppDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppDialog from '~/components/common/AppDialog.vue'

const requiredWord = 'EXCLUIR';

const normalized = computed(() =>
  confirmation.value.trim().toUpperCase()
)

const canConfirm = computed(() =>
  normalized.value === requiredWord && !deleting.value
)

const props = defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirmed: []
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const confirmation = ref<string>('');
const deleting = ref<boolean>(false);

// Reset confirmation when dialog opens/closes
watch(dialog, (open) => {
  if (!open) {
    confirmation.value = '';
  }
});

async function confirm(): Promise<void> {
  deleting.value = true;
  try {
    emit('confirmed');
  } finally {
    deleting.value = false;
  }
}
</script>
