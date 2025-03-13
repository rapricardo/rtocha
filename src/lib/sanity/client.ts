import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'wm03zquh';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-03-01';

// IMPORTANTE: Este token é temporário para testes! Substitua com sua variável de ambiente em produção
// Use apenas para desenvolvimento e teste
const TEMP_TOKEN = process.env.SANITY_API_TOKEN || '';

// Cliente para uso no frontend (somente leitura)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
});

// Cliente para operações de escrita
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: TEMP_TOKEN,
  // Sem perspective para garantir permissões totais
});

// Para DEBUG - remova na produção
if (!TEMP_TOKEN) {
  console.warn('⚠️ SANITY_API_TOKEN não está definido!');
} else {
  console.log('✅ Token configurado para cliente Sanity');
}

export default sanityClient;