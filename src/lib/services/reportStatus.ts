// Serviço para gerenciar o status dos relatórios em processamento
// Em produção, este Map deve ser substituído por uma solução mais robusta como Redis

// Interface para representar o status de um relatório
export interface ReportStatus {
  status: 'processing' | 'completed' | 'failed';
  startTime: string;
  completedAt?: string;
  reportUrl?: string;
  error?: string;
  leadId: string;
}

// Verificar se estamos no lado do servidor
const isServer = typeof window === 'undefined';

// Usar uma abordagem que funcione tanto no lado do servidor quanto no cliente
// No Next.js, o código do servidor pode ser executado várias vezes, então precisamos
// garantir que temos apenas uma instância do Map

// Usar variável global para garantir que o Map seja compartilhado entre todas as instâncias
// https://nextjs.org/docs/messages/api-routes-Static-initialization-methods

// Esta solução é apenas para desenvolvimento e testes. Em produção, use Redis ou similar
let globalReportStatusMap: Map<string, ReportStatus>;

if (isServer) {
  // @ts-ignore - acessando propriedades globais
  if (!global.reportStatusMap) {
    // @ts-ignore
    global.reportStatusMap = new Map<string, ReportStatus>();
  }
  // @ts-ignore
  globalReportStatusMap = global.reportStatusMap;
} else {
  // No cliente, apenas criar um Map local (não deveria ser usado no cliente de qualquer forma)
  if (!globalReportStatusMap) {
    globalReportStatusMap = new Map<string, ReportStatus>();
  }
}

// Exportamos o serviço de status
export const reportStatusService = {
  // Definir o status de um relatório
  set: (requestId: string, status: ReportStatus): void => {
    console.log(`[ReportStatusService] Definindo status para ${requestId}:`, status);
    globalReportStatusMap.set(requestId, status);
    
    // Configurar limpeza automática após 1 hora (em produção, ajuste conforme necessário)
    if (status.status === 'completed' || status.status === 'failed') {
      setTimeout(() => {
        globalReportStatusMap.delete(requestId);
        console.log(`[ReportStatusService] Removido status expirado para ${requestId}`);
      }, 60 * 60 * 1000); // 1 hora
    }
  },
  
  // Obter o status de um relatório
  get: (requestId: string): ReportStatus | undefined => {
    const status = globalReportStatusMap.get(requestId);
    console.log(`[ReportStatusService] Obtendo status para ${requestId}:`, status);
    return status;
  },
  
  // Atualizar o status de um relatório existente
  update: (requestId: string, updates: Partial<ReportStatus>): void => {
    const currentStatus = globalReportStatusMap.get(requestId);
    
    if (currentStatus) {
      const updatedStatus = {
        ...currentStatus,
        ...updates
      };
      console.log(`[ReportStatusService] Atualizando status para ${requestId}:`, updatedStatus);
      globalReportStatusMap.set(requestId, updatedStatus);
    } else {
      console.log(`[ReportStatusService] Tentando atualizar status inexistente para ${requestId}`);
    }
  },
  
  // Remover o status de um relatório
  delete: (requestId: string): void => {
    console.log(`[ReportStatusService] Removendo status para ${requestId}`);
    globalReportStatusMap.delete(requestId);
  },
  
  // Debug: Listar todos os status (apenas para depuração)
  debug: (): { requestId: string, status: ReportStatus }[] => {
    const result: { requestId: string, status: ReportStatus }[] = [];
    globalReportStatusMap.forEach((status, requestId) => {
      result.push({ requestId, status });
    });
    return result;
  }
};
