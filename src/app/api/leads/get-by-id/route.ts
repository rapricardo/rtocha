import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

// Função auxiliar para validar as credenciais básicas
function validateBasicAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  
  // Decodificar o header Basic Auth
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');
  
  // Validar credenciais com as definidas no .env
  const validUsername = process.env.API_USERNAME || process.env.NEXT_PUBLIC_API_USERNAME;
  const validPassword = process.env.API_PASSWORD || process.env.NEXT_PUBLIC_API_PASSWORD;
  
  return username === validUsername && password === validPassword;
}

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    if (!validateBasicAuth(req)) {
      return new NextResponse(JSON.stringify({ 
        error: 'Unauthorized' 
      }), { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Basic realm="Secure Area"'
        }
      });
    }
    
    // Obter parâmetros da requisição
    const url = new URL(req.url);
    const leadId = url.searchParams.get('id');
    const includeAnalysis = url.searchParams.get('includeAnalysis') === 'true';
    
    // Verificar se o ID foi fornecido
    if (!leadId) {
      return NextResponse.json({
        success: false,
        message: 'ID do lead não fornecido',
        error: 'Missing lead ID'
      }, { status: 400 });
    }
    
    // Construir a consulta GROQ
    let query = groq`*[_type == "lead" && _id == $leadId][0] {
      _id,
      name,
      email,
      companyName,
      jobTitle,
      companySite,
      companySize,
      marketingStructure,
      salesTeamSize,
      clientAcquisitionStrategy,
      usesCRM,
      usesAutomation,
      mainChallenge,
      mainChallengeDescription,
      improvementGoal,
      maturidadeDigital,
      industry,
      status,
      origin,
      auditSummary,
      reportGenerated,
      reportRequested,
      reportRequestedAt,
      reportAccessedAt,
      createdAt,
      updatedAt,
      phone,
      whatsapp,
      linkedInUrl,
      "reportRef": report->_id,
      "reportStatus": reportStatus.status,`;
    
    // Opcionalmente incluir dados mais pesados de análise
    if (includeAnalysis) {
      query += `
      customImagesUrls,
      companyAnalysis,`;
    }
    
    // Incluir serviços recomendados
    query += `
      "recommendedServices": recommendedServices[]->{
        _id,
        name,
        "slug": slug.current,
        shortDescription,
        priority
      }
    }`;
    
    // Executar a consulta
    const lead = await sanityClient.fetch(query, { leadId });
    
    // Verificar se o lead foi encontrado
    if (!lead) {
      return NextResponse.json({
        success: false,
        message: 'Lead não encontrado',
        error: 'Lead not found'
      }, { status: 404 });
    }
    
    // Adicionar cache-control para evitar cache em ambientes de produção
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    return new NextResponse(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      lead: lead
    }), {
      status: 200,
      headers: headers
    });
    
  } catch (error: unknown) {
    console.error('Erro ao buscar lead:', error);
    
    // Preparar mensagem de erro
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorResponse = (error as { response?: { body?: unknown } }).response?.body;
    
    return NextResponse.json({
      success: false,
      message: 'Falha ao buscar lead',
      error: errorMessage,
      details: errorResponse || 'Sem detalhes adicionais'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  }
}