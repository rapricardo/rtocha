import { NextRequest, NextResponse } from 'next/server';
import { generateReport } from '@/lib/services/reports/reportGenerator';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 API /generate-report: Iniciando geração de relatório...');
    const { leadId } = await request.json();
    
    if (!leadId) {
      return NextResponse.json(
        { error: 'ID do lead é obrigatório' },
        { status: 400 }
      );
    }
    
    // 1. Verificar se já existe um relatório para este lead
    // (esta verificação já é feita dentro do generateReport, mas fazemos aqui de novo para garantir)
    // Chamada para o serviço que contém a lógica de geração de relatório
    // Esta API agora é chamada diretamente do cliente, então é BLOQUEANTE
    // IMPORTANTE: Em um ambiente serverless como a Vercel, é crucial retornar uma resposta
    // antes do timeout (normalmente 10-60 segundos)
    const result = await generateReport(leadId);
    
    console.log('✅ Relatório gerado com sucesso:', result);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
    
    return NextResponse.json(
      { error: 'Ocorreu um erro ao gerar o relatório. Por favor, tente novamente.' },
      { status: 500 }
    );
  }
}