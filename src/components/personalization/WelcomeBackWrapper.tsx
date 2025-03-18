'use client';

import React, { useEffect } from 'react';
import { useReturningLead } from '@/lib/hooks/useReturningLead';
import WelcomeBackBanner from './WelcomeBackBanner';
import PersonalizedWelcomeBlock from './PersonalizedWelcomeBlock';
import RecommendedServices from './RecommendedServices';

export default function WelcomeBackWrapper() {
  const { isReturningLead, isLoading, data } = useReturningLead();

  // Debug logs
  useEffect(() => {
    if (!isLoading) {
      console.log('[WelcomeBackWrapper] isReturningLead:', isReturningLead);
      console.log('[WelcomeBackWrapper] Lead data:', data?.lead);
      console.log('[WelcomeBackWrapper] Welcome image:', data?.lead?.customImages?.welcomeImage);
      console.log('[WelcomeBackWrapper] Has image asset:', !!data?.lead?.customImages?.welcomeImage?.asset);
    }
  }, [isLoading, isReturningLead, data]);

  // Se não for um lead retornante ou estiver carregando, não mostrar nada
  if (isLoading || !isReturningLead || !data) {
    return null;
  }

  // Verificar se temos os dados do lead com a imagem
  const hasCustomImage = !!data.lead?.customImages?.welcomeImage?.asset?.url;

  return (
    <div className="space-y-8">
      {/* Mostrar o bloco personalizado para leads retornantes */}
      <PersonalizedWelcomeBlock />
      
      {/* Mostrar os serviços recomendados para o lead */}
      <RecommendedServices />
    </div>
  );
}