import { randomBytes } from 'crypto';

// Gera um ID único para o relatório
export function generateReportId() {
  // Formato: aud-XXXX-XXXX
  // Onde XXXX são caracteres alfanuméricos
  
  // Gerar 8 bytes aleatórios (64 bits)
  const randomBuffer = randomBytes(8);
  
  // Converter para string hexadecimal
  const randomHex = randomBuffer.toString('hex');
  
  // Dividir em duas partes de 4 caracteres
  const part1 = randomHex.substring(0, 4);
  const part2 = randomHex.substring(4, 8);
  
  // Formatar no padrão desejado
  return `aud-${part1}-${part2}`;
}