import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

// Endpoint de teste para geração de relatórios - usar apenas em ambiente de desenvolvimento
export async function GET(request: Request) {
  // Verificar se estamos em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, message: 'Endpoint disponível apenas em ambiente de desenvolvimento' }, 
      { status: 403 }
    );
  }

  // Obter o leadId da URL
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('leadId');

  if (!leadId) {
    return NextResponse.json(
      { success: false, message: 'leadId é obrigatório como parâmetro de consulta' }, 
      { status: 400 }
    );
  }

  // Log inicial
  console.log(`🔍 Testando geração de relatório para leadId: ${leadId}`);

  try {
    // 1. Verificar se o lead existe
    const lead = await sanityClient.fetch(
      groq`*[_type == "lead" && _id == $leadId][0]`,
      { leadId }
    );

    if (!lead) {
      return NextResponse.json(
        { success: false, message: `Lead com ID ${leadId} não encontrado` },
        { status: 404 }
      );
    }

    console.log(`✅ Lead encontrado: ${lead._id}`);
    
    // 2. Verificar o status atual do relatório
    const statusInfo = {
      leadId: lead._id,
      name: lead.name,
      companyName: lead.companyName,
      reportStatus: lead.reportStatus || null,
      hasReport: !!lead.report,
      reportId: lead.report ? lead.report._ref : null
    };
    
    console.log(`ℹ️ Status atual:`, statusInfo);

    // 3. Chamar a API de geração
    let generationResult;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId }),
      });
      
      generationResult = await response.json();
      console.log(`✅ Resposta da API:`, generationResult);
    } catch (genError) {
      console.error(`❌ Erro ao chamar API de geração:`, genError);
      generationResult = { 
        error: genError instanceof Error ? genError.message : 'Erro desconhecido',
        success: false
      };
    }

    // 4. Esperar um pouco e verificar o status novamente
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedLead = await sanityClient.fetch(
      groq`*[_type == "lead" && _id == $leadId][0]`,
      { leadId }
    );
    
    const updatedStatus = {
      leadId: updatedLead._id,
      reportStatus: updatedLead.reportStatus || null,
      hasReport: !!updatedLead.report,
      reportId: updatedLead.report ? updatedLead.report._ref : null,
    };
    
    console.log(`ℹ️ Status atualizado:`, updatedStatus);

    // 5. Retornar todas as informações
    return NextResponse.json({
      success: true,
      message: 'Teste de geração de relatório concluído',
      initialStatus: statusInfo,
      generationResult,
      updatedStatus
    });

  } catch (error) {
    console.error(`❌ Erro durante teste de geração:`, error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro ao testar geração de relatório',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }, 
      { status: 500 }
    );
  }
} 