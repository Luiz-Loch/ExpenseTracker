import { ref } from 'vue'

export enum SnackbarColor {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export function useSnackbar() {
  const snackbar = ref<{ open: boolean; text: string; color: SnackbarColor }>({
    open: false,
    text: '',
    color: SnackbarColor.SUCCESS,
  });

  function showSnackbar(text: string, color: SnackbarColor = SnackbarColor.SUCCESS) {
    snackbar.value = { open: true, text, color }
  }

  return { snackbar, showSnackbar, SnackbarColor }
}
