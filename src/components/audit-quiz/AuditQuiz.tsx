"use client";

import { useState } from 'react';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizComplete from './QuizComplete';
import { QuizPreview, QuizAnswerValue } from '@/lib/types';
import { storeLeadId } from '@/lib/hooks/useReturningLead';

// Definição das perguntas do quiz
const questions = [
  {
    id: 'name',
    type: 'text',
    question: 'Como podemos te chamar?',
    placeholder: 'Seu nome',
    required: true,
  },
  {
    id: 'email',
    type: 'email',
    question: 'Qual seu e-mail para enviarmos sua mini-auditoria?',
    placeholder: 'seu@email.com',
    required: true,
  },
  {
    id: 'jobTitle',
    type: 'text',
    question: 'Qual o seu cargo na empresa?',
    placeholder: 'Ex: CEO, Diretor de Marketing, Gerente Comercial',
    required: true,
  },
  {
    id: 'companyName',
    type: 'text',
    question: 'Qual o nome da sua empresa?',
    placeholder: 'Nome da empresa',
    required: true,
  },
  {
    id: 'companySite',
    type: 'text',
    question: 'Qual o site da sua empresa?',
    placeholder: 'www.suaempresa.com.br',
    required: false,
  },
  {
    id: 'companySize',
    type: 'select',
    question: 'Qual o tamanho aproximado da equipe?',
    options: [
      { value: '1-10', label: '1-10 colaboradores' },
      { value: '11-50', label: '11-50 colaboradores' },
      { value: '51-200', label: '51-200 colaboradores' },
      { value: '201-500', label: '201-500 colaboradores' },
      { value: '500+', label: 'Mais de 500 colaboradores' },
    ],
    required: true,
  },
  {
    id: 'marketingStructure',
    type: 'select',
    question: 'Como funciona a gestão de marketing na sua empresa?',
    options: [
      { value: 'internal_team', label: 'Equipe interna' },
      { value: 'external_agency', label: 'Agência externa' },
      { value: 'hybrid', label: 'Modelo híbrido' },
      { value: 'unstructured', label: 'Não temos marketing estruturado' },
    ],
    required: true,
  },
  {
    id: 'salesTeamSize',
    type: 'select',
    question: 'Qual o tamanho da equipe comercial?',
    options: [
      { value: 'founders_only', label: 'Somente sócios/fundadores' },
      { value: '1-3', label: '1-3 vendedores' },
      { value: '4-10', label: '4-10 vendedores' },
      { value: '11+', label: '11+ vendedores' },
    ],
    required: true,
  },
  {
    id: 'clientAcquisitionStrategy',
    type: 'select',
    question: 'Qual a principal estratégia de aquisição de clientes?',
    options: [
      { value: 'mainly_inbound', label: 'Principalmente inbound (80%+)' },
      { value: 'mainly_outbound', label: 'Principalmente outbound (80%+)' },
      { value: 'balanced_mix', label: 'Mix equilibrado de ambas' },
      { value: 'undefined', label: 'Ainda não temos estratégia definida' },
    ],
    required: true,
  },
  {
    id: 'usesCRM',
    type: 'select',
    question: 'Sua empresa usa CRM?',
    options: [
      { value: 'active_use', label: 'Sim, usamos ativamente' },
      { value: 'limited_use', label: 'Sim, mas com uso limitado' },
      { value: 'evaluating', label: 'Não, mas estamos avaliando' },
      { value: 'no_use', label: 'Não usamos' },
    ],
    required: true,
  },
  {
    id: 'usesAutomation',
    type: 'select',
    question: 'Sua empresa já utiliza automações em marketing ou vendas?',
    options: [
      { value: 'extensive', label: 'Sim, extensivamente em vários processos' },
      { value: 'basic', label: 'Sim, mas apenas em alguns processos básicos' },
      { value: 'evaluating', label: 'Não, mas estamos avaliando implementar' },
      { value: 'no_use', label: 'Não usamos nenhuma automação' },
    ],
    required: true,
  },
  {
    id: 'mainChallenge',
    type: 'select',
    question: 'Qual o principal desafio atual nos processos de marketing e vendas?',
    options: [
      { value: 'qualified_leads', label: 'Gerar leads qualificados' },
      { value: 'conversion_rate', label: 'Aumentar taxa de conversão' },
      { value: 'sales_cycle', label: 'Reduzir ciclo de vendas' },
      { value: 'retention', label: 'Melhorar retenção de clientes' },
      { value: 'scaling', label: 'Escalar equipe mantendo qualidade' },
    ],
    required: true,
  },
  {
    id: 'improvementGoal',
    type: 'select',
    question: 'O que você mais gostaria de melhorar nos próximos 6 meses?',
    options: [
      { value: 'increase_revenue', label: 'Aumentar receita' },
      { value: 'reduce_costs', label: 'Reduzir custos operacionais' },
      { value: 'customer_experience', label: 'Melhorar experiência do cliente' },
      { value: 'optimize_processes', label: 'Otimizar processos internos' },
    ],
    required: true,
  },
];

