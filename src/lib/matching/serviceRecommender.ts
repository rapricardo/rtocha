import { sanityClient } from '../sanity/client';
import { LeadData, ServiceData } from '@/lib/types';

// Interface para o serviço recomendado
interface RecommendedServicePreview {
  name: string;
  problem: string;
  benefit: string;
}

// Interface para o serviço pontuado
interface ScoredService {
  serviceId: string;
  name: string;
  score: number;
  priority: number;
}

// Função simplificada para gerar uma recomendação de serviço para o preview
// Em um ambiente real, isso seria mais sofisticado e usaria os dados do Sanity
export async function getRecommendedService(leadData: LeadData): Promise<RecommendedServicePreview> {
  // Lógica simplificada baseada nas respostas do usuário
  const { mainChallenge, usesCRM, improvementGoal, usesAutomation, jobTitle } = leadData;
  
  // Em um ambiente real, buscaria os serviços do Sanity e aplicaria um algoritmo
  // de matching mais sofisticado
  
  // Para demonstração, usamos uma lógica simples baseada nos desafios e objetivos
  let recommendedService: RecommendedServicePreview = {
    name: 'Assistente de Reuniões Integrado ao CRM',
    problem: 'Variação de performance entre vendedores e perda de informações importantes durante negociações.',
    benefit: 'Aumento da taxa de conversão em 15-30% e registro automático de informações no CRM.'
  };
  
  // Considerar o nível de uso de automações
  if (usesAutomation === 'no_use' || usesAutomation === 'evaluating') {
    // Para quem não usa automações, começar com algo mais básico
    recommendedService = {
      name: 'Agente de Agendamento Automático',
      problem: 'Tempo excessivo gasto em trocas de mensagens para encontrar horários disponíveis para reuniões.',
      benefit: 'Redução de 70% no tempo gasto com agendamentos e diminuição de faltas em reuniões com sistema de lembretes.'
    };
  }
  
  // Baseado no desafio principal
  if (mainChallenge === 'qualified_leads') {
    recommendedService = {
      name: 'Agente de Geração de Leads usando Google Maps',
      problem: 'Dificuldade em encontrar novos leads qualificados de forma consistente e escalável.',
      benefit: 'Geração contínua de novos leads qualificados com precisão geográfica e por segmento.'
    };
  } 
  else if (mainChallenge === 'sales_cycle') {
    recommendedService = {
      name: 'Agente de Follow-up/Recuperação de Vendas',
      problem: 'Leads "esquecidos" no processo e oportunidades perdidas por falta de acompanhamento.',
      benefit: 'Recuperação de 15-25% dos leads "esquecidos" através de sequências de follow-up personalizadas.'
    };
  }
  else if (mainChallenge === 'scaling' || improvementGoal === 'optimize_processes') {
    recommendedService = {
      name: 'Integrações entre Sistemas de Marketing e Vendas',
      problem: 'Informações fragmentadas entre departamentos e trabalho manual redundante.',
      benefit: 'Eliminação de 90% do trabalho manual e criação de visão 360° do cliente.'
    };
  }
  
  // Refinamento baseado no cargo
  if (jobTitle && (jobTitle.toLowerCase().includes('marketing') || jobTitle.toLowerCase().includes('cmo'))) {
    if (mainChallenge === 'qualified_leads') {
      recommendedService = {
        name: 'Plano de Escalabilidade de Conteúdo',
        problem: 'Dificuldade em manter consistência na produção de conteúdo de qualidade com recursos limitados.',
        benefit: 'Multiplicação da produção de conteúdo com o mesmo esforço através da matriz de conteúdo 1:5.'
      };
    }
  }
  
  // Refinamento baseado em outros fatores
  if (usesCRM === 'no_use' && recommendedService.name.includes('CRM')) {
    recommendedService = {
      name: 'Agente SDR para Qualificação de Leads',
      problem: 'Tempo da equipe comercial gasto com leads não qualificados.',
      benefit: 'Priorização sistemática de leads com maior chance de conversão e reuniões mais produtivas.'
    };
  }
  
  return recommendedService;
}

// Versão mais sofisticada para a geração real do relatório via n8n
export async function recommendServicesForLead(leadId: string): Promise<ScoredService[]> {
  // Buscar dados do lead
  const lead = await sanityClient.fetch(
    `*[_type == "lead" && _id == $leadId][0]{
      _id,
      companySize,
      companySite,
      jobTitle,
      usesAutomation,
      maturidadeDigital,
      mainChallenge,
      improvementGoal,
      usesCRM,
      usesMarketingAutomation
    }`,
    { leadId }
  );
  
  if (!lead) {
    throw new Error('Lead não encontrado');
  }
  
  // Buscar serviços
  const services = await sanityClient.fetch(
    `*[_type == "service"]{
      _id,
      name,
      forCompanySize,
      forDigitalMaturity,
      forMainChallenges,
      forImprovementGoals,
      priority
    }`
  );
  
  // Calcular score para cada serviço
  const scoredServices = services.map((service: ServiceData) => {
    let score = 0;
    
    // Verificar match de tamanho da empresa
    if (service.forCompanySize?.includes(lead.companySize)) {
      score += 2;
    }
    
    // Verificar match de maturidade digital
    if (service.forDigitalMaturity?.includes(lead.maturidadeDigital)) {
      score += 3;
    }
    
    // Verificar match de desafio principal
    if (service.forMainChallenges?.includes(lead.mainChallenge)) {
      score += 5;
    }
    
    // Verificar match de objetivo de melhoria
    if (service.forImprovementGoals?.includes(lead.improvementGoal)) {
      score += 4;
    }
    
    // Considerar o nível de uso de automações
    if (lead.usesAutomation === 'no_use' && service.name.includes('Básico')) {
      score += 3; // Preferência para serviços básicos para quem não usa automações
    }
    
    if (lead.usesAutomation === 'extensive' && service.name.includes('Avançado')) {
      score += 3; // Preferência para serviços avançados para quem já usa automações
    }
    
    // Ajustar com a prioridade base do serviço
    score += (service.priority || 0) * 0.5;
    
    return {
      serviceId: service._id,
      name: service.name,
      score,
      // Definir prioridade baseada no score
      priority: score >= 10 ? 1 : score >= 7 ? 2 : 3
    };
  });
  
  // Ordenar por score e pegar os 3 melhores
  return scoredServices
    .sort((a: ScoredService, b: ScoredService) => b.score - a.score)
    .slice(0, 3);
}