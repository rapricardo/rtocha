import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest
import { sanityClient } from '@/lib/sanity/client';
// @ts-expect-error - Temporarily ignore type resolution issue for groq (expecting an error)
import { groq } from 'next-sanity';
import { generatePersonalizedRecommendations, generateContextAnalysis } from '@/lib/ai/gemini';
import { updateLead } from '@/lib/sanity/mutations';
import { generateReportId } from '@/lib/utils/reportGenerator';
import { ServiceData, Recommendation, LeadData, ReportData, PortableTextBlock, SanityReference } from '@/lib/types'; // Added types

const SECRET_TOKEN = process.env.INTERNAL_API_SECRET; // Ler o token

// --- Helper Functions ---

/**
 * Fetches lead data and checks for existing reports.
 * Throws an error if lead not found or fetch fails.
 * Returns null if report already exists, otherwise returns lead data.
 */
async function fetchLeadForReport(leadId: string): Promise<LeadData | null> {
  console.log(`[generateReportAsync] STEP 1.1: Buscando dados do lead ${leadId}...`);
  try {
    // Fetch lead data including a potential reference to an existing report
    const lead = await sanityClient.fetch<LeadData & { report?: SanityReference }>(
      groq`*[_type == "lead" && _id == $leadId][0]{
        ...,
        "report": report->{_id} // Fetch only the ID of the referenced report
      }`,
      { leadId }
    );

    if (!lead) {
      // Use updateReportStatus directly here for immediate feedback if lead not found
      await updateReportStatus(
        leadId,
        'failed',
        'Lead não encontrado no banco de dados'
      );
      // Throw error to stop the process in generateReportAsync's main try block
      throw new Error(`Lead ${leadId} não encontrado no banco de dados`);
    }
    console.log(`[generateReportAsync] STEP 1.2: Dados do lead encontrados.`);

    // Check if report already exists using the fetched reference
    if (lead.report?._ref) {
      console.log(`ℹ️ Lead ${leadId} já possui um relatório associado: ${lead.report._ref}`);
      // Update status to completed, indicating the existing report is the result
      await updateReportStatus(
        leadId,
        'completed',
        'Relatório já existente recuperado com sucesso'
      );
      return null; // Indicate report already exists, stopping further generation
    }
    // No existing report found, return the lead data
    console.log(`[generateReportAsync] STEP 1.3: Nenhum relatório existente encontrado. Prosseguindo.`);
    return lead;
  } catch (fetchError) {
    console.error(`❌ [generateReportAsync] Erro em fetchLeadForReport: ${fetchError}`);
    // Update status to failed before throwing (already done in original code)
    await updateReportStatus(
      leadId,
      'failed',
      `Erro ao buscar dados do lead: ${fetchError instanceof Error ? fetchError.message : 'Erro desconhecido'}`
    );
    // Re-throw error to be caught by the main try/catch in generateReportAsync
    throw new Error(`Erro ao buscar dados do lead: ${fetchError instanceof Error ? fetchError.message : 'Erro desconhecido'}`);
  }
}


/**
 * Fetches available services from Sanity.
 * Throws an error if fetch fails or no services are found.
 */
async function fetchServicesForReport(): Promise<ServiceData[]> {
  console.log('[generateReportAsync] STEP 2.1: Buscando serviços disponíveis...');
  const services = await sanityClient.fetch<ServiceData[]>(groq`*[_type == "service"]{
    _id,
    name,
    shortDescription,
    problemsSolved,
    forCompanySize,
    forDigitalMaturity,
    forMainChallenges,
    forImprovementGoals,
    priority
  }`);

  if (!services || services.length === 0) {
    throw new Error('Nenhum serviço disponível para recomendação');
  }
  console.log(`[generateReportAsync] STEP 2.2: Encontrados ${services.length} serviços.`);
  return services;
}

/**
 * Generates AI content (recommendations and context analysis).
 * Throws an error if AI generation fails.
 */
