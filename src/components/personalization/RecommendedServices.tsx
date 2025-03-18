'use client';

import React, { useEffect, useState } from 'react';
import { useReturningLead } from '@/lib/hooks/useReturningLead';
import { ServiceCard } from '@/components/ServiceCard';
import { client } from '@/lib/sanity/client';
import { groq } from 'next-sanity';
import { Service } from '@/types/service';

// Importação dos ícones de serviço
import LeadIcon from "@/components/icons/LeadIcon";
import ContentIcon from "@/components/icons/ContentIcon";
import WorkflowIcon from "@/components/icons/WorkflowIcon";
import IntegrationIcon from "@/components/icons/IntegrationIcon";
import AnalyticsIcon from "@/components/icons/AnalyticsIcon";

interface RecommendedServicesProps {
  className?: string;
}

// Função para obter ícone com base no nome do serviço (ou qualquer lógica)
const getServiceIcon = (serviceId: string) => {
  // Você pode implementar uma lógica melhor aqui para mapear serviços a ícones
  const iconMap: Record<string, React.ReactNode> = {
    'sdr-virtual': <LeadIcon className="w-12 h-12" />,
    'agente-recuperacao': <LeadIcon className="w-12 h-12" />,
    'agendador-inteligente': <ContentIcon className="w-12 h-12" />,
    'assistente-reunioes': <WorkflowIcon className="w-12 h-12" />,
    'prospector-geografico': <IntegrationIcon className="w-12 h-12" />,
    'enriquecedor-leads': <AnalyticsIcon className="w-12 h-12" />,
    'suporte-faq': <ContentIcon className="w-12 h-12" />,
  };
  
  // Extrair o slug do ID
  const slugPart = serviceId.split('-').slice(-2).join('-');
  
  // Retornar o ícone mapeado ou um ícone padrão
  return iconMap[slugPart] || <WorkflowIcon className="w-12 h-12" />;
};

export default function RecommendedServices({ className = '' }: RecommendedServicesProps) {
  const { isReturningLead, isLoading, data } = useReturningLead();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Só buscar serviços se for um lead retornante e tivermos os dados
    if (!isLoading && isReturningLead && data?.lead) {
      const fetchServices = async () => {
        try {
          let serviceIds: string[] = [];
          
          // Verificar se o lead tem serviços recomendados diretamente
          if (data.lead.recommendedServices && data.lead.recommendedServices.length > 0) {
            serviceIds = data.lead.recommendedServices.map((service: any) => service._id);
          } 
          // Se não, verificar se há serviços recomendados no relatório
          else if (data.reports && data.reports.length > 0) {
            // Buscar serviços recomendados do relatório
            const reportQuery = groq`*[_type == "report" && _id == $reportId][0]{
              recommendedServices[]{
                service->{_id, name, slug, shortDescription}
              }
            }`;
            
            const reportData = await client.fetch(reportQuery, { 
              reportId: data.reports[0]._id 
            });
            
            if (reportData?.recommendedServices && reportData.recommendedServices.length > 0) {
              serviceIds = reportData.recommendedServices.map(
                (item: { service: Service }) => item.service._id
              );
            }
          }
          
          // Se temos serviços recomendados, buscar detalhes completos
          if (serviceIds.length > 0) {
            const servicesQuery = groq`*[_type == "service" && _id in $ids]{
              _id,
              name,
              "slug": slug.current,
              shortDescription,
              marketingTitle
            }`;
            
            const servicesData = await client.fetch(servicesQuery, { ids: serviceIds });
            setServices(servicesData);
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Erro ao buscar serviços recomendados:', error);
          setLoading(false);
        }
      };
      
      fetchServices();
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading, isReturningLead, data]);

  // Não mostrar nada enquanto carrega, se não for lead retornante ou se não houver serviços
  if (loading || !isReturningLead || !data?.lead || services.length === 0) {
    return null;
  }

  // Extrair informações relevantes do lead
  const companyName = data.lead.companyName;
  
  // Determinar objetivo de melhoria
  let improvementGoal = 'automatizar processos';
  
  if (data.lead.improvementGoal === 'increase_revenue') {
    improvementGoal = 'aumentar a receita';
  } else if (data.lead.improvementGoal === 'reduce_costs') {
    improvementGoal = 'reduzir custos operacionais';
  } else if (data.lead.improvementGoal === 'customer_experience') {
    improvementGoal = 'melhorar a experiência do cliente';
  } else if (data.lead.improvementGoal === 'optimize_processes') {
    improvementGoal = 'otimizar processos';
  }
  
  // Texto do heading diferente se tiver ou não o nome da empresa
  const headingText = companyName
    ? `Saiba mais sobre as táticas que podem ajudar a ${companyName} a ${improvementGoal}`
    : `Saiba mais sobre as táticas que podem ajudar a ${improvementGoal}`;

  // Limitar a 3 serviços para exibição
  const displayServices = services.slice(0, 3);

  return (
    <div className={`py-6 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        {companyName ? (
          <>
            Saiba mais sobre as táticas que podem ajudar a <span className="text-[#d32b36]">{companyName}</span> a {improvementGoal}
          </>
        ) : (
          <>Saiba mais sobre as táticas que podem ajudar a {improvementGoal}</>
        )}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayServices.map((service) => (
          <ServiceCard
            key={service._id}
            icon={getServiceIcon(service._id)}
            title={service.marketingTitle || service.name}
            description={service.shortDescription}
            color="primary"
            href={`/solucoes/${service.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
