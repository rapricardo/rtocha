'use client';

import { useState, useEffect } from 'react';
// import { client } from '@/lib/sanity/client'; // No longer needed for direct query
// import { groq } from 'next-sanity'; // No longer needed for direct query

interface ReportStatusProps {
  leadId: string;
}

// Remove unused ReportStatus interface
// interface ReportStatus { ... }

export default function ReportStatusIndicator({ leadId }: ReportStatusProps) {
  // Use a single state for status/message from API
  const [apiStatus, setApiStatus] = useState<{ status: string; message: string } | null>(null);
  // const [reportId, setReportId] = useState<string | null>(null); // Use reportSlug only
  const [reportSlug, setReportSlug] = useState<string | null>(null); // Store slug/id when completed
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingCount, setPollingCount] = useState(0);
  const MAX_POLLING = 60; // Máximo de 5 minutos (60 * 5s = 5 min)
  
  useEffect(() => {
    // Flag para evitar memory leaks se o componente for desmontado
    let isActive = true;
    let intervalId: NodeJS.Timeout | null = null;
    
    console.log('🔍 ReportStatusIndicator: Iniciando monitoramento para leadId:', leadId);
    
    // Função para buscar o status atual
    const fetchStatus = async (): Promise<boolean> => { // Return true to stop polling
      // Ensure component is still active and leadId is present
      if (!isActive || !leadId) return true; // Stop if inactive or no leadId

      const currentCount = pollingCount + 1;
      setPollingCount(currentCount); // Update count state

      console.log(`🔍 [Polling #${currentCount}/${MAX_POLLING}] Verificando status para leadId: ${leadId}`);

      // Check polling limit
      if (currentCount >= MAX_POLLING) {
        console.log(`⚠️ Atingido limite máximo de ${MAX_POLLING} verificações. Parando polling.`);
        setError(`Tempo limite excedido (${MAX_POLLING * 5}s) para verificação do relatório. Por favor, recarregue a página ou contate o suporte.`);
        return true; // Stop polling
      }

      try {
        // Call the refactored API endpoint
        const statusUrl = `/api/audit-quiz/report-status?leadId=${encodeURIComponent(leadId)}`;
        const response = await fetch(statusUrl);
        const data = await response.json(); // Assume API always returns JSON, even on error

        console.log(`🔍 [Polling #${currentCount}] Resposta API (${response.status}):`, data);

        if (!response.ok) {
          throw new Error(data.error || `Falha ao verificar status: ${response.status}`);
        }

        // Update component state based on API response
        if (isActive) {
          setApiStatus({ status: data.status, message: data.message });
          if (data.reportUrl) {
            const slugOrId = data.reportUrl.split('/').pop();
            setReportSlug(slugOrId); // Store slug/id when report is ready
          }
          if (data.error) {
             setError(data.error); // Set error state if API indicates failure
          }
        }

        // Determine if polling should stop
        const shouldStop = data.status === 'completed' || data.status === 'failed';
        if (shouldStop) {
          console.log(`🛑 Status ${data.status} recebido. Parando polling.`);
        }
        return shouldStop;

      } catch (error) {
        if (!isActive) return false;
        
        if (!isActive) return true; // Stop if component unmounted during fetch
        console.error('❌ Erro durante fetchStatus:', error);
        setError(`Erro ao verificar status: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        return true; // Stop polling on error
      } finally {
        if (isActive) setIsLoading(false); // Set loading to false after first attempt completes
      }
    };

    // Remover startReportGeneration - Geração é iniciada pelo /submit
    // const startReportGeneration = async () => { ... };

    // --- Polling Logic ---
    let isPollingStopped = false;

    // Initial check
    fetchStatus().then(shouldStop => {
      isPollingStopped = shouldStop;
      if (isPollingStopped) {
        console.log('🛑 Polling interrompido após verificação inicial.');
        return;
      }

      // Setup interval only if not stopped initially
      console.log('⏱️ Configurando intervalo de polling (5s)');
      intervalId = setInterval(async () => {
        if (!isActive || isPollingStopped) { // Check flags again inside interval
          if (intervalId) clearInterval(intervalId);
          return;
        }
        try {
          const shouldStop = await fetchStatus();
          if (shouldStop) {
            isPollingStopped = true;
            if (intervalId) {
              console.log('🛑 Interrompendo polling via intervalo.');
              clearInterval(intervalId);
              intervalId = null;
            }
          }
        } catch (error) {
          console.error('❌ Erro durante verificação periódica no intervalo:', error);
          isPollingStopped = true; // Stop polling on error within interval too
          if (intervalId) clearInterval(intervalId);
        }
      }, 5000); // Poll every 5 seconds
    }).catch(error => {
        // Catch potential errors from the initial fetchStatus call itself
        console.error('❌ Erro na verificação inicial de status:', error);
        if (isActive) setError(`Erro inicial: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        setIsLoading(false);
    });

    // Cleanup function
    return () => {
      console.log('🧹 Limpando efeito ReportStatusIndicator');
      isActive = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [leadId]); // Remove pollingCount from dependency array
  
  // Renderizar mensagem de carregamento
  if (isLoading) {
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <div className="flex items-center">
          <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          <p>Verificando status do relatório...</p>
        </div>
      </div>
    );
  }
  
  // Renderizar mensagem de erro
  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
        <p>Erro: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // --- Render based on apiStatus ---

  // Relatório completo (reportSlug is set)
  if (reportSlug) {
    return (
      <div className="mt-4 p-5 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center mb-3">
          <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-medium text-green-800">Relatório Pronto!</h3>
        </div>
        <p className="text-green-700 mb-4">
          {apiStatus?.message || 'Seu relatório personalizado está pronto para visualização.'}
        </p>
        <a
          href={`/relatorios/${reportSlug}`} // Use only reportSlug
          className="inline-block px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Ver Relatório Completo
        </a>
      </div>
    );
  }

  // Status based on apiStatus
  if (apiStatus) {
    switch (apiStatus.status) {
      case 'queued':
      case 'processing': // Combine queued and processing visually
        return (
          <div className="mt-4 p-5 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center mb-3">
              <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
              <h3 className="text-lg font-medium text-blue-800">Processando Relatório</h3>
            </div>
            <p className="text-blue-700 mb-2">{apiStatus.message}</p>
            <p className="text-sm text-blue-600">
              Isso pode levar alguns minutos.
              Esta página será atualizada automaticamente quando estiver pronto.
            </p>
            {/* Optional: Add progress bar back if desired */}
            {/* <div className="mt-3 h-2 bg-blue-200 rounded-full overflow-hidden">...</div> */}
          </div>
        );

      case 'failed':
        return (
          <div className="mt-4 p-5 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center mb-3">
              <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800">Falha na Geração</h3>
            </div>
            <p className="text-red-700 mb-2">{apiStatus.message}</p>
            <p className="text-sm text-red-600 mb-4">
              Ocorreu um problema ao gerar seu relatório. Por favor, tente recarregar a página ou contate o suporte se o problema persistir.
            </p>
            {/* Remove retry button for now, as direct generation call is complex */}
            {/* <button onClick={...}>Tentar Novamente</button> */}
          </div>
        );

      case 'partial': // Assuming 'partial' might still be a possible status from Sanity
        return (
          <div className="mt-4 p-5 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center mb-3">
              <svg className="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-yellow-800">Relatório Parcial Disponível</h3>
            </div>
            <p className="text-yellow-700 mb-2">{apiStatus.message}</p>
            <p className="text-sm text-yellow-600 mb-4">
              Um relatório parcial está disponível. Você já pode acessar o conteúdo básico.
            </p>
            {reportSlug && ( // Check reportSlug here
              <a
                href={`/relatorios/${reportSlug}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Ver Relatório Parcial
              </a>
            )}
          </div>
        );
        
      default:
        return (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p>Status desconhecido: {apiStatus.status}</p>
            <p>{apiStatus.message}</p>
          </div>
        );
    }
  }
  
  // Fallback - Sem status definido
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
      <p>Nenhuma informação disponível sobre o relatório.</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Verificar novamente
      </button>
    </div>
  );
}
