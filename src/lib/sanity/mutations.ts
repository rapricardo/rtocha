import { sanityClient } from './client';
// import { v4 as uuidv4 } from 'uuid'; // Comentando importação não utilizada
import { LeadData, ReportData } from '@/lib/types';

// Criar um novo lead
export async function createLead(leadData: LeadData) {
  try {
    console.log('📝 Criando lead com dados:', leadData);
    const result = await sanityClient.create({
      _type: 'lead',
      ...leadData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Lead criado com sucesso:', result._id);
    return result._id;
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