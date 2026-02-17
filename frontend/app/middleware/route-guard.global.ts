import { useAuthStore } from '../stores/auth'

const guestRoutes: Array<string> = ['/auth/login', '/auth/register'];
const authRoutes: Array<string> = ['/app', '/app/categories', '/app/expenses', '/app/profile'];

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  auth.loadTokenFromStorage();

  if (auth.isAuthenticated) {
    if (!authRoutes.includes(to.path)) {
      return navigateTo('/app');
    }
  } else {
    if (!guestRoutes.includes(to.path)) {
      return navigateTo('/auth/login');
    }
  }
});
