/**
 * Formata a data para exibição
 */
// Funções recordReportView e recordCtaClick removidas - usar as de mutations.ts
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}
