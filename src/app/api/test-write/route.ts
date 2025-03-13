import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';

interface TestDocument {
  _type: string;
  title: string;
  description: string;
}

export async function GET() {
  try {
    // Tenta criar um documento de teste
    const testDoc: TestDocument = {
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
  } catch (error: unknown) {
    console.error('Erro ao criar documento:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorResponse = (error as { response?: { body?: unknown } }).response?.body;
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar documento',
      error: errorMessage,
      details: errorResponse || 'Sem detalhes adicionais'
    }, { status: 500 });
  }
}