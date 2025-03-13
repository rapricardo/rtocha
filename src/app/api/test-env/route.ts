import { NextResponse } from 'next/server';

export async function GET() {
  // Não retorne o token completo, apenas verifica se existe
  const hasToken = !!process.env.SANITY_API_TOKEN;
  const tokenPrefix = process.env.SANITY_API_TOKEN ? 
    process.env.SANITY_API_TOKEN.substring(0, 5) + '...' : 
    'não definido';
  
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    sanity: {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      hasToken,
      tokenPrefix
    },
    google: {
      hasApiKey: !!process.env.GOOGLE_AI_API_KEY
    }
  });
}