async function generateAIContent(lead: LeadData, services: ServiceData[]): Promise<{ recommendations: Recommendation[]; contextAnalysisData: { visaoGeral: string; analiseContexto: string; } }> {
  console.log('[generateReportAsync] STEP 3.1: Iniciando geração de conteúdo AI em paralelo...');

  // Start both AI calls concurrently
  const recommendationsPromise = generatePersonalizedRecommendations(lead, services);
  const contextAnalysisPromise = generateContextAnalysis(lead);

  // Wait for both promises to resolve
  const [recommendationsResult, contextAnalysisData] = await Promise.all([
    recommendationsPromise,
    contextAnalysisPromise
  ]);

  // Validate results
  if (!recommendationsResult || !recommendationsResult.recommendations) {
    // Even if recommendations fail, context might succeed, but we need both for a full report.
    // Consider if partial report generation is desired or if failure is better.
    // For now, throwing error if recommendations fail.
    throw new Error('Falha ao gerar recomendações personalizadas');
  }
  console.log(`[generateReportAsync] STEP 3.2: Recomendações geradas (${recommendationsResult.recommendations.length}).`);

  if (!contextAnalysisData || !contextAnalysisData.visaoGeral || !contextAnalysisData.analiseContexto) {
     // Check for empty results from context analysis as well
    throw new Error('Falha ao gerar análise de contexto (resultado vazio ou inválido)');
  }
  console.log('[generateReportAsync] STEP 3.3: Análise de contexto gerada.');

  // Return combined results
  return { recommendations: recommendationsResult.recommendations, contextAnalysisData };
}

/**
 * Prepares the report data structure for Sanity.
 */
function prepareReportData(lead: LeadData, aiContent: { recommendations: Recommendation[]; contextAnalysisData: { visaoGeral: string; analiseContexto: string; } }, services: ServiceData[]): Omit<ReportData, '_id' | 'createdAt' | 'views' | 'lastViewedAt' | 'callToActionClicked'> {
  console.log('[generateReportAsync] STEP 4.1: Estruturando dados para o relatório...');
  const serviceMap = Object.fromEntries(
    services.map((service) => [service.name, service._id])
  );

  const recommendedServices = aiContent.recommendations.map((rec, index) => {
    const serviceId = serviceMap[rec.serviceName];
    if (!serviceId) {
      console.warn(`⚠️ Serviço não encontrado: ${rec.serviceName}. Usando fallback.`);
    }
    // Ensure fallback service ID exists or handle appropriately
    const fallbackServiceId = services[0]?._id;
    if (!serviceId && !fallbackServiceId) {
        console.error("❌ Nenhum serviço encontrado para usar como fallback.");
        // Decide how to handle this - throw error, use a placeholder, etc.
        // For now, let's throw an error to make it explicit
        throw new Error(`Serviço "${rec.serviceName}" não encontrado e nenhum serviço de fallback disponível.`);
    }
    return {
      _key: `rec_${index}`,
      priority: rec.priority,
      customProblemDescription: rec.problemDescription,
      customImpactDescription: rec.impactDescription,
      customBenefits: rec.benefits,
      service: {
        _type: 'reference',
        _ref: serviceId || fallbackServiceId! // Use non-null assertion for fallback if guaranteed
      }
    };
  });

  const visaoGeralText = aiContent.contextAnalysisData.visaoGeral ||
    "Análise personalizada para identificar oportunidades de automação em processos de marketing e vendas.";

  const contextAnalysis: PortableTextBlock[] = [
    {
      _key: `block_${Date.now()}`, // Use a more unique key
      _type: 'block',
      style: 'normal',
      children: [
        {
          _key: `span_${Date.now() + 1}`, // Use a more unique key
          _type: 'span',
          marks: [],
          text: aiContent.contextAnalysisData.analiseContexto ||
            "Com base nas informações compartilhadas, identificamos oportunidades significativas para otimização através da automação inteligente."
        }
      ]
    }
  ];

  const reportId = generateReportId();
  console.log(`[generateReportAsync] STEP 4.2: ID do relatório gerado: ${reportId}`);

  // Ensure lead._id exists before creating reference
  if (!lead._id) {
    throw new Error("ID do Lead é indefinido ao preparar dados do relatório.");
  }

  return {
    reportId: reportId,
    lead: { _type: 'reference', _ref: lead._id },
    reportTitle: `Mini-Auditoria para ${lead.companyName || lead.name || 'Sua Empresa'}`,
    summary: visaoGeralText,
    contextAnalysis: contextAnalysis,
    recommendedServices: recommendedServices,
    slug: {
      _type: 'slug',
      current: reportId
    },
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Expira em 30 dias
  };
}

