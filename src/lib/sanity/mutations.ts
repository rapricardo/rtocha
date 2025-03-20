import { sanityClient } from './client';
// import { v4 as uuidv4 } from 'uuid'; // Comentando importação não utilizada
import { LeadData, ReportData } from '@/lib/types';

// Criar um novo lead
export async function createLead(leadData: LeadData) {
  try {
    console.log('📝 Criando lead com dados:', leadData);
    
    // Adicionar timestamp e status inicial do relatório
    const timestamp = new Date().toISOString();
    const lead = await sanityClient.create({
      _type: 'lead',
      ...leadData,
      createdAt: timestamp,
      updatedAt: timestamp,
      // Inicializar o status do relatório como "em fila"
      reportStatus: {
        status: 'queued',
        message: 'Relatório está na fila para geração',
        updatedAt: timestamp,
        attempts: 0
      }
    });
    
    console.log('✅ Lead criado com sucesso:', lead._id);
    
    // Iniciar geração assíncrona do relatório
    try {
      // Chamada assíncrona - não esperamos pelo resultado
      // Usamos URL absoluta baseada na localização atual (funciona tanto localmente quanto em produção)
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
        
      console.log(`🔄 Iniciando geração de relatório via ${baseUrl}/api/reports/generate`);
      
      fetch(`${baseUrl}/api/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          leadId: lead._id 
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Resposta de erro: ${response.status}`);
        }
        return response.json();
      }).then(data => {
        console.log('✅ Resposta da API de geração:', data);
      }).catch(err => {
        console.error('⚠️ Erro ao iniciar geração de relatório (não bloqueante):', err);
        // Não lançamos o erro aqui para não bloquear a criação do lead
      });
      
      console.log('🔄 Processo de geração de relatório iniciado para:', lead._id);
    } catch (genError) {
      // Apenas logamos o erro, não afeta a criação do lead
      console.error('⚠️ Erro ao chamar API de geração (não bloqueante):', genError);
    }
    
    return lead._id;
  } catch (error) {
    console.error('❌ Erro ao criar lead:', error);
    throw error;
  }
}

// Atualizar um lead existente
export async function updateLead(leadId: string, data: Partial<LeadData>) {
  try {
    console.log(`📝 Atualizando lead ${leadId} com dados:`, data);
    const result = await sanityClient
      .patch(leadId)
      .set({
        ...data,
        updatedAt: new Date().toISOString()
      })
      .commit();
      
    console.log('✅ Lead atualizado com sucesso');
    return result;
  } catch (error) {
    console.error('❌ Erro ao atualizar lead:', error);
    throw error;
  }
}

// Criar um novo relatório
export async function createReport(reportData: ReportData) {
  try {
    console.log('📝 Criando relatório com dados:', reportData);
    // Gerar um slug baseado no reportId
    const slug = {
      _type: 'slug',
      current: reportData.reportId
    };
    
    const result = await sanityClient.create({
      _type: 'report',
      ...reportData,
      slug,
      createdAt: new Date().toISOString(),
      views: 0
    });
    
    console.log('✅ Relatório criado com sucesso:', result._id);
    return {
      id: result._id,
      slug: reportData.reportId
    };
  } catch (error) {
    console.error('❌ Erro ao criar relatório:', error);
    throw error;
  }
}

// Atualizar um relatório existente
export async function updateReport(reportId: string, data: Partial<ReportData>) {
  try {
    console.log(`📝 Atualizando relatório ${reportId} com dados:`, data);
    const result = await sanityClient
      .patch(reportId)
      .set(data)
      .commit();
      
    console.log('✅ Relatório atualizado com sucesso');
    return result;
  } catch (error) {
    console.error('❌ Erro ao atualizar relatório:', error);
    throw error;
  }
}

// Registrar visualização de relatório
export async function registerReportView(reportId: string) {
  try {
    console.log(`📝 Registrando visualização para relatório ${reportId}`);
    const result = await sanityClient
      .patch(reportId)
      .inc({ views: 1 })
      .set({ lastViewedAt: new Date().toISOString() })
      .commit();
      
    console.log('✅ Visualização registrada com sucesso');
    return result;
  } catch (error) {
    console.error('❌ Erro ao registrar visualização:', error);
    throw error;
  }
}

// Registrar clique no CTA do relatório
export async function registerReportCTAClick(reportId: string) {
  try {
    console.log(`📝 Registrando clique no CTA para relatório ${reportId}`);
    const result = await sanityClient
      .patch(reportId)
      .set({ 
        callToActionClicked: true,
        lastViewedAt: new Date().toISOString()
      })
      .inc({views: 1})
      .commit();
      
    console.log('✅ Clique no CTA registrado com sucesso');
    return result;
  } catch (error) {
    console.error('❌ Erro ao registrar clique no CTA:', error);
    throw error;
  }
}