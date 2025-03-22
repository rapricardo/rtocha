import { sanityClient } from '@/lib/sanity/client';
import { generatePersonalizedRecommendations, generateContextAnalysis } from '@/lib/ai/gemini';
import { createReport, updateLead } from '@/lib/sanity/mutations';
import { generateReportId } from '@/lib/utils/reportGenerator';
import { ServiceData, Recommendation } from '@/lib/types';

/**
 * Gera um relatório personalizado com base nos dados do lead
 * Esta função contém a lógica de negócio para geração de relatórios
 * e pode ser chamada de qualquer lugar do código
 */
export async function generateReport(leadId: string) {
  console.log('📝 Serviço reportGenerator: Iniciando geração de relatório...');
  
  if (!leadId) {
    throw new Error('ID do lead é obrigatório');
  }
  
  // 1. Buscar dados do lead
  console.log(`📝 Buscando dados do lead: ${leadId}`);
  const lead = await sanityClient.fetch(
    `*[_type == "lead" && _id == $leadId][0]`,
    { leadId }
  );
  
  if (!lead) {
    throw new Error('Lead não encontrado');
  }
  
  // 2. Buscar serviços disponíveis
  console.log('📝 Buscando serviços disponíveis');
  const services = await sanityClient.fetch(`*[_type == "service"]{
    _id,
    name,
    shortDescription,
    problemsSolved,
    forCompanySize,
    forDigitalMaturity,
    forMainChallenges,
    forImprovementGoals,
    priority
  }`);
  
  // 3. Gerar recomendações personalizadas com o Gemini
  console.log('📝 Gerando recomendações personalizadas com Gemini');
  const recommendations = await generatePersonalizedRecommendations(lead, services);
  
  // 4. Gerar análise de contexto
  console.log('📝 Gerando análise de contexto');
  const contextAnalysisData = await generateContextAnalysis(lead);
  
  // 5. Mapear os nomes dos serviços para IDs e referências
  console.log('📝 Estruturando dados para o relatório');
  const serviceMap = Object.fromEntries(
    services.map((service: ServiceData) => [service.name, service._id])
  );
  
  const recommendedServices = recommendations.recommendations.map((rec: Recommendation, index: number) => {
    // Encontrar o ID do serviço pelo nome
    const serviceId = serviceMap[rec.serviceName];
    
    if (!serviceId) {
      console.warn(`⚠️ Serviço não encontrado: ${rec.serviceName}`);
    }
    
    return {
      _key: `rec_${index}`,
      priority: rec.priority,
      customProblemDescription: rec.problemDescription,
      customImpactDescription: rec.impactDescription,
      customBenefits: rec.benefits,
      service: {
        _type: 'reference',
        _ref: serviceId || 'service-1' // Fallback para um serviço padrão se não encontrar
      }
    };
  });
  
  // 6. Preparar dados de contexto no formato Portable Text
  const visaoGeralText = contextAnalysisData.visaoGeral || "Análise personalizada para identificar oportunidades de automação em processos de marketing e vendas.";
  
  const contextAnalysis = [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: contextAnalysisData.analiseContexto || "Com base nas informações compartilhadas, identificamos oportunidades significativas para otimização através da automação inteligente."
        }
      ]
    }
  ];
  
  // 7. Gerar ID único para o relatório
  const reportId = generateReportId();
  
  // 8. Criar relatório no Sanity
  console.log('📝 Criando relatório no Sanity');
  const reportData = {
    reportId,
    lead: {
      _type: 'reference',
      _ref: leadId
    },
    reportTitle: `Mini-Auditoria para ${lead.companyName}`,
    summary: visaoGeralText,
    contextAnalysis,
    recommendedServices,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Expira em 30 dias
  };
  
  const reportDoc = await createReport(reportData);
  
  // 9. Atualizar status do lead
  console.log('📝 Atualizando status do lead');
  await updateLead(leadId, {
    status: 'qualified',
    reportGenerated: true,
    report: {
      _type: 'reference',
      _ref: reportDoc.id
    }
  });
  
  console.log('✅ Relatório gerado com sucesso:', reportDoc);
  
  // 10. Retornar dados de sucesso
  return {
    success: true,
    reportId: reportDoc.id,
    reportSlug: reportId,
    reportUrl: `/relatorios/${reportId}`
  };
}