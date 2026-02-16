export function useFormatDate() {
  function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
  }

  return { formatDate }
}
