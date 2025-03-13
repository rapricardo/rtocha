// Este arquivo força o Next.js a carregar variáveis de ambiente do arquivo .env.local
// Apenas para desenvolvimento - não é necessário em produção
export const ENV_CHECK = {
  SANITY_TOKEN_SET: !!process.env.SANITY_API_TOKEN,
  GOOGLE_API_KEY_SET: !!process.env.GOOGLE_AI_API_KEY
};

console.log('🔑 Verificação de variáveis de ambiente em tempo de construção:');
console.log('🔑 SANITY_API_TOKEN definido:', ENV_CHECK.SANITY_TOKEN_SET);
console.log('🔑 GOOGLE_AI_API_KEY definido:', ENV_CHECK.GOOGLE_API_KEY_SET);