import { LeadInfo, Service } from "@/types/service";

// Verifica a compatibilidade entre o perfil do lead e o serviço
export function checkServiceCompatibility(lead: LeadInfo, service: Service): {
  isCompanyRecommended: boolean;
  isDigitalMaturityCompatible: boolean;
  isChallengeCompatible: boolean;
  isGoalCompatible: boolean;
  overallRecommendation: boolean;
} {
  console.log("[serviceUtils] Verificando compatibilidade:", { lead, service });
  // Verificar compatibilidade de tamanho da empresa
  const isCompanyRecommended = !lead.companySize || !service.forCompanySize
    ? true
    : service.forCompanySize.includes(lead.companySize);

  // Verificar compatibilidade de maturidade digital
  const isDigitalMaturityCompatible = !lead.maturidadeDigital || !service.forDigitalMaturity
    ? true
    : service.forDigitalMaturity.includes(lead.maturidadeDigital);

  // Verificar compatibilidade de desafios
  const isChallengeCompatible = !lead.mainChallenge || !service.forMainChallenges
    ? true
    : service.forMainChallenges.includes(lead.mainChallenge);

  // Verificar compatibilidade de objetivos
  const isGoalCompatible = !lead.improvementGoal || !service.forImprovementGoals
    ? true
    : service.forImprovementGoals.includes(lead.improvementGoal);

  // Calcular recomendação geral (pelo menos duas compatibilidades)
  const compatibilityCount = [
    isCompanyRecommended,
    isDigitalMaturityCompatible,
    isChallengeCompatible,
    isGoalCompatible
  ].filter(Boolean).length;

  const overallRecommendation = compatibilityCount >= 2;

  return {
    isCompanyRecommended,
    isDigitalMaturityCompatible,
    isChallengeCompatible,
    isGoalCompatible,
    overallRecommendation
  };
}

// Gera uma mensagem personalizada para o lead baseada no serviço e perfil
export function generatePersonalizedMessage(lead: LeadInfo, service: Service, compatibility: ReturnType<typeof checkServiceCompatibility>): string {
  const { overallRecommendation, isChallengeCompatible, isGoalCompatible } = compatibility;
  
  // Verificar se o serviço está na lista de recomendados do lead
  const isExplicitlyRecommended = lead.recommendedServices?.some(s => s._id === service._id);
  
  if (isExplicitlyRecommended) {
    return `${lead.name}, este serviço foi especificamente recomendado para ${lead.companyName || 'sua empresa'} com base no diagnóstico realizado.`;
  }
  
  if (overallRecommendation) {
    if (isChallengeCompatible && lead.mainChallenge) {
      const challengeText = {
        'qualified_leads': 'gerar leads qualificados',
        'conversion_rate': 'aumentar a taxa de conversão',
        'sales_cycle': 'reduzir o ciclo de vendas',
        'retention': 'melhorar a retenção de clientes',
        'scaling': 'escalar mantendo a qualidade',
        'other': 'superar seus desafios específicos'
      }[lead.mainChallenge] || 'superar seus desafios';
      
      return `${lead.name}, este serviço é altamente compatível com seu objetivo de ${challengeText} para ${lead.companyName || 'sua empresa'}.`;
    }
    
    if (isGoalCompatible && lead.improvementGoal) {
      const goalText = {
        'increase_revenue': 'aumentar receita',
        'reduce_costs': 'reduzir custos operacionais',
        'customer_experience': 'melhorar a experiência do cliente',
        'optimize_processes': 'otimizar processos internos',
        'other': 'atingir seus objetivos específicos'
      }[lead.improvementGoal] || 'atingir seus objetivos';
      
      return `${lead.name}, este serviço pode ajudar ${lead.companyName || 'sua empresa'} a ${goalText} através da automação inteligente.`;
    }
    
    return `${lead.name}, com base no seu perfil, este serviço pode trazer resultados significativos para ${lead.companyName || 'sua empresa'}.`;
  }
  
  return `${lead.name}, embora este serviço não tenha sido originalmente recomendado no seu diagnóstico, ele pode trazer benefícios complementares para ${lead.companyName || 'sua empresa'}.`;
}
