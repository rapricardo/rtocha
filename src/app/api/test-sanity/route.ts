import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';

export async function GET() {
  try {
    // Tenta fazer uma operação simples de leitura para verificar a conexão
    await sanityClient.fetch(`*[_type == "sanity.imageAsset"][0...1]`);
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com Sanity está funcionando',
      result: 'Dados retornados com sucesso'
    });
  } catch (error: unknown) {
    console.error('Erro ao conectar ao Sanity:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorDetails = (error as { details?: unknown }).details;
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao conectar ao Sanity',
      error: errorMessage,
      details: errorDetails || 'Sem detalhes adicionais'
    }, { status: 500 });
  }
}