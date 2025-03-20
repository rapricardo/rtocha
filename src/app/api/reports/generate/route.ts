import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

// Endpoint de API para geração assíncrona de relatórios
export async function POST(request: Request) {
  try {
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
  try {
    console.log(`🚀 generateReportAsync: Iniciando geração para lead: ${leadId}`);
    console.log('🔑 Verificando token Sanity:', !!process.env.SANITY_API_TOKEN ? 'Disponível' : 'Não disponível');

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

    // 4. Iniciar geração - Com até 3 tentativas
    const MAX_ATTEMPTS = 3;
    console.log(`🔄 Iniciando geração do relatório em até ${MAX_ATTEMPTS} tentativas`);
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

        // 5. Gerar o relatório
        console.log(`🔄 Tentativa ${attempt}/${MAX_ATTEMPTS} de gerar relatório para o lead ${leadId}`);
        
        // TODO: Substituir esta seção com a chamada real para sua função de geração de relatório
        // Simulação de geração de relatório (remover e substituir pelo código real)
        console.log('⏳ Simulando processamento de 3 segundos...');
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulação de processamento
        console.log('✅ Processamento simulado concluído');
        
        const reportData = {
          reportTitle: `Relatório para ${lead.companyName || lead.name}`,
          leadId: lead._id,
          reportId: `report-${lead._id}`,
          // Outros campos do relatório
        };
        
        // Criar o relatório no Sanity
        console.log('📝 Criando documento de relatório no Sanity...');
        const report = await sanityClient.create({
          _type: 'report',
          reportTitle: reportData.reportTitle,
          lead: { _type: 'reference', _ref: leadId },
          slug: {
            _type: 'slug',
            current: reportData.reportId
          },
          // Substitua por dados reais
          reportContent: [
            {
              _type: 'block',
              children: [
                {
                  _type: 'span',
                  text: 'Conteúdo de exemplo do relatório.',
                  marks: []
                }
              ],
              style: 'normal'
            }
          ],
          createdAt: new Date().toISOString(),
          views: 0
        });
        console.log('✅ Documento de relatório criado com ID:', report._id);

        // Associar o relatório ao lead
        console.log('🔄 Associando relatório ao lead...');
        await sanityClient
          .patch(leadId)
          .set({
            report: { _type: 'reference', _ref: report._id },
            reportGenerated: true,
            updatedAt: new Date().toISOString()
          })
          .commit();
        console.log('✅ Relatório associado ao lead com sucesso');

        // Atualizar status final
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