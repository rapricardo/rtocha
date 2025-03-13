import { client } from './client'

/**
 * Registra a visualização de um relatório
 */
export async function recordReportView(reportId: string) {
  try {
    await client
      .patch(reportId)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .set({ lastViewedAt: new Date().toISOString() })
      .commit()
    
    return true
  } catch (error) {
    console.error('Erro ao registrar visualização:', error)
    return false
  }
}

/**
 * Registra clique no CTA do relatório
 */
export async function recordCtaClick(reportId: string) {
  try {
    await client
      .patch(reportId)
      .set({ 
        callToActionClicked: true,
        ctaClickedAt: new Date().toISOString()
      })
      .commit()
    
    return true
  } catch (error) {
    console.error('Erro ao registrar clique CTA:', error)
    return false
  }
}

/**
 * Formata a data para exibição
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}
