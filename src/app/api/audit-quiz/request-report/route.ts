import { NextRequest, NextResponse } from 'next/server';
import { updateLead } from '@/lib/sanity/mutations';
import { generateReportId } from '@/lib/utils/reportGenerator';
import { v4 as uuidv4 } from 'uuid';
import { reportStatusService, ReportStatus } from '@/lib/services/reportStatus';
import { sanityClient } from '@/lib/sanity/client'; 
import { generateReport } from '@/lib/services/reports/reportGenerator';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 API /request-report: Processando solicitação...');
    const { email: userEmail, leadId } = await request.json();
    
    // Validação básica
    if (!userEmail || !leadId) {
      console.log('❌ Validação falhou: email ou leadId ausente');
      return NextResponse.json(
        { error: 'Email e leadId são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Gerar ID único para esta solicitação
    const reportRequestId = uuidv4();
    console.log('📝 ID de solicitação gerado:', reportRequestId);
    
    // Verificar se é um ID simulado
    if (leadId.startsWith('sim_')) {
      console.log('⚠️ Detectado ID simulado. Usando modo de simulação.');
      
      // Simular a solicitação do relatório
      console.log('📝 Simulando solicitação de relatório para o email:', userEmail);
      
      // Gerar um ID de relatório simulado 
      const simulatedReportId = generateReportId();
      const reportUrl = `/relatorios/${simulatedReportId}`;
      
      console.log('✅ Solicitação de relatório simulada com sucesso');
      return NextResponse.json({ 
        success: true,
        message: "MODO DE SIMULAÇÃO: Seu relatório está disponível para visualização",
        simulatedMode: true,
        reportId: simulatedReportId,
        reportUrl: reportUrl,
        reportRequestId: null // Não precisamos de polling em modo de simulação
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
        reportUrl: reportUrl,
        reportRequestId: null // Não precisamos de polling em modo de simulação
      });
    }
    
    // ADICIONADO: Verificar se já existe um relatório para este lead
    console.log(`📝 Verificando se já existe relatório para lead: ${leadId}`);
    try {
      const existingReport = await sanityClient.fetch(`
        *[_type == "report" && lead._ref == $leadId][0]{
          _id,
          "slug": slug.current
        }
      `, { leadId });
      
      if (existingReport) {
        console.log(`✅ Relatório existente encontrado: ${existingReport._id}`);
        const reportUrl = `/relatorios/${existingReport.slug}`;
        
        return NextResponse.json({
          success: true,
          message: "Relatório já existente recuperado com sucesso",
          reportUrl: reportUrl,
          reportExists: true
        });
      }
    } catch (fetchError) {
      console.log('⚠️ Erro ao verificar relatório existente:', fetchError);
      // Continuar normalmente mesmo se falhar a verificação
    }
    
    // Código normal para quando o token está configurado
    // Atualizar status do lead
    console.log(`📝 Atualizando status do lead: ${leadId}`);
    await updateLead(leadId, {
      status: 'qualified',
      reportRequested: true,
      reportRequestedAt: new Date().toISOString()
    });
    
    // Registrar o status inicial do relatório
    const initialStatus: ReportStatus = {
      status: 'processing',
      startTime: new Date().toISOString(),
      leadId: leadId
    };
    
    reportStatusService.set(reportRequestId, initialStatus);
    
    // Debug: Listar todos os status para depuração
    const allStatuses = reportStatusService.debug();
    console.log(`📊 Status atuais (após adição): ${allStatuses.length}`);
    allStatuses.forEach(item => {
      console.log(`- ${item.requestId}: ${item.status.status}`);
    });
    
    // NOTA: A geração do relatório AGORA será iniciada do cliente,
    // usando o componente ReportStatusIndicator
    console.log('✅ Solicitação de relatório iniciada com sucesso, retornando requestId:', reportRequestId);
    return NextResponse.json({ 
      success: true,
      message: "Seu relatório está sendo gerado",
      reportRequestId: reportRequestId
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
        reportUrl: `/relatorios/${fallbackReportId}`,
        reportRequestId: null // Não precisamos de polling em modo de simulação
      },
      { status: 200 }
    );
  }
}


