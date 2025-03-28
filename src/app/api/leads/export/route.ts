import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';
// @ts-expect-error - Temporarily ignore type resolution issue for groq (expecting an error)
import { groq } from 'next-sanity'; 

// Função auxiliar para validar as credenciais básicas
function validateBasicAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  
  console.log('Auth Header:', authHeader); // Log para depuração
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    console.log('Header ausente ou não inicia com Basic');
    return false;
  }
  
  // Decodificar o header Basic Auth
  // O formato é: "Basic base64(username:password)"
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');
  
  // Validar credenciais com as definidas no .env
  // As credenciais são armazenadas como API_USERNAME e API_PASSWORD
  // Tentamos com e sem o prefixo NEXT_PUBLIC_
  const validUsername = process.env.API_USERNAME || process.env.NEXT_PUBLIC_API_USERNAME;
  const validPassword = process.env.API_PASSWORD || process.env.NEXT_PUBLIC_API_PASSWORD;
  
  console.log('Credenciais recebidas:', username); // Apenas username para segurança
  console.log('Credenciais esperadas:', validUsername);
  console.log('Valores das variáveis de ambiente:', {
    API_USERNAME_SET: !!process.env.API_USERNAME,
    API_PASSWORD_SET: !!process.env.API_PASSWORD,
    NEXT_PUBLIC_API_USERNAME_SET: !!process.env.NEXT_PUBLIC_API_USERNAME,
    NEXT_PUBLIC_API_PASSWORD_SET: !!process.env.NEXT_PUBLIC_API_PASSWORD,
  });
  
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
    const updatedSince = url.searchParams.get('updatedSince'); // Opcional: filtrar por data de atualização
    const includeAnalysis = url.searchParams.get('includeAnalysis') === 'true'; // Opcional: incluir dados de análise completos
    const limit = parseInt(url.searchParams.get('limit') || '1000'); // Limitar número de registros
    
    // Construir a consulta GROQ
    let query = groq`*[_type == "lead"`;
    
    // Adicionar filtro por data de atualização se fornecido
    if (updatedSince) {
      query += ` && (updatedAt > $updatedSince || createdAt > $updatedSince)`;
    }
    
    // Ordenar do mais recente para o mais antigo
    query += `] | order(coalesce(updatedAt, createdAt) desc)[0...${limit}] {
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
    
    // Parâmetros para a consulta
    const params: Record<string, string | number> = { // Use specific types
      limit: limit
    };
    
    if (updatedSince) {
      params.updatedSince = updatedSince;
    }
    
    // Executar a consulta
    const leads = await sanityClient.fetch(query, params);
    
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
      count: leads.length,
      leads: leads
    }), {
      status: 200,
      headers: headers
    });
    
  } catch (error: unknown) {
    console.error('Erro ao exportar leads:', error);
    
    // Preparar mensagem de erro
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorResponse = (error as { response?: { body?: unknown } }).response?.body;
    
    return NextResponse.json({
      success: false,
      message: 'Falha ao buscar leads',
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
