<template>
  <v-card variant="outlined" rounded="lg" class="app-card border-error">
    <v-card-title class="pa-5 pb-3">
      <span class="text-h6 font-weight-bold text-error">Zona de perigo</span>
    </v-card-title>

    <v-card-text class="pa-5 pt-2">
      <div class="d-flex align-center justify-space-between">
        <div>
          <p class="text-body-1 font-weight-medium">Excluir conta</p>
          <p class="text-body-2 text-medium-emphasis">
            Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
          </p>
        </div>
        <v-btn
          color="error"
          variant="outlined"
          class="ml-4"
          @click="deleteDialog = true"
        >
          Excluir conta
        </v-btn>
      </div>
    </v-card-text>
  </v-card>

  <!-- Delete Account Dialog -->
  <ProfileDeleteDialog
    v-model="deleteDialog"
    @confirmed="onDeleteConfirmed"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileDeleteDialog from '~/components/profile/dialog/ProfileDeleteDialog.vue'
import { useAuthStore } from '~/stores/auth'

const emit = defineEmits<{
  error: [message: string]
}>();

const api = useApi();
const auth = useAuthStore();

const deleteDialog = ref<boolean>(false);

async function onDeleteConfirmed(): Promise<void> {
  try {
    await api.delete('/users/me');
    auth.logout();
    await navigateTo('/auth/login');
  } catch (e: any) {
    console.error('Erro ao excluir conta:', e);
    emit('error', 'Erro ao excluir conta');
  }
}
</script>
