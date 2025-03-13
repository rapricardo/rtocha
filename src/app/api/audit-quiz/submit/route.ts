import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/sanity/mutations';
import { getRecommendedService } from '@/lib/matching/serviceRecommender';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 API /audit-quiz/submit: Processando requisição...');
    const data = await request.json();
    console.log('📝 Dados recebidos:', data);
    
    // Validação básica
    if (!data.name || !data.email || !data.companyName) {
      console.log('❌ Validação falhou: dados incompletos');
      return NextResponse.json(
        { error: 'Dados incompletos. Nome, email e empresa são obrigatórios.' },
        { status: 400 }
      );
    }
    
    // Verificar se o token está configurado
    if (!process.env.SANITY_API_TOKEN) {
      console.log('⚠️ SANITY_API_TOKEN não está configurado. Usando modo de simulação.');
      
      // Simular a criação do lead (modo de demonstração quando o token não está configurado)
      console.log('📝 Simulando criação de lead com dados:', data);
      
      // Gerar ID simulado
      const simulatedLeadId = 'sim_' + Math.random().toString(36).substring(2, 10);
      console.log('✅ Lead simulado criado com ID:', simulatedLeadId);
      
      // Gerar serviço recomendado
      console.log('📝 Gerando recomendação de serviço...');
      const recommendedService = await getRecommendedService(data);
      console.log('✅ Serviço recomendado:', recommendedService.name);
      
      // Gerar preview da mini-auditoria
      const preview = {
        leadId: simulatedLeadId,
        email: data.email,
        recommendedService: recommendedService.name,
        problemSolved: recommendedService.problem,
        benefit: recommendedService.benefit,
        additionalServices: 2,
        reportRequested: false,
        simulatedMode: true
      };
      
      console.log('✅ API /audit-quiz/submit: Processo simulado concluído com sucesso');
      return NextResponse.json({ 
        success: true, 
        preview,
        message: 'MODO DE SIMULAÇÃO: Token do Sanity não configurado. Os dados não foram salvos.'
      });
    }
    
    // Código normal para quando o token está configurado
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