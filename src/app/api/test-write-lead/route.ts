import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';

export async function GET() {
  try {
    // Tenta criar um documento de lead de teste
    const testLead = {
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
  } catch (error: any) {
    console.error('Erro ao criar lead de teste:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar lead de teste',
      error: error.message,
      details: error.response?.body || 'Sem detalhes adicionais',
      hasToken: !!process.env.SANITY_API_TOKEN
    }, { status: 500 });
  }
}