export default function AuditQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswerValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<QuizPreview | null>(null);

  // Verificar se todas as perguntas foram respondidas
  const isComplete = currentQuestion >= questions.length;

  // Lidar com a resposta da pergunta atual
  const handleAnswer = (questionId: string, answer: QuizAnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Navegar para a próxima pergunta
  const handleNext = () => {
    const currentQuestionData = questions[currentQuestion];
    
    // Validar resposta atual
    if (currentQuestionData.required && !answers[currentQuestionData.id]) {
      setError('Esta pergunta é obrigatória');
      return;
    }
    
    setError(null);
    setCurrentQuestion((prev) => prev + 1);
    
    // Se todas as perguntas foram respondidas, enviar dados
    if (currentQuestion === questions.length - 1) {
      submitAnswers();
    }
  };

  // Voltar para a pergunta anterior
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setError(null);
    }
  };

  // Enviar todas as respostas
  const submitAnswers = async () => {
    console.log('[DEBUG] Submetendo questionário');
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/audit-quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...answers,
          origin: 'website_quiz'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao enviar suas respostas');
      }
      
      // Guardar preview para exibição
      setPreview(data.preview);
      
      // Armazenar leadId no localStorage imediatamente após a criação do lead
      if (data.preview?.leadId) {
        console.log('[DEBUG] Armazenando leadId no localStorage:', data.preview.leadId);
        storeLeadId(data.preview.leadId);
        
        // Redirecionar para a página de agradecimento com o leadId
        window.location.href = `/obrigado/${data.preview.leadId}`;
        return; // Importante: retornar para evitar alterações de estado após o redirecionamento
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro ao enviar suas respostas';
      setError(errorMessage);
      // Voltar para a última pergunta em caso de erro
      setCurrentQuestion(questions.length - 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Solicitar relatório completo - atualizado para arquitetura assíncrona
  const requestFullReport = async (): Promise<string | null> => {
    console.log('[DEBUG] Iniciando requestFullReport');
    console.log('[DEBUG] Estado atual do preview:', preview);
    console.log('[DEBUG] Estado submitting (antes):', isSubmitting);
    
    setIsSubmitting(true);
    
    try {
      console.log('[DEBUG] Enviando requisição para /api/audit-quiz/request-report');
      console.log('[DEBUG] Dados enviados:', {
        email: answers.email,
        leadId: preview?.leadId,
      });
      
      const response = await fetch('/api/audit-quiz/request-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: answers.email,
          leadId: preview?.leadId,
        }),
      });
      
      console.log('[DEBUG] Resposta recebida, status:', response.status);
      const data = await response.json();
      console.log('[DEBUG] Dados da resposta:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao solicitar seu relatório');
      }
      
      // Verificar se já existe um relatório
      if (data.reportExists) {
        console.log('[DEBUG] Relatório existente encontrado:', data.reportUrl);
        
        // Atualizar o preview diretamente com a URL do relatório existente
        setPreview((currentPreview) => {
          if (!currentPreview) return null;
          
          return {
            ...currentPreview,
            reportRequested: true,
            reportUrl: data.reportUrl
          };
        });
        
        return null; // Não precisamos de polling para relatório existente
      }
      
      // Verificar se estamos em modo simulado (sem polling necessário)
      if (data.simulatedMode) {
        console.log('[DEBUG] Modo simulado, atualizando preview com URL:', data.reportUrl);
        
        // Atualizar o preview diretamente
        setPreview((currentPreview) => {
          if (!currentPreview) return null;
          
          return {
            ...currentPreview,
            reportRequested: true,
            reportUrl: data.reportUrl
          };
        });
        
        return null; // Sem reportRequestId em modo simulado
      }
      
      // Se não estamos em modo simulado ou com relatório existente, retornar o ID para polling
      console.log('[DEBUG] Modo real, retornando requestId para polling:', data.reportRequestId);
      return data.reportRequestId;
      
    } catch (err) {
      console.error('[DEBUG] Erro durante a requisição:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro ao solicitar relatório completo';
      setError(errorMessage);
      return null;
    } finally {
      console.log('[DEBUG] Finalizando requisição, atualizando isSubmitting para false');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
      {!isComplete ? (
        <>
          <QuizProgress 
            currentStep={currentQuestion + 1} 
            totalSteps={questions.length} 
          />
          
          <QuizQuestion
            question={questions[currentQuestion]}
            value={answers[questions[currentQuestion].id] || ''}
            onChange={(value) => handleAnswer(questions[currentQuestion].id, value)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            error={error}
            showBack={currentQuestion > 0}
            isLast={currentQuestion === questions.length - 1}
          />
        </>
      ) : (
        <QuizComplete 
          preview={preview}
          isLoading={isSubmitting} 
          onRequestFullReport={requestFullReport}
          error={error}
        />
      )}
    </div>
  );
}