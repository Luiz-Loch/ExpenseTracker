import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  const isAuthRoute: boolean = to.path.startsWith('/auth')
  if (!isAuthRoute) {
    return;
  }

  if (auth.isAuthenticated) {
    return navigateTo('/app');
  }
});
