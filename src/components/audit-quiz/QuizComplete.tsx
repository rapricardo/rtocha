"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QuizPreview } from '@/lib/types';

interface QuizCompleteProps {
  preview: QuizPreview | null;
  isLoading: boolean;
  onRequestFullReport: () => Promise<string | null>; // Modificado para retornar o requestId
  error: string | null;
}

export default function QuizComplete({
  preview,
  isLoading,
  onRequestFullReport,
  error
}: QuizCompleteProps) {
  // Estado adicionado para gerenciar polling e status de relatório
  const [reportRequestId, setReportRequestId] = useState<string | null>(null);
  const [pollingActive, setPollingActive] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);

  // Logs de depuração para o componente QuizComplete
  console.log('[DEBUG QuizComplete] Renderizando componente');
  console.log('[DEBUG QuizComplete] preview:', preview);
  console.log('[DEBUG QuizComplete] isLoading:', isLoading);
  console.log('[DEBUG QuizComplete] error:', error);
  console.log('[DEBUG QuizComplete] reportRequestId:', reportRequestId);
  console.log('[DEBUG QuizComplete] pollingActive:', pollingActive);
  console.log('[DEBUG QuizComplete] reportUrl:', reportUrl);
  console.log('[DEBUG QuizComplete] pollingAttempts:', pollingAttempts);

  // Effect para iniciar o polling quando temos um requestId
  useEffect(() => {
    if (!reportRequestId || !pollingActive) return;
    
    console.log('[DEBUG QuizComplete] Iniciando polling para requestId:', reportRequestId);
    
    // Usamos uma variável local para contar tentativas em vez do estado
    let attemptCount = 0;
    
    // Função para verificar o status
    const checkReportStatus = async () => {
      try {
        // Usamos a variável local para log e verificação
        attemptCount++;
        console.log(`[DEBUG QuizComplete] Verificando status: tentativa ${attemptCount}`);
        
        const url = `/api/audit-quiz/report-status?reportRequestId=${encodeURIComponent(reportRequestId)}`;
        console.log('[DEBUG QuizComplete] URL de verificação:', url);
        
        const response = await fetch(url);
        
        console.log('[DEBUG QuizComplete] Resposta recebida:', response.status);
        
        // Tenta ler o corpo da resposta mesmo que status não seja ok
        let data;
        try {
          data = await response.json();
          console.log('[DEBUG QuizComplete] Dados da resposta:', data);
        } catch (parseError) {
          console.error('[DEBUG QuizComplete] Erro ao parsear resposta:', parseError);
          throw new Error('Erro ao processar resposta do servidor');
        }
        
        if (!response.ok) {
          throw new Error(data?.error || `Falha ao verificar status do relatório (${response.status})`);
        }
        
        // Atualizar mensagem de status
        setStatusMessage(data.message || 'Verificando status do relatório...');
        
        // Se o relatório estiver pronto, definir a URL
        if (data.status === 'completed' && data.reportUrl) {
          console.log('[DEBUG QuizComplete] Relatório concluído:', data.reportUrl);
          setReportUrl(data.reportUrl);
          setPollingActive(false);
          
          // Atualizar o preview para mostrar que o relatório está pronto
          if (preview) {
            preview.reportRequested = true;
            preview.reportUrl = data.reportUrl;
          }
          
          return true; // Relatório pronto
        } else if (data.status === 'failed') {
          console.log('[DEBUG QuizComplete] Relatório falhou:', data.error);
          setReportError(data.error || 'Ocorreu um erro ao gerar seu relatório. Por favor, tente novamente.');
          setPollingActive(false);
          return true; // Parar polling com erro
        }
        
        // Verificar limite baseado na variável local
        if (attemptCount > 20) {
          console.log('[DEBUG QuizComplete] Número máximo de tentativas excedido');
          setReportError('O relatório está demorando mais do que o esperado. Por favor, tente novamente mais tarde.');
          setPollingActive(false);
          return true;
        }
        
        return false; // Continuar polling
      } catch (error) {
        console.error('[DEBUG QuizComplete] Erro ao verificar status:', error);
        
        // Se for apenas a primeira ou segunda tentativa, continue tentando
        if (attemptCount < 3) {
          console.log('[DEBUG QuizComplete] Continuando a tentar apesar do erro (tentativa inicial)');
          return false; // Continuar polling
        }
        
        setReportError('Falha ao verificar status do relatório. Por favor, tente novamente.');
        setPollingActive(false);
        return true; // Parar polling com erro
      }
    };
    
    // Verificar imediatamente
    checkReportStatus();
    
    // Configurar intervalo para polling
    const pollingInterval = setInterval(async () => {
      const shouldStop = await checkReportStatus();
      
      if (shouldStop) {
        clearInterval(pollingInterval);
      }
    }, 3000); // Verificar a cada 3 segundos
    
    // Limpar intervalo quando o componente for desmontado
    return () => {
      clearInterval(pollingInterval);
    };
  }, [reportRequestId, pollingActive, preview]); // Removemos pollingAttempts das dependências

  // Função para lidar com a solicitação de relatório completo
  const handleRequestReport = async () => {
    console.log('[DEBUG QuizComplete] Iniciando solicitação de relatório completo');
    setLoadingReport(true);
    setReportError(null);
    setPollingAttempts(0);
    
    try {
      // Chamar a função de solicitação passada como prop
      const result = await onRequestFullReport();
      console.log('[DEBUG QuizComplete] Resposta da solicitação:', result);
      
      // Verificar primeiro se um relatório já existe (verificando o preview atualizado)
      if (preview?.reportExists || preview?.reportUrl) {
        console.log('[DEBUG QuizComplete] Relatório existente encontrado:', preview.reportUrl);
        setReportUrl(preview.reportUrl);
        
        // Atualizar o preview para mostrar que o relatório está pronto
        if (preview) {
          preview.reportRequested = true;
        }
      } else if (result) {
        // Se recebemos um requestId, precisamos iniciar polling
        setReportRequestId(result);
        setPollingActive(true);
        setStatusMessage('Seu relatório está sendo gerado...');
      }
    } catch (err) {
      console.error('[DEBUG QuizComplete] Erro ao solicitar relatório:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro ao solicitar relatório completo';
      setReportError(errorMessage);
    } finally {
      setLoadingReport(false);
    }
  };

  if (isLoading && !preview) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Analisando suas respostas...
        </h3>
        <p className="text-gray-600">
          Estamos preparando sua mini-auditoria personalizada.
        </p>
      </div>
    );
  }

  if (error && !preview) {
    return (
      <div className="text-center py-10">
        <div className="inline-block rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Ocorreu um erro
        </h3>
        <p className="text-red-600 mb-4">
          {error}
        </p>
        <p className="text-gray-600">
          Por favor, tente novamente mais tarde ou entre em contato conosco.
        </p>
      </div>
    );
  }

  if (!preview) {
    return null;
  }

  return (
    <div className="py-4">
      <div className="text-center mb-6">
        <div className="inline-block rounded-full h-16 w-16 bg-green-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Sua mini-auditoria está pronta!
        </h3>
        <p className="text-gray-600">
          Aqui está um preview das oportunidades que identificamos para sua empresa.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Preview da mini-auditoria:</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-blue-600">SERVIÇO RECOMENDADO:</h5>
            <p className="text-gray-800 font-semibold">{preview.recommendedService}</p>
          </div>
          
          <div>
            <h5 className="font-medium text-blue-600">PROBLEMA RESOLVIDO:</h5>
            <p className="text-gray-800">{preview.problemSolved}</p>
          </div>
          
          <div>
            <h5 className="font-medium text-blue-600">BENEFÍCIO ESPERADO:</h5>
            <p className="text-gray-800">{preview.benefit}</p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-700">
            Sua auditoria completa contém mais {preview.additionalServices} serviços personalizados com detalhamento de implementação e exemplos de aplicação prática.
          </p>
        </div>
      </div>

      {/* Seção de relatório considerando estados de polling e URL */}
      {console.log('[DEBUG QuizComplete] Estado atual para renderização:', {
        preview: preview?.reportRequested,
        reportUrl,
        pollingActive,
        loadingReport,
        reportError
      })}
      
      {/* Caso 1: Relatório disponível (seja através do preview original ou após polling) */}
      {(preview.reportRequested || reportUrl) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Sua auditoria completa está pronta!
                </p>
              </div>
            </div>
            
            <Link 
              href={reportUrl || preview.reportUrl || "#"}
              className="block w-full md:w-auto px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition"
            >
              Ver minha auditoria completa
            </Link>
          </div>
        </div>
      )}
      
      {/* Caso 2: Relatório em processamento (polling ativo) */}
      {pollingActive && !reportUrl && !reportError && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-blue-800 font-medium">
              {statusMessage || "Processando seu relatório..."}
            </p>
          </div>
          <p className="mt-2 text-sm text-blue-600">
            Este processo pode levar alguns instantes. A página será atualizada automaticamente quando o relatório estiver pronto.
          </p>
        </div>
      )}
      
      {/* Caso 3: Erro no relatório */}
      {reportError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {reportError}
              </p>
              <button
                onClick={() => handleRequestReport()}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Caso 4: Botão para solicitar relatório (estado inicial) */}
      {!preview.reportRequested && !reportUrl && !pollingActive && !reportError && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => handleRequestReport()}
            disabled={loadingReport}
            className={`w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg transition ${
              loadingReport ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loadingReport ? (
              <>
                <span className="inline-block animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></span>
                Iniciando geração...
              </>
            ) : (
              'Ver auditoria completa'
            )}
          </button>
          
          <p className="mt-4 text-sm text-gray-600">
            A auditoria completa estará disponível para acesso imediato após ser gerada.
          </p>
        </div>
      )}
    </div>
  );
}
