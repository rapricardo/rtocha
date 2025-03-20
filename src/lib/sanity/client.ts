import { createClient } from 'next-sanity';

// Use valores padrão para garantir que nunca sejam undefined
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wm03zquh';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';

// Usar a versão NEXT_PUBLIC do token para acesso client-side
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_SANITY_API_TOKEN || '';
// Usar a versão privada para server-side (em API routes)
const PRIVATE_TOKEN = process.env.SANITY_API_TOKEN || PUBLIC_TOKEN;

// Cliente para uso no frontend (somente leitura)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  // Só precisa de token para queries que requerem autenticação
  token: PUBLIC_TOKEN || undefined,
});

// Cliente para operações de escrita - só usado em API routes (server-side)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: PRIVATE_TOKEN,
});

// Removendo logs que aparecem no console
// Logs mais discretos apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  if (!PUBLIC_TOKEN && !PRIVATE_TOKEN) {
    console.log('🔑 Nenhum token Sanity configurado - usando modo de leitura pública apenas');
  }
}

export default sanityClient;