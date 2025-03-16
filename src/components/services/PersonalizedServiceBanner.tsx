'use client';

import { useEffect, useState } from "react";
import { LeadInfo, Service } from "@/types/service";
import { checkServiceCompatibility, generatePersonalizedMessage } from "@/lib/services/serviceUtils";

interface PersonalizedServiceBannerProps {
  leadInfo: LeadInfo;
  service: Service;
  isRecommended: boolean;
}

export default function PersonalizedServiceBanner({ 
  leadInfo, 
  service, 
  isRecommended 
}: PersonalizedServiceBannerProps) {
  console.log("[PersonalizedServiceBanner] Renderizando com:", { leadInfo, service, isRecommended });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verifica se o banner já foi fechado anteriormente para este serviço
    const dismissedServices = JSON.parse(localStorage.getItem('dismissedServiceBanners') || '[]');
    if (dismissedServices.includes(service._id)) {
      setDismissed(true);
    }
  }, [service._id]);

  const handleDismiss = () => {
    setDismissed(true);
    
    // Salva o ID do serviço na lista de banners fechados
    const dismissedServices = JSON.parse(localStorage.getItem('dismissedServiceBanners') || '[]');
    dismissedServices.push(service._id);
    localStorage.setItem('dismissedServiceBanners', JSON.stringify(dismissedServices));
  };

  if (dismissed) {
    return null;
  }

  // Verifica a compatibilidade do serviço com o perfil do lead
  const compatibility = checkServiceCompatibility(leadInfo, service);
  
  // Gera mensagem personalizada
  const personalizedMessage = generatePersonalizedMessage(leadInfo, service, compatibility);

  // Define o tipo de banner com base na recomendação
  const bannerClasses = isRecommended || compatibility.overallRecommendation
    ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-500 text-green-800'
    : 'bg-gradient-to-r from-[#ffebe9] to-[#ffece8] border-[#d32b36] text-gray-800';

  return (
    <div className={`border-l-4 px-4 py-3 mb-6 ${bannerClasses} relative rounded-lg shadow-sm`}>
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Fechar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#d32b36]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-medium">{personalizedMessage}</p>
      
          {(isRecommended || compatibility.overallRecommendation) && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Recomendado para seu perfil
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
