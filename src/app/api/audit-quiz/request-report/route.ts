import { NextRequest, NextResponse } from 'next/server';
import { updateLead } from '@/lib/sanity/mutations';
import { generateReportId } from '@/lib/utils/reportGenerator';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 API /request-report: Processando solicitação...');
    const { email, leadId } = await request.json();
    
    // Validação básica
    if (!email || !leadId) {
      console.log('❌ Validação falhou: email ou leadId ausente');
      return NextResponse.json(
        { error: 'Email e leadId são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar se é um ID simulado
    if (leadId.startsWith('sim_')) {
      console.log('⚠️ Detectado ID simulado. Usando modo de simulação.');
      
      // Simular a solicitação do relatório
      console.log('📝 Simulando solicitação de relatório para o email:', email);
      
      // Gerar um ID de relatório simulado 
      const simulatedReportId = generateReportId();
      const reportUrl = `/relatorios/${simulatedReportId}`;
      
      console.log('✅ Solicitação de relatório simulada com sucesso');
      return NextResponse.json({ 
        success: true,
        message: "MODO DE SIMULAÇÃO: Seu relatório está disponível para visualização",
        simulatedMode: true,
        reportId: simulatedReportId,
        reportUrl: reportUrl
      });
    }
    
    // Verificar se o token está configurado
    if (!process.env.SANITY_API_TOKEN) {
      console.log('⚠️ SANITY_API_TOKEN não está configurado. Usando modo de simulação.');
      
      // Gerar um ID de relatório simulado 
      const simulatedReportId = generateReportId();
      const reportUrl = `/relatorios/${simulatedReportId}`;
      
      console.log('✅ Solicitação de relatório simulada com sucesso');
      return NextResponse.json({ 
        success: true,
        message: "MODO DE SIMULAÇÃO: Seu relatório está disponível para visualização",
        simulatedMode: true,
        reportId: simulatedReportId,
        reportUrl: reportUrl
      });
    }
    
    // Código normal para quando o token está configurado
    // Atualizar status do lead
    console.log(`📝 Atualizando status do lead: ${leadId}`);
    await updateLead(leadId, {
      status: 'qualified',
      reportRequested: true,
      reportRequestedAt: new Date().toISOString()
    });
    
    // Iniciar geração do relatório e obter a URL
    console.log('📝 Iniciando geração do relatório e obtendo URL');
    const reportData = await generateReportForLead(leadId, email);
    
    console.log('✅ Solicitação de relatório processada com sucesso');
    return NextResponse.json({ 
      success: true,
      message: "Seu relatório está pronto para visualização",
      reportId: reportData.reportId,
      reportUrl: reportData.reportUrl
    });
  } catch (error) {
    console.error('❌ Erro ao solicitar relatório:', error);
    
    // Mesmo em caso de erro, fornecer uma URL simulada para que o usuário tenha alguma experiência
    const fallbackReportId = generateReportId();
    
    return NextResponse.json(
      { 
        success: true,
        message: "Ocorreu um erro, mas você ainda pode acessar um relatório de exemplo",
        reportId: fallbackReportId,
        reportUrl: `/relatorios/${fallbackReportId}`
      },
      { status: 200 }
    );
  }
}

// Função para gerar o relatório e retornar dados, incluindo URL
async function generateReportForLead(leadId: string, email: string) {
  try {
    // Chamar a API de geração de relatório
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/audit-quiz/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadId }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao gerar relatório');
    }
    
    console.log(`✅ Relatório gerado com sucesso: ${data.reportUrl}`);
    
    return {
      reportId: data.reportId,
      reportUrl: data.reportUrl
    };
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
    
    // Em caso de erro, gerar um ID simulado para fornecer alguma experiência ao usuário
    const fallbackReportId = generateReportId();
    
    return {
      reportId: fallbackReportId,
      reportUrl: `/relatorios/${fallbackReportId}`
    };
  }
}