'use client';

import React, { useEffect } from 'react';
import { useReturningLead } from '@/lib/hooks/useReturningLead';
// import WelcomeBackBanner from './WelcomeBackBanner'; // Removed unused
import PersonalizedWelcomeBlock from './PersonalizedWelcomeBlock';
import RecommendedServices from './RecommendedServices';

export default function WelcomeBackWrapper() {
  const { isReturningLead, isLoading, data } = useReturningLead();

  // Debug logs
  useEffect(() => {
    if (!isLoading) {
      console.log('[WelcomeBackWrapper] isReturningLead:', isReturningLead);
      console.log('[WelcomeBackWrapper] Lead data:', data?.lead);
      // Log para ambos os formatos (legado e novo)
      console.log('[WelcomeBackWrapper] Welcome image (legacy):', data?.lead?.customImages?.welcomeImage);
      console.log('[WelcomeBackWrapper] Welcome image URL (new):', data?.lead?.customImagesUrls?.welcomeImageUrl);
      console.log('[WelcomeBackWrapper] Has legacy image asset:', !!data?.lead?.customImages?.welcomeImage?.asset);
      console.log('[WelcomeBackWrapper] Has new image URL:', !!data?.lead?.customImagesUrls?.welcomeImageUrl);
    }
  }, [isLoading, isReturningLead, data]);

  // Se não for um lead retornante ou estiver carregando, não mostrar nada
  if (isLoading || !isReturningLead || !data) {
    return null;
  }

  // Remove unused variables
  // const hasLegacyImage = !!data.lead?.customImages?.welcomeImage?.asset?.url;
  // const hasNewImage = !!data.lead?.customImagesUrls?.welcomeImageUrl;
  // const hasCustomImage = hasLegacyImage || hasNewImage;

  return (
    <div className="space-y-8">
      {/* Mostrar o bloco personalizado para leads retornantes */}
      <PersonalizedWelcomeBlock />
      
      {/* Mostrar os serviços recomendados para o lead */}
      <RecommendedServices />
    </div>
  );
}
