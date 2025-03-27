import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest
import { sanityClient } from '@/lib/sanity/client';
// @ts-ignore - Temporarily ignore type resolution issue for groq
import { groq } from 'next-sanity'; 
import { generatePersonalizedRecommendations, generateContextAnalysis } from '@/lib/ai/gemini';
import { updateLead } from '@/lib/sanity/mutations';
import { generateReportId } from '@/lib/utils/reportGenerator';
import { ServiceData, Recommendation } from '@/lib/types';

const SECRET_TOKEN = process.env.INTERNAL_API_SECRET; // Ler o token

// Endpoint de API para geração assíncrona de relatórios
export async function POST(request: NextRequest) { // Usar NextRequest
  try {
    // 1. Verificar o Secret Token
    const authorizationHeader = request.headers.get('Authorization');
    const receivedToken = authorizationHeader?.split('Bearer ')[1];

    if (!SECRET_TOKEN || receivedToken !== SECRET_TOKEN) {
      console.warn('⚠️ Tentativa de acesso não autorizado à API /generate');
      return NextResponse.json(
        { success: false, message: 'Acesso não autorizado' },
        { status: 403 } // Forbidden
      );
    }

    // 2. Continuar com a lógica existente...
    const { leadId } = await request.json();

    if (!leadId) {
      return NextResponse.json(
        { success: false, message: 'ID do lead não fornecido' }, 
        { status: 400 }
      );
    }

    console.log(`🚀 Iniciando processamento assíncrono de relatório para lead: ${leadId}`);

    // Iniciamos o processo de geração em background e não esperamos sua conclusão
    // para responder rapidamente à requisição
    generateReportAsync(leadId).catch(error => {
      console.error(`❌ Erro na geração assíncrona para lead ${leadId}:`, error);
    });
    
    // Retornamos imediatamente com uma resposta de sucesso
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

// Função para atualizar o status do relatório no Sanity
async function updateReportStatus(leadId: string, status: string, message: string, attemptIncrement = 0) {
  const now = new Date().toISOString();
  
  // Busca o número atual de tentativas (se existir)
  const query = groq`*[_type == "lead" && _id == $leadId][0].reportStatus.attempts`;
  let currentAttempts = 0;
  
  try {
    const result = await sanityClient.fetch(query, { leadId });
    if (typeof result === 'number') {
      currentAttempts = result;
    }
  } catch (error) {
    console.warn('⚠️ Não foi possível buscar o número atual de tentativas');
  }

  // Calcula o novo número de tentativas
  const attempts = currentAttempts + attemptIncrement;
  
  return sanityClient
    .patch(leadId)
    .set({
      reportStatus: {
        status,
        message,
        updatedAt: now,
        attempts
      },
      updatedAt: now
    })
    .commit();
}

// Função assíncrona para geração do relatório
// Esta função é executada em background e não bloqueia a resposta da API
async function generateReportAsync(leadId: string) {
  const MAX_ATTEMPTS = 3;
  console.log(`🚀 generateReportAsync: Iniciando geração para lead: ${leadId} (máximo ${MAX_ATTEMPTS} tentativas)`);
  
  try {
    console.log('🔑 Verificando token Sanity:', !!process.env.SANITY_API_TOKEN ? 'Disponível' : 'Não disponível');
    console.log('🔑 Verificando token Google AI:', !!process.env.GOOGLE_AI_API_KEY ? 'Disponível' : 'Não disponível');

    // 1. Atualizar o status para "processando"
    await updateReportStatus(
      leadId, 
      'processing', 
      'Iniciando a geração do relatório...'
    );
    console.log(`✅ Status atualizado para "processing" para lead ${leadId}`);

    // 2. Buscar dados do lead
    let lead;
    try {
      console.log(`🔍 Buscando dados do lead ${leadId}...`);
      lead = await sanityClient.fetch(
        groq`*[_type == "lead" && _id == $leadId][0]`,
        { leadId }
      );
      
      console.log(`🔍 Dados do lead encontrados:`, lead ? 'Sim' : 'Não');

      if (!lead) {
        console.log(`❌ Lead ${leadId} não encontrado no banco de dados`);
        await updateReportStatus(
          leadId, 
          'failed', 
          'Lead não encontrado no banco de dados'
        );
        return;
      }

      // 3. Verificar se já existe um relatório para este lead
      if (lead.report) {
        console.log(`ℹ️ Lead ${leadId} já possui um relatório associado:`, lead.report);
        await updateReportStatus(
          leadId, 
          'completed', 
          'Relatório já existente recuperado com sucesso'
        );
        return;
      }
    } catch (fetchError) {
      console.error(`❌ Erro ao buscar dados do lead: ${fetchError}`);
      await updateReportStatus(
        leadId, 
        'failed', 
        `Erro ao buscar dados do lead: ${fetchError instanceof Error ? fetchError.message : 'Erro desconhecido'}`
      );
      return;
    }

    // 4. Iniciar geração - Com até MAX_ATTEMPTS tentativas
    let attempt = 0;
    let success = false;
    let lastError = null;

    while (attempt < MAX_ATTEMPTS && !success) {
      attempt++;
      
      try {
        await updateReportStatus(
          leadId, 
          'processing', 
          `Gerando relatório (tentativa ${attempt}/${MAX_ATTEMPTS})...`,
          1 // Incrementar o contador de tentativas
        );

        console.log(`🔄 Tentativa ${attempt}/${MAX_ATTEMPTS} de gerar relatório para o lead ${leadId}`);
        
        // 5. PARTE REAL DE GERAÇÃO DO RELATÓRIO
        
        // 5.1 Buscar serviços disponíveis
        console.log('📝 Buscando serviços disponíveis');
        const services = await sanityClient.fetch(`*[_type == "service"]{
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
        
        console.log(`📊 Encontrados ${services.length} serviços disponíveis`);
        
        // 5.2 Gerar recomendações personalizadas com o Gemini
        console.log('🧠 Gerando recomendações personalizadas com Gemini');
        const recommendations = await generatePersonalizedRecommendations(lead, services);
        
        if (!recommendations || !recommendations.recommendations) {
          throw new Error('Falha ao gerar recomendações personalizadas');
        }
        
        console.log(`✅ Geradas ${recommendations.recommendations.length} recomendações`);
        
        // 5.3 Gerar análise de contexto
        console.log('🧠 Gerando análise de contexto');
        const contextAnalysisData = await generateContextAnalysis(lead);
        
        if (!contextAnalysisData) {
          throw new Error('Falha ao gerar análise de contexto');
        }
        
        console.log('✅ Análise de contexto gerada com sucesso');
        
        // 5.4 Mapear os nomes dos serviços para IDs e referências
        console.log('📝 Estruturando dados para o relatório');
        const serviceMap = Object.fromEntries(
          services.map((service: ServiceData) => [service.name, service._id])
        );
        
        const recommendedServices = recommendations.recommendations.map((rec: Recommendation, index: number) => {
          // Encontrar o ID do serviço pelo nome
          const serviceId = serviceMap[rec.serviceName];
          
          if (!serviceId) {
            console.warn(`⚠️ Serviço não encontrado: ${rec.serviceName}`);
          }
          
          return {
            _key: `rec_${index}`,
            priority: rec.priority,
            customProblemDescription: rec.problemDescription,
            customImpactDescription: rec.impactDescription,
            customBenefits: rec.benefits,
            service: {
              _type: 'reference',
              _ref: serviceId || 'service-1' // Fallback para um serviço padrão se não encontrar
            }
          };
        });
        
        // 5.5 Preparar dados de contexto no formato Portable Text
        const visaoGeralText = contextAnalysisData.visaoGeral || 
          "Análise personalizada para identificar oportunidades de automação em processos de marketing e vendas.";
        
        const contextAnalysis = [
          {
            _key: 'block_0',
            _type: 'block',
            style: 'normal',
            children: [
              {
                _key: 'span_0',
                _type: 'span',
                marks: [],
                text: contextAnalysisData.analiseContexto || 
                  "Com base nas informações compartilhadas, identificamos oportunidades significativas para otimização através da automação inteligente."
              }
            ]
          }
        ];
        
        // 5.6 Gerar ID único para o relatório
        const reportId = generateReportId();
        console.log(`📝 ID do relatório gerado: ${reportId}`);
        
        // 5.7 Criar relatório no Sanity
        console.log('💾 Criando documento de relatório no Sanity');
        const report = await sanityClient.create({
          _type: 'report',
          reportId: reportId,
          lead: { _type: 'reference', _ref: leadId },
          reportTitle: `Mini-Auditoria para ${lead.companyName || lead.name || 'Sua Empresa'}`,
          summary: visaoGeralText,
          contextAnalysis: contextAnalysis,
          recommendedServices: recommendedServices,
          slug: {
            _type: 'slug',
            current: reportId
          },
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Expira em 30 dias
          createdAt: new Date().toISOString(),
          views: 0
        });
        
        console.log('✅ Documento de relatório criado com ID:', report._id);

        // 5.8 Associar o relatório ao lead e atualizar status
        console.log('🔄 Associando relatório ao lead...');
        await updateLead(leadId, {
          status: 'qualified',
          reportGenerated: true,
          report: { 
            _type: 'reference', 
            _ref: report._id 
          }
        });
        
        console.log('✅ Relatório associado ao lead com sucesso');

        // 5.9 Atualizar status final
        await updateReportStatus(
          leadId, 
          'completed', 
          'Relatório gerado com sucesso'
        );

        console.log(`✅ Relatório gerado e associado com sucesso para o lead ${leadId}`);
        success = true;
        
      } catch (error) {
        console.error(`❌ Erro na tentativa ${attempt}/${MAX_ATTEMPTS}:`, error);
        lastError = error;
        
        // Esperar antes da próxima tentativa (exponential backoff)
        if (attempt < MAX_ATTEMPTS) {
          const backoffTime = Math.min(1000 * 2 ** attempt, 10000); // Máximo de 10 segundos
          console.log(`⏱️ Aguardando ${backoffTime}ms antes da próxima tentativa`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    }

    // Se todas as tentativas falharam
    if (!success) {
      console.error(`❌ Todas as ${MAX_ATTEMPTS} tentativas falharam para o lead ${leadId}`);
      
      // Atualizar status para falha
      await updateReportStatus(
        leadId, 
        'failed', 
        `Falha ao gerar relatório após ${MAX_ATTEMPTS} tentativas. Equipe notificada.`
      );
      
      // TODO: Implementar notificação para equipe sobre falha na geração
    }
    
  } catch (error) {
    console.error(`❌ Erro fatal no processo de geração assíncrona para lead ${leadId}:`, error);
    
    try {
      await updateReportStatus(
        leadId, 
        'failed', 
        'Erro interno no servidor durante a geração do relatório'
      );
    } catch (statusError) {
      console.error('❌ Não foi possível atualizar o status para falha:', statusError);
    }
  }
}
