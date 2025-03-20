'use client';

import { LeadInfo } from "@/types/service";
import { urlForImage } from "@/lib/sanity/image";

/**
 * Função utilitária que retorna a URL de uma imagem personalizada,
 * gerenciando tanto o formato novo (customImagesUrls) quanto o legado (customImages)
 */
export function getPersonalizedImageUrl(
  leadInfo: LeadInfo | null | undefined, 
  imageType: 'welcome' | 'ctaService' | 'ctaWhatsapp' | 'results', 
  fallbackUrl: string = ''
): string {
  if (!leadInfo) return fallbackUrl;

  // Tenta primeiro o novo formato (customImagesUrls)
  const newFormatKey = `${imageType}ImageUrl` as const;
  if (leadInfo.customImagesUrls && leadInfo.customImagesUrls[newFormatKey]) {
    return leadInfo.customImagesUrls[newFormatKey] || fallbackUrl;
  }
  
  // Fallback para o formato legado (customImages)
  const legacyFormatKey = `${imageType}Image` as const;
  if (leadInfo.customImages && leadInfo.customImages[legacyFormatKey]) {
    const imageData = leadInfo.customImages[legacyFormatKey];
    // Verifica se há uma URL direta ou se precisamos usar urlForImage
    if (typeof imageData === 'string') {
      return imageData;
    } else if (imageData && imageData.asset && imageData.asset.url) {
      return imageData.asset.url;
    } else if (imageData) {
      try {
        return urlForImage(imageData).url();
      } catch (error) {
        console.error('Erro ao gerar URL para imagem legada:', error);
      }
    }
  }
  
  // Se nada for encontrado, retorna a URL de fallback
  return fallbackUrl;
}
