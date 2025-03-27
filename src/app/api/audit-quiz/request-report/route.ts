import { NextRequest, NextResponse } from 'next/server';
import { updateLead } from '@/lib/sanity/mutations';
import { generateReportId } from '@/lib/utils/reportGenerator';
// import { v4 as uuidv4 } from 'uuid'; // Removido - não mais necessário
// import { reportStatusService, ReportStatus } from '@/lib/services/reportStatus'; // Removido - não mais necessário
import { sanityClient } from '@/lib/sanity/client'; 
// import { generateReport } from '@/lib/services/reports/reportGenerator'; // Comentado - Geração é iniciada por /api/reports/generate

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
    
    // Remover geração de ID de solicitação - não mais necessário
    // const reportRequestId = uuidv4();
    // console.log('📝 ID de solicitação gerado:', reportRequestId);
    
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
        // reportRequestId: null // Removido
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
        // reportRequestId: null // Removido
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

    // Remover registro de status inicial em memória - não mais necessário
    // const initialStatus: ReportStatus = { ... };
    // reportStatusService.set(reportRequestId, initialStatus);
    // Remover debug do serviço em memória
    // const allStatuses = reportStatusService.debug(); ...

    // A geração do relatório é iniciada pela API /submit -> /generate
    // Esta API apenas marca a solicitação no lead.
    console.log('✅ Solicitação de relatório marcada no lead com sucesso:', leadId);
    return NextResponse.json({
      success: true,
      message: "Solicitação de relatório registrada. A geração já foi iniciada ou ocorrerá em breve."
      // Remover reportRequestId da resposta
    });
  } catch (error) {
    // Ajustar resposta de erro - não retornar URL simulada
    console.error('❌ Erro ao processar solicitação de relatório:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Ocorreu um erro ao registrar sua solicitação de relatório.',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
