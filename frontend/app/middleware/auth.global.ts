import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  const isAppRoute: boolean = to.path.startsWith('/app')
  if (!isAppRoute) {
    return;
  }

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login');
  }
});
