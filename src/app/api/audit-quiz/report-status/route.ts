import { NextRequest, NextResponse } from 'next/server';
import { reportStatusService } from '@/lib/services/reportStatus';

export async function GET(request: NextRequest) {
  try {
    // Extrair o reportRequestId da URL
    const { searchParams } = new URL(request.url);
    const reportRequestId = searchParams.get('reportRequestId');
    
    console.log(`📝 API /report-status: Verificando status para requestId: ${reportRequestId}`);
    
    if (!reportRequestId) {
      console.log('❌ ID de solicitação não fornecido');
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de solicitação não fornecido' 
        },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          } 
        }
      );
    }
    
    // Debug: Listar todos os status para depuração
    const allStatuses = reportStatusService.debug();
    console.log(`📊 Status disponíveis: ${allStatuses.length}`);
    allStatuses.forEach(item => {
      console.log(`- ${item.requestId}: ${item.status.status}`);
    });
    
    // Verificar o status no serviço
    const reportStatus = reportStatusService.get(reportRequestId);
    
    if (!reportStatus) {
      console.log('❌ Status não encontrado para o ID fornecido:', reportRequestId);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Status não encontrado ou expirado',
          debug: {
            requestIdReceived: reportRequestId,
            availableIds: allStatuses.map(s => s.requestId)
          }
        },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          } 
        }
      );
    }
    
    // Construir a mensagem adequada ao status
    let statusMessage = '';
    switch (reportStatus.status) {
      case 'processing':
        statusMessage = 'Seu relatório está sendo gerado...';
        break;
      case 'completed':
        statusMessage = 'Seu relatório está pronto!';
        break;
      case 'failed':
        statusMessage = 'Ocorreu um erro ao gerar seu relatório. Por favor, tente novamente.';
        break;
    }
    
    console.log(`📝 Status atual: ${reportStatus.status}, URL: ${reportStatus.reportUrl || 'ainda não disponível'}`);
    
    return NextResponse.json(
      {
        success: true,
        status: reportStatus.status,
        reportUrl: reportStatus.reportUrl,
        message: statusMessage,
        error: reportStatus.error
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
    
  } catch (error) {
    console.error('❌ Erro ao verificar status do relatório:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Falha ao verificar status',
        errorDetails: error instanceof Error ? error.message : String(error)
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        } 
      }
    );
  }
}
