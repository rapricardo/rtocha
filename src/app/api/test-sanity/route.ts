import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';

export async function GET() {
  try {
    // Tenta fazer uma operação simples de leitura para verificar a conexão
    const result = await sanityClient.fetch(`*[_type == "sanity.imageAsset"][0...1]`);
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com Sanity está funcionando',
      result: 'Dados retornados com sucesso'
    });
  } catch (error: any) {
    console.error('Erro ao conectar ao Sanity:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao conectar ao Sanity',
      error: error.message,
      details: error.details || 'Sem detalhes adicionais'
    }, { status: 500 });
  }
}