<template>
  <div>
    <ProfileHeader />

    <AppLoading v-if="loading" />

    <template v-else-if="user">
      <ProfileUserInfo
        :user="user"
        @saved="onUserSaved"
      />

      <ProfileChangePassword
        @saved="onPasswordChanged"
      />

      <ProfileDangerZone
        @error="onError"
      />
    </template>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.open" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserResponse } from '~/types/user'
import AppLoading from '~/components/common/AppLoading.vue'
import ProfileHeader from '~/components/profile/header/ProfileHeader.vue'
import ProfileUserInfo from '~/components/profile/user-info/ProfileUserInfo.vue'
import ProfileChangePassword from '~/components/profile/change-password/ProfileChangePassword.vue'
import ProfileDangerZone from '~/components/profile/danger-zone/ProfileDangerZone.vue'

definePageMeta({ layout: 'app' });

const userService = useUserService();
const { snackbar, showSnackbar, SnackbarColor } = useSnackbar();

// ─── State ───────────────────────────────────────────
const loading = ref<boolean>(true);
const user = ref<UserResponse | null>(null);

// ─── API ─────────────────────────────────────────────
async function fetchUser(): Promise<void> {
  loading.value = true;
  try {
    const res = await userService.getMe();
    user.value = res.data;
  } catch (e) {
    console.error('Erro ao carregar perfil:', e);
    showSnackbar('Erro ao carregar perfil', SnackbarColor.ERROR);
  } finally {
    loading.value = false;
  }
}

// ─── Event Handlers ──────────────────────────────────
function onUserSaved(updatedUser: UserResponse): void {
  user.value = updatedUser;
  showSnackbar('Nome atualizado com sucesso');
}

function onPasswordChanged(): void {
  showSnackbar('Senha alterada com sucesso');
}

function onError(message: string): void {
  showSnackbar(message, SnackbarColor.ERROR);
}

// ─── Init ────────────────────────────────────────────
onMounted(fetchUser);
</script>
