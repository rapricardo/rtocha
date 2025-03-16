'use client';

import { useEffect, useState } from "react";
import { getLeadById, getServiceById, isServiceRecommendedForLead } from "@/lib/services/serviceQueries";
import PersonalizedServiceBanner from "./PersonalizedServiceBanner";
import { LeadInfo, Service } from "@/types/service";

interface PersonalizedServiceWrapperProps {
  serviceId: string;
}

export default function PersonalizedServiceWrapper({ serviceId }: PersonalizedServiceWrapperProps) {
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [isRecommended, setIsRecommended] = useState(false);
  const [loading, setLoading] = useState(true);

  // Função de depuração para localStorage
  useEffect(() => {
    console.log("[DEBUG] Verificando localStorage");
    console.log("[DEBUG] LEAD_ID:", localStorage.getItem('rt_lead_id'));
    console.log("[DEBUG] LEAD_EXPIRY:", localStorage.getItem('rt_lead_expiry'));
  }, []);
  
  useEffect(() => {
    const fetchLeadInfo = async () => {
      try {
        // Tenta obter o ID do lead do localStorage
        const leadId = localStorage.getItem('rt_lead_id');
        console.log("[PersonalizedServiceWrapper] LeadID no localStorage:", leadId);
        
        if (!leadId) {
          console.log("[PersonalizedServiceWrapper] Nenhum lead encontrado no localStorage");
          setLoading(false);
          return;
        }
        
        console.log("[PersonalizedServiceWrapper] Buscando dados para serviceId:", serviceId);
        
        // Busca informações do lead
        const leadData = await getLeadById(leadId);
        console.log("[PersonalizedServiceWrapper] Dados do lead:", leadData);
        
        // Busca dados do serviço pelo ID
        const serviceData = await getServiceById(serviceId);
        console.log("[PersonalizedServiceWrapper] Dados do serviço:", serviceData);
        
        setLeadInfo(leadData);
        setService(serviceData);
        console.log("[PersonalizedServiceWrapper] Service data definido:", serviceData);
        
        // Verifica se o serviço é recomendado para este lead
        if (leadData) {
          const recommendedResult = await isServiceRecommendedForLead(leadId, serviceId);
          console.log("[PersonalizedServiceWrapper] Serviço recomendado:", recommendedResult);
          setIsRecommended(recommendedResult);
        }
      } catch (error) {
        console.error("[PersonalizedServiceWrapper] Erro ao buscar informações personalizadas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeadInfo();
  }, [serviceId]);
  
  // Se não estiver carregando e não tiver informações do lead ou do serviço, não renderiza nada
  if (!loading && (!leadInfo || !service)) {
    return null;
  }
  
  // Se estiver carregando ou faltarem informações, não renderiza nada
  if (loading || !leadInfo || !service) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 pt-6">
      <PersonalizedServiceBanner
        leadInfo={leadInfo}
        service={service}
        isRecommended={isRecommended}
      />
    </div>
  );
}
