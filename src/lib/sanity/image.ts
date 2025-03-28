import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'; // Import type
import { client } from './client';

// Cria um construtor de URL para imagens do Sanity
const builder = imageUrlBuilder(client);

// Função para gerar URLs de imagem
export function urlForImage(source: SanityImageSource) { // Use imported type
  // Add basic check for safety, although builder might handle it
  if (!source) {
     console.warn("urlForImage received invalid source:", source);
     // Return a dummy builder or handle error appropriately
     // For now, let the builder handle it, which might return null or error
  }
  return builder.image(source);
}
