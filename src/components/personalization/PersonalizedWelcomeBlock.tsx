'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { useReturningLead } from '@/lib/hooks/useReturningLead';
import { urlForImage } from '@/lib/sanity/image';
import { getPersonalizedImageUrl } from '@/lib/services/imageUtils';
import PersonalizedImage from './PersonalizedImage';

interface PersonalizedWelcomeBlockProps {
  className?: string;
  forceDisplay?: boolean;
}

export default function PersonalizedWelcomeBlock({ className = '', forceDisplay = false }: PersonalizedWelcomeBlockProps) {
  const { isReturningLead, isLoading, data } = useReturningLead();

  // Debug logs
  useEffect(() => {
    if (!isLoading) {
      console.log('[PersonalizedWelcomeBlock] Data:', data);
      // Log de ambos os formatos de imagem
      console.log('[PersonalizedWelcomeBlock] Welcome image (legacy):', data?.lead?.customImages?.welcomeImage);
      console.log('[PersonalizedWelcomeBlock] Welcome image URL (new):', data?.lead?.customImagesUrls?.welcomeImageUrl);
      
      // Log mais detalhado da estrutura da imagem legada
      if (data?.lead?.customImages?.welcomeImage) {
        console.log('Legacy image structure:', JSON.stringify(data.lead.customImages.welcomeImage, null, 2));
      }
    }
  }, [isLoading, data]);

  // Para um lead retornante (ou quando forçado a exibir)
  if (!forceDisplay && (!isReturningLead || isLoading)) {
    return null;
  }

  // Dados do lead ou valores padrão se não tiver dados
  const firstName = data?.lead?.name?.split(' ')[0] || 'visitante';
  const companyName = data?.lead?.companyName || 'sua empresa';
  
  // Imagem padrão para fallback
  const defaultImage = '/images/personagem-_tocha_em_uma_camiseta_amarela_com_uma_postura_amigvel_e_receptiva_demonstrando_abertura_jzix2dyie3u1gj8e6a9f_2.webp';
  
  // Usar o utilitário para obter a URL da imagem (checando ambos os formatos)
  const imageUrl = getPersonalizedImageUrl(
    data?.lead, 
    'welcome', 
    defaultImage
  );
  
  // Verificar se temos uma imagem personalizada (em qualquer formato)
  const hasWelcomeImage = imageUrl !== defaultImage;
  const reports = data?.reports || [];

  // Imagem de demonstração quando não há imagem personalizada
  const demoImageUrl = '/images/tocha_segurando_placa.jpg'; // Substitua pelo caminho real da imagem de demonstração

  return (
    <div className={`bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 pt-8 my-6 shadow-md ${className}`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-2/5 flex justify-center">
          {/* Usando o novo componente PersonalizedImage com exibição completa */}
          <PersonalizedImage 
            imageType="welcome"
            fallbackImageUrl="/images/personagem-_tocha_em_uma_camiseta_amarela_com_uma_postura_amigvel_e_receptiva_demonstrando_abertura_jzix2dyie3u1gj8e6a9f_2.webp"
            alt={`Mensagem personalizada para ${firstName}`}
            width={500}
            height={350}
            className="rounded-lg shadow-sm w-full h-auto object-contain"
            priority
          />
        </div>
        
        <div className="w-full md:w-3/5 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
            <span className="text-[#d32b36]">{firstName}</span>, mudei meu site só pra você.
          </h2>
          
          <p className="text-lg text-gray-700 mb-5">
            Você sabia que personalizações podem aumentar a conversão em até 30%? 
            Veja o que preparei especialmente para a {companyName}.
          </p>
          
          <div className="mt-auto">
            {reports.length > 0 ? (
              <Button 
                href={`/relatorios/${reports[0].slug.current}`}
                variant="primary"
              >
                Acessar sua auditoria personalizada
              </Button>
            ) : (
              <Button 
                href="/mini-auditoria"
                variant="primary"
              >
                Fazer Mini-Auditoria Gratuita
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
