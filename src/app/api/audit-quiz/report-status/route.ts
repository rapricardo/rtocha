import { NextRequest, NextResponse } from 'next/server';
// import { reportStatusService } from '@/lib/services/reportStatus'; // Removido
import { sanityClient } from '@/lib/sanity/client';
// @ts-ignore - Temporarily ignore type resolution issue for groq
import { groq } from 'next-sanity'; // Reverted back again

// Headers comuns para desabilitar cache
const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export async function GET(request: NextRequest) {
  try {
    // Extrair o leadId da URL
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    
    console.log(`📝 API /report-status: Verificando status para leadId: ${leadId}`);
    
    if (!leadId) {
      console.log('❌ leadId não fornecido');
      return NextResponse.json(
        { success: false, error: 'leadId não fornecido' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    
    // Verificar diretamente no Sanity o status do lead e se há relatório associado
    console.log(`📝 Buscando status e relatório para leadId: ${leadId}`);
    
    const leadData = await sanityClient.fetch(groq`
      *[_type == "lead" && _id == $leadId][0]{
        _id,
        reportStatus,
        report->{
          _id,
          "slug": slug.current,
          reportId
        }
      }
    `, { leadId });
    
    if (!leadData) {
      console.log(`❌ Lead não encontrado: ${leadId}`);
      return NextResponse.json(
        { success: false, error: 'Lead não encontrado' },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }
    
    const reportStatus = leadData.reportStatus || { status: 'queued', message: 'Aguardando processamento' };
    const associatedReport = leadData.report;
    
    console.log(`📝 Status do lead: ${reportStatus.status}, Relatório associado: ${associatedReport ? associatedReport._id : 'Nenhum'}`);
    
    // Construir a resposta com base no status do Sanity
    let responsePayload: {
      success: boolean;
      status: string;
      message: string;
      reportUrl?: string;
      error?: string;
    } = {
      success: true,
      status: reportStatus.status,
      message: reportStatus.message || 'Status desconhecido'
    };
    
    // Se o status for 'completed', adicionar a URL do relatório
    if (reportStatus.status === 'completed' && associatedReport) {
      responsePayload.reportUrl = `/relatorios/${associatedReport.slug || associatedReport.reportId}`;
      responsePayload.message = 'Seu relatório está pronto!';
    } else if (reportStatus.status === 'failed') {
      responsePayload.error = reportStatus.message || 'Falha na geração do relatório';
    }
    
    console.log(`✅ Retornando status: ${responsePayload.status}`);
    
    return NextResponse.json(responsePayload, { headers: NO_CACHE_HEADERS });
    
  } catch (error) {
    console.error('❌ Erro ao verificar status do relatório:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Falha ao verificar status do relatório',
        errorDetails: error instanceof Error ? error.message : String(error)
      },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
