import type { Ref } from 'vue'

export function useFormRules(options?: { password?: Ref<string> }) {
  const rules = {
    required: (v: any) => (v !== null && v !== undefined && v !== '') || 'Campo obrigatório',
    min: (n: number) => (v: string) => (v?.length >= n) || `Mínimo de ${n} caracteres`,
    max: (n: number) => (v: string) => (!v || v.length <= n) || `Máximo de ${n} caracteres`,
    email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
    strongPassword: (v: string) => {
      const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
      return (
        regex.test(v) ||
        'Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo'
      )
    },
    positiveNumber: (v: number) => (typeof v === 'number' && !isNaN(v) && v > 0) || 'Valor deve ser maior que zero',
    samePassword: (v: string) => v === options?.password?.value || 'As senhas não conferem',
  }

  return { rules }
}
