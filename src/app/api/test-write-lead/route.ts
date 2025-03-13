import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';
import { LeadData } from '@/lib/types';

export async function GET() {
  try {
    // Tenta criar um documento de lead de teste
    const testLead: LeadData & { _type: string } = {
      _type: 'lead',
      name: 'Usuário de Teste',
      email: 'teste@example.com',
      companyName: 'Empresa de Teste',
      companySize: '1-10',
      mainChallenge: 'qualified_leads',
      improvementGoal: 'increase_revenue',
      status: 'new',
      origin: 'api_test',
      createdAt: new Date().toISOString()
    };
    
    const result = await sanityClient.create(testLead);
    
    return NextResponse.json({
      success: true,
      message: 'Lead de teste criado com sucesso!',
      leadId: result._id
    });
  } catch (error: unknown) {
    console.error('Erro ao criar lead de teste:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorResponse = (error as { response?: { body?: unknown } }).response?.body;
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar lead de teste',
      error: errorMessage,
      details: errorResponse || 'Sem detalhes adicionais',
      hasToken: !!process.env.SANITY_API_TOKEN
    }, { status: 500 });
  }
}