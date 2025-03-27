import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/sanity/mutations';
import { getRecommendedService } from '@/lib/matching/serviceRecommender';
import { handleSimulationMode } from '@/lib/utils/simulation'; // Importar helper

export async function POST(request: NextRequest) {
  try {
    console.log('📝 API /audit-quiz/submit: Processando requisição...');
    const data = await request.json();
    console.log('📝 Dados recebidos:', data);

    // Verificar modo de simulação PRIMEIRO (passando dados relevantes se necessário)
    // A API /submit não usa leadId para simulação, apenas a falta do token Sanity
    const simulationResponse = handleSimulationMode({ /* leadId: null */ }); 
    if (simulationResponse) {
      // A API /submit precisa retornar um 'preview' simulado.
      // Vamos ajustar a resposta simulada para incluir isso.
      const simulatedLeadId = 'sim_' + Math.random().toString(36).substring(2, 10);
      const recommendedService = await getRecommendedService(data); // Ainda precisamos disso para o preview
      const preview = {
        leadId: simulatedLeadId,
        email: data.email,
        recommendedService: recommendedService.name,
        problemSolved: recommendedService.problem,
        benefit: recommendedService.benefit,
        additionalServices: 2, // Valor fixo para simulação
        reportRequested: false,
        simulatedMode: true
      };
      // Retorna a resposta JSON original da função handleSimulationMode, mas adiciona o preview
      const originalJsonResponse = await simulationResponse.json();
      return NextResponse.json({
        ...originalJsonResponse,
        preview: preview // Adiciona o preview simulado
      });
    }
    
    // Validação básica (após checar simulação)
    if (!data.name || !data.email || !data.companyName) {
      console.log('❌ Validação falhou: dados incompletos');
      return NextResponse.json(
        { error: 'Dados incompletos. Nome, email e empresa são obrigatórios.' },
        { status: 400 }
      );
    }
    
    // Remover bloco de verificação de token - agora tratado por handleSimulationMode
    // if (!process.env.SANITY_API_TOKEN) { ... }
    
    // Código normal (token está configurado)
    // Criar lead no Sanity
    console.log('📝 Criando lead no Sanity...');
    const leadId = await createLead({
      name: data.name,
      email: data.email,
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      companySite: data.companySite,
      companySize: data.companySize,
      marketingStructure: data.marketingStructure,
      salesTeamSize: data.salesTeamSize,
      clientAcquisitionStrategy: data.clientAcquisitionStrategy,
      usesCRM: data.usesCRM,
      usesAutomation: data.usesAutomation,
      mainChallenge: data.mainChallenge,
      improvementGoal: data.improvementGoal,
      origin: data.origin || 'website_quiz',
      status: 'new'
    });
    console.log('✅ Lead criado com ID:', leadId);
    
    // Gerar serviço recomendado
    console.log('📝 Gerando recomendação de serviço...');
    const recommendedService = await getRecommendedService(data);
    console.log('✅ Serviço recomendado:', recommendedService.name);
    
    // Gerar preview da mini-auditoria
    const preview = {
      leadId,
      email: data.email,
      recommendedService: recommendedService.name,
      problemSolved: recommendedService.problem,
      benefit: recommendedService.benefit,
      additionalServices: 2,
      reportRequested: false
    };
    
    console.log('✅ API /audit-quiz/submit: Processo concluído com sucesso');
    return NextResponse.json({ 
      success: true, 
      preview
    });
  } catch (error) {
    console.error('❌ Erro ao processar quiz:', error);
    
    return NextResponse.json(
      { 
        error: 'Ocorreu um erro ao processar suas respostas. Por favor, tente novamente.',
        details: 'Verifique se o token do Sanity está configurado corretamente. Veja TOKEN_INSTRUCTIONS.md para detalhes.'
      },
      { status: 500 }
    );
  }
}
