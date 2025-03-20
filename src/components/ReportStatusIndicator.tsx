'use client';

import { useState, useEffect } from 'react';
import { client } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

interface ReportStatusProps {
  leadId: string;
}

interface ReportStatus {
  status: 'queued' | 'processing' | 'completed' | 'partial' | 'failed';
  message: string;
  updatedAt: string;
  attempts: number;
}

export default function ReportStatusIndicator({ leadId }: ReportStatusProps) {
  const [status, setStatus] = useState<ReportStatus | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Flag para evitar memory leaks se o componente for desmontado
    let isActive = true;
    
    // Função para buscar o status atual
    const fetchStatus = async () => {
      try {
        if (!leadId) return;
        
        const result = await client.fetch(groq`
          *[_type == "lead" && _id == $leadId][0]{
            reportStatus,
            report->{_id}
          }
        `, { leadId });
        
        if (!isActive) return;
        
        if (result) {
          setStatus(result.reportStatus || null);
          setReportId(result.report?._id || null);
          
          // Se o relatório está completo ou se já existe um ID de relatório,
          // não precisamos mais verificar
          const isCompleted = 
            result.reportStatus?.status === 'completed' || 
            result.reportStatus?.status === 'partial' ||
            !!result.report?._id;
            
          if (isCompleted) {
            // Parar o polling se o relatório está pronto
            return true;
          }
        }
        return false;
      } catch (error) {
        if (!isActive) return false;
        
        console.error('Erro ao buscar status do relatório:', error);
        setError('Erro ao verificar o status do relatório');
        return false;
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };
    
    // Primeira verificação imediata
    fetchStatus();
    
    // Configurar verificação periódica a cada 5 segundos
    const intervalId = setInterval(async () => {
      const shouldStop = await fetchStatus();
      if (shouldStop && isActive) {
        clearInterval(intervalId);
      }
    }, 5000);
    
    // Limpeza ao desmontar o componente
    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [leadId]);
  
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
  
  // Relatório completo (com ID de relatório disponível)
  if (reportId) {
    return (
      <div className="mt-4 p-5 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center mb-3">
          <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-medium text-green-800">Relatório Pronto!</h3>
        </div>
        <p className="text-green-700 mb-4">
          {status?.message || 'Seu relatório personalizado está pronto para visualização.'}
        </p>
        <a 
          href={`/reports/${reportId}`}
          className="inline-block px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Ver Relatório Completo
        </a>
      </div>
    );
  }
  
  // Status baseado no estado atual
  if (status) {
    switch (status.status) {
      case 'queued':
        return (
          <div className="mt-4 p-5 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center mb-3">
              <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-blue-800">Relatório em Fila</h3>
            </div>
            <p className="text-blue-700 mb-2">{status.message}</p>
            <p className="text-sm text-blue-600">
              Seu relatório está na fila para processamento. Isso pode levar alguns minutos.
              Esta página será atualizada automaticamente.
            </p>
          </div>
        );
        
      case 'processing':
        return (
          <div className="mt-4 p-5 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center mb-3">
              <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
              <h3 className="text-lg font-medium text-blue-800">Processando</h3>
            </div>
            <p className="text-blue-700 mb-2">{status.message}</p>
            <p className="text-sm text-blue-600">
              Seu relatório está sendo gerado. Isso pode levar alguns minutos.
              Não precisa atualizar a página, ela será atualizada automaticamente.
            </p>
            <div className="mt-3 h-2 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse"></div>
            </div>
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
            <p className="text-red-700 mb-2">{status.message}</p>
            <p className="text-sm text-red-600 mb-4">
              Ocorreu um problema ao gerar o relatório. Nossa equipe foi notificada e entrará em contato em breve.
            </p>
            <button 
              onClick={() => {
                setIsLoading(true);
                fetch('/api/reports/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ leadId }),
                })
                .then(res => res.json())
                .then(() => {
                  setStatus({
                    ...status,
                    status: 'processing',
                    message: 'Reiniciando a geração do relatório...'
                  });
                })
                .catch(err => {
                  console.error('Erro ao reiniciar geração:', err);
                  setError('Não foi possível reiniciar a geração');
                })
                .finally(() => {
                  setIsLoading(false);
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        );
        
      case 'partial':
        return (
          <div className="mt-4 p-5 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center mb-3">
              <svg className="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-yellow-800">Relatório Parcial Disponível</h3>
            </div>
            <p className="text-yellow-700 mb-2">{status.message}</p>
            <p className="text-sm text-yellow-600 mb-4">
              Um relatório parcial está disponível. Nem todas as informações detalhadas puderam ser
              processadas, mas você já pode acessar o conteúdo básico.
            </p>
            {reportId && (
              <a 
                href={`/reports/${reportId}`}
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
            <p>Status: {status.status}</p>
            <p>{status.message}</p>
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