/**
 * Creates the report document in Sanity and associates it with the lead.
 * Throws an error if creation or update fails.
 */
async function saveReportAndAssociate(leadId: string, reportData: Omit<ReportData, '_id' | 'createdAt' | 'views' | 'lastViewedAt' | 'callToActionClicked'>): Promise<void> {
  console.log('[generateReportAsync] STEP 5.1: Criando documento de relatório no Sanity...');
  const report = await sanityClient.create({
    _type: 'report',
    ...reportData,
    createdAt: new Date().toISOString(),
    views: 0
  });
  console.log(`[generateReportAsync] STEP 5.2: Documento de relatório criado com ID: ${report._id}`);

  console.log('[generateReportAsync] STEP 5.3: Associando relatório ao lead...');
  await updateLead(leadId, {
    status: 'qualified', // Consider if status should always be qualified here
    reportGenerated: true,
    report: {
      _type: 'reference',
      _ref: report._id
    }
  });
  console.log('[generateReportAsync] STEP 5.4: Relatório associado ao lead com sucesso.');
}


// --- Main Async Generation Function (Refactored) ---

async function generateReportAsync(leadId: string) {
  const MAX_ATTEMPTS = 3;
  let attempt = 0;
  let success = false;
  let lastError: Error | null = null;

  console.log(`🚀 [generateReportAsync] Iniciando para lead: ${leadId} (máx ${MAX_ATTEMPTS} tentativas)`);

  try {
    console.log(`[generateReportAsync] Verificando tokens... Sanity: ${!!process.env.SANITY_API_TOKEN}, Google AI: ${!!process.env.GOOGLE_AI_API_KEY}`);

    // Set initial status
    await updateReportStatus(leadId, 'processing', 'Iniciando a geração do relatório...');
    console.log(`[generateReportAsync] Status inicial definido para 'processing'.`);

    // 1. Fetch Lead (includes check for existing report)
    // If fetchLeadForReport returns null, it means report exists or lead not found,
    // and status was already updated inside the helper. We can just return.
    const lead = await fetchLeadForReport(leadId);
    if (lead === null) {
      return;
    }

    // 2. Fetch Services (only if lead fetch was successful and no report exists)
    const services = await fetchServicesForReport();

    // 3. Generation Loop with Retries
    while (attempt < MAX_ATTEMPTS && !success) {
      attempt++;
      console.log(`[generateReportAsync] Iniciando tentativa ${attempt}/${MAX_ATTEMPTS}...`);
      try {
        await updateReportStatus(leadId, 'processing', `Gerando conteúdo (tentativa ${attempt}/${MAX_ATTEMPTS})...`, 1); 

        // 3.1 Generate AI Content
        const aiContent = await generateAIContent(lead, services);

        // 3.2 Prepare Report Data
        const reportData = prepareReportData(lead, aiContent, services);

        // 3.3 Save Report and Associate
        await saveReportAndAssociate(leadId, reportData);

        // 3.4 Final Status Update
        await updateReportStatus(leadId, 'completed', 'Relatório gerado com sucesso');
        console.log(`✅ [generateReportAsync] SUCESSO na tentativa ${attempt} para lead ${leadId}`);
        success = true; // Mark as success to exit loop

      } catch (error) {
        console.error(`❌ [generateReportAsync] Erro na tentativa ${attempt}/${MAX_ATTEMPTS}:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));

        // Wait before next attempt (exponential backoff)
        if (attempt < MAX_ATTEMPTS) {
          const backoffTime = Math.min(1000 * 2 ** attempt, 10000); // Max 10 seconds
          console.log(`⏱️ Aguardando ${backoffTime}ms antes da próxima tentativa`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    }

    // 4. Handle Final Failure (if loop finished without success)
    if (!success) {
      const errorMessage = `Falha ao gerar relatório após ${MAX_ATTEMPTS} tentativas. Último erro: ${lastError?.message.substring(0, 150)}`;
      console.error(`❌ [generateReportAsync] FALHA FINAL para lead ${leadId}: ${errorMessage}`);
      await updateReportStatus(
        leadId,
        'failed',
        errorMessage
      );
      // TODO: Implementar notificação para equipe sobre falha na geração
      console.log(`[generateReportAsync] Notificação TODO: Falha ao gerar relatório para ${leadId}`);
    }

  } catch (error) { // Catch errors from initial steps (fetchLead, fetchServices) or status updates
    console.error(`❌ [generateReportAsync] Erro fatal (fora do loop de tentativas) para lead ${leadId}:`, error);
    // Attempt to update status to failed, but don't crash if this also fails
    try {
      await updateReportStatus(
        leadId,
        'failed',
        `Erro crítico no processo: ${error instanceof Error ? error.message.substring(0, 150) : 'Erro desconhecido'}`
      );
    } catch (statusError) {
      console.error('❌ Não foi possível atualizar o status final para falha:', statusError);
    }
  }
}

// --- API Endpoint ---

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Secret Token
    console.log(`🔑 [generate/route.ts] Checking token. Env var defined: ${!!SECRET_TOKEN}`); // Log if env var is read
    const authorizationHeader = request.headers.get('Authorization');
    const receivedToken = authorizationHeader?.split('Bearer ')[1];
    console.log(`🔑 [generate/route.ts] Received header: ${authorizationHeader ? authorizationHeader.substring(0, 15) + '...' : 'None'}`); // Log received header (partially)
    console.log(`🔑 [generate/route.ts] Received token: ${receivedToken ? receivedToken.substring(0, 5) + '...' : 'None'}`); // Log received token (partially)

    if (!SECRET_TOKEN || receivedToken !== SECRET_TOKEN) {
      console.warn(`⚠️ [generate/route.ts] Token mismatch or missing. Expected: ${SECRET_TOKEN ? SECRET_TOKEN.substring(0,5)+'...' : 'None'}, Received: ${receivedToken ? receivedToken.substring(0,5)+'...' : 'None'}`);
      return NextResponse.json(
        { success: false, message: 'Acesso não autorizado' },
        { status: 403 } // Forbidden
      );
    }

    // 2. Get leadId and validate
    const { leadId } = await request.json();
    if (!leadId) {
      return NextResponse.json(
        { success: false, message: 'ID do lead não fornecido' },
        { status: 400 }
      );
    }

    console.log(`🚀 API /generate: Recebida solicitação para lead: ${leadId}`);

    // 3. Trigger async generation (fire and forget)
    // No await here - we want to respond immediately
    generateReportAsync(leadId).catch(error => {
      // Log errors from the async process, but don't let them crash the API response
      console.error(`❌ Erro não capturado na geração assíncrona para lead ${leadId}:`, error);
    });

    // 4. Respond immediately
    return NextResponse.json({
      success: true,
      message: 'Geração de relatório iniciada com sucesso',
      leadId
    });
  } catch (error) {
    console.error('❌ Erro ao processar requisição de geração de relatório:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao iniciar geração de relatório',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}


// --- Status Update Function (Keep as is, but ensure it's robust) ---
async function updateReportStatus(leadId: string, status: string, message: string, attemptIncrement = 0) {
  const now = new Date().toISOString();
  const query = groq`*[_type == "lead" && _id == $leadId][0].reportStatus.attempts`;
  let currentAttempts = 0;
  try {
    // Fetch current attempts only if we are incrementing
    if (attemptIncrement > 0) {
        const leadStatus = await sanityClient.fetch<{ attempts: number | null } | null>(query, { leadId });
        currentAttempts = leadStatus?.attempts ?? 0;
    }
  } catch (error) {
    console.warn(`⚠️ Não foi possível buscar o número atual de tentativas para lead ${leadId}:`, error);
    // Continue even if fetching attempts fails, default to 0
  }
  const attempts = currentAttempts + attemptIncrement;

  try {
    await sanityClient
      .patch(leadId)
      .set({
        reportStatus: {
          _type: 'reportStatus', // Ensure _type is set if it's an object type in schema
          status,
          message: message.substring(0, 200), // Truncate message if too long
          updatedAt: now,
          attempts
        },
        updatedAt: now // Also update the main updatedAt for the lead
      })
      .commit({ visibility: 'async' }); // Use async visibility for potentially faster commit
     console.log(`✅ Status do lead ${leadId} atualizado para: ${status}`);
  } catch (error) {
     console.error(`❌ Falha ao atualizar status para lead ${leadId}:`, error);
     // Consider re-throwing or handling this error if status update is critical
  }
}
