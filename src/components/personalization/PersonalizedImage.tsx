'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useReturningLead } from '@/lib/hooks/useReturningLead';
import { getPersonalizedImageUrl } from '@/lib/services/imageUtils';

interface PersonalizedImageProps {
  imageType: 'welcome' | 'ctaService' | 'ctaWhatsapp' | 'results';
  fallbackImageUrl: string;
  width?: number;
  height?: number;
  priority?: boolean;
  alt?: string;
  className?: string;
  showBadge?: boolean;
}

export default function PersonalizedImage({
  imageType,
  fallbackImageUrl,
  width = 600,
  height = 400,
  priority = false,
  alt = 'Imagem personalizada',
  className = '',
  showBadge = true
}: PersonalizedImageProps) {
  const { isReturningLead, isLoading, data } = useReturningLead();
  const [imageSrc, setImageSrc] = useState(fallbackImageUrl);
  const [isCustomImage, setIsCustomImage] = useState(false);
  
  useEffect(() => {
    if (!isLoading && isReturningLead && data?.lead) {
      const personalizedUrl = getPersonalizedImageUrl(data.lead, imageType, '');
      if (personalizedUrl) {
        setImageSrc(personalizedUrl);
        setIsCustomImage(true);
      }
    }
  }, [isLoading, isReturningLead, data, imageType]);
  
  return (
    <div className={`relative ${className}`}>
      <Image 
        src={imageSrc}
        width={width}
        height={height}
        alt={alt}
        className="transition-all duration-500 rounded-lg h-auto object-contain"
        priority={priority}
        style={{ width: '100%', maxHeight: '100%' }}
      />
      {isCustomImage && showBadge && (
        <div className="absolute bottom-0 right-0 bg-gradient-to-r from-[#d32b36] to-[#e67a48] text-white text-xs px-2 py-1 rounded-tl-md">
          Personalizado para você
        </div>
      )}
    </div>
  );
}
