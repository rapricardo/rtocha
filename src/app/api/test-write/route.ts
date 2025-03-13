import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';

export async function GET() {
  try {
    // Tenta criar um documento de teste
    const testDoc = {
      _type: 'test',
      title: 'Documento de teste',
      description: 'Criado em ' + new Date().toISOString()
    };
    
    const result = await sanityClient.create(testDoc);
    
    return NextResponse.json({
      success: true,
      message: 'Documento criado com sucesso!',
      documentId: result._id
    });
  } catch (error: any) {
    console.error('Erro ao criar documento:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar documento',
      error: error.message,
      details: error.response?.body || 'Sem detalhes adicionais'
    }, { status: 500 });
  }
}