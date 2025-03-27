import { NextRequest, NextResponse } from 'next/server';
import { updateLead } from '@/lib/sanity/mutations';
// import { generateReportId } from '@/lib/utils/reportGenerator'; // Não mais necessário aqui
// import { v4 as uuidv4 } from 'uuid'; // Removido
// import { reportStatusService, ReportStatus } from '@/lib/services/reportStatus'; // Removido
import { sanityClient } from '@/lib/sanity/client'; 
// import { generateReport } from '@/lib/services/reports/reportGenerator'; // Comentado
import { handleSimulationMode } from '@/lib/utils/simulation'; // Importar helper

export async function POST(request: NextRequest) {
  try {
    console.log('📝 API /request-report: Processando solicitação...');
    const { email: userEmail, leadId } = await request.json();

    // Verificar modo de simulação PRIMEIRO
    const simulationResponse = handleSimulationMode({ leadId });
    if (simulationResponse) {
      return simulationResponse;
    }

    // Validação básica (após checar simulação)
    if (!userEmail || !leadId) {
      console.log('❌ Validação falhou: email ou leadId ausente');
      return NextResponse.json(
        { error: 'Email e leadId são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Remover blocos de verificação de simulação - agora tratados por handleSimulationMode
    // if (leadId.startsWith('sim_')) { ... }
    // if (!process.env.SANITY_API_TOKEN) { ... }

    // Verificar se já existe um relatório para este lead (lógica mantida)
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
