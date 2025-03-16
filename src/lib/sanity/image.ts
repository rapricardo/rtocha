import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';

// Cria um construtor de URL para imagens do Sanity
const builder = imageUrlBuilder(client);

// Função para gerar URLs de imagem
export function urlForImage(source: any) {
  return builder.image(source);
}
