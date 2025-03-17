"use client";

import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { portableTextComponents } from "@/lib/portable-text/components.tsx";

interface Step {
  _key?: string;
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  stepNumber?: number;
}

interface ServiceHowItWorksProps {
  howItWorks?: PortableTextBlock[];
  howItWorksSteps?: Step[];
  slug?: string;
}

// Componente que exibe passos para o agente de qualificação de leads especificamente
function LeadQualificationSteps() {
  const steps = [
    {
      number: 1,
      title: "Primeiro contato personalizado",
      content: "Quando um novo lead é identificado, o agente inicia uma conversa contextualizada via WhatsApp ou chat do site, apresentando-se de forma amigável e profissional."
    },
    {
      number: 2,
      title: "Conversa natural e adaptativa",
      content: "Utilizando processamento de linguagem natural avançado, o agente conduz um diálogo que parece humano, ajustando as perguntas com base nas respostas recebidas, sem seguir roteiros rígidos."
    },
    {
      number: 3,
      title: "Qualificação BANT inteligente",
      content: "Durante a conversa, o agente avalia sutilmente orçamento, autoridade, necessidade e prazo, sem parecer um interrogatório comercial tradicional."
    },
    {
      number: 4,
      title: "Acesso a informações em tempo real",
      content: "O agente consulta seu catálogo de produtos, FAQ, status de pedidos ou outras bases de conhecimento para responder dúvidas específicas durante a conversa."
    },
    {
      number: 5,
      title: "Pontuação automática de leads",
      content: "Com base nas respostas e comportamento, o sistema atribui uma pontuação de qualificação segundo critérios personalizáveis para seu negócio."
    },
    {
      number: 6,
      title: "Sincronização com CRM",
      content: "Todas as informações coletadas são automaticamente registradas em seu CRM, criando ou enriquecendo o perfil do lead."
    },
    {
      number: 7,
      title: "Encaminhamento inteligente",
      content: "Leads qualificados são direcionados para agendamento com a equipe comercial, enquanto leads não qualificados entram em fluxos de nutrição."
    },
    {
      number: 8,
      title: "Aprendizado contínuo",
      content: "O sistema aprende com cada interação, melhorando continuamente suas respostas e processo de qualificação."
    }
  ];
  
  return (
    <div className="relative">
      {/* Linha central de fluxo - visível apenas em desktop */}
      <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-1 bg-gradient-to-b from-[#d32b36] to-[#e67a48] transform -translate-x-1/2 rounded-full"></div>
      
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`mb-16 last:mb-0 md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
        >
          {/* Círculo numerado */}
          <div className="flex-shrink-0 mx-auto md:mx-0 mb-6 md:mb-0 md:mx-8 z-10 relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#d32b36] to-[#e67a48] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {step.number}
            </div>
            
            {/* Conectores em forma de seta - apenas em mobile */}
            {index < steps.length - 1 && (
              <div className="md:hidden absolute left-1/2 bottom-[-24px] transform -translate-x-1/2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="#d32b36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
          
          {/* Conteúdo do passo */}
          <div className={`bg-gray-50 rounded-xl p-6 shadow-md flex-grow relative ${index % 2 === 0 ? 'md:ml-4' : 'md:mr-4'}`}>
            {/* Triangulo apontando para o círculo - apenas em desktop */}
            <div className={`hidden md:block absolute top-1/2 transform -translate-y-1/2 ${index % 2 === 0 ? 'left-[-10px]' : 'right-[-10px]'}`}>
              <div className={`w-0 h-0 border-y-[10px] border-y-transparent ${index % 2 === 0 ? 'border-r-[10px] border-r-gray-50' : 'border-l-[10px] border-l-gray-50'}`}></div>
            </div>
            
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-gray-700">{step.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ServiceHowItWorks({ howItWorks, howItWorksSteps, slug }: ServiceHowItWorksProps) {
  // Se não houver passos ou conteúdo de 'como funciona', não renderiza o componente
  if (!howItWorks && (!howItWorksSteps || howItWorksSteps.length === 0)) {
    return null;
  }
  
  // Verifica se temos howItWorks mas não temos howItWorksSteps
  const usePortableTextInsteadOfSteps = !!howItWorks && (!howItWorksSteps || howItWorksSteps.length === 0);
  
  // Ordena os passos pelo número do passo ou usa a ordem original
  const orderedSteps = howItWorksSteps ? [...howItWorksSteps].sort((a, b) => {
    if (a.stepNumber !== undefined && b.stepNumber !== undefined) {
      return a.stepNumber - b.stepNumber;
    }
    return 0;
  }) : [];
  
  // Verifica se é a página de qualificação de leads para usar o componente específico
  const isLeadQualificationPage = slug === 'lead-qualification-agent';

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Como Funciona</h2>
          
          {/* Caso especial: página de qualificação de leads */}
          {isLeadQualificationPage && (
            <LeadQualificationSteps />
          )}
          
          {/* Exibe passos visuais se disponíveis e não for a página de leads */}
          {!isLeadQualificationPage && !usePortableTextInsteadOfSteps && orderedSteps && orderedSteps.length > 0 && (
            <div className="relative">
              {/* Linha central de fluxo - visível apenas em desktop */}
              <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-1 bg-gradient-to-b from-[#d32b36] to-[#e67a48] transform -translate-x-1/2 rounded-full"></div>
              
              {orderedSteps.map((step, index) => (
                <div 
                  key={step._key || index} 
                  className={`mb-16 last:mb-0 md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
                >
                  {/* Círculo numerado */}
                  <div className="flex-shrink-0 mx-auto md:mx-0 mb-6 md:mb-0 md:mx-8 z-10 relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#d32b36] to-[#e67a48] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {step.stepNumber || index + 1}
                    </div>
                    
                    {/* Conectores em forma de seta - apenas em mobile */}
                    {index < orderedSteps.length - 1 && (
                      <div className="md:hidden absolute left-1/2 bottom-[-24px] transform -translate-x-1/2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="#d32b36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Conteúdo do passo */}
                  <div className={`bg-gray-50 rounded-xl p-6 shadow-md flex-grow relative ${index % 2 === 0 ? 'md:ml-4' : 'md:mr-4'}`}>
                    {/* Triangulo apontando para o círculo - apenas em desktop */}
                    <div className={`hidden md:block absolute top-1/2 transform -translate-y-1/2 ${index % 2 === 0 ? 'left-[-10px]' : 'right-[-10px]'}`}>
                      <div className={`w-0 h-0 border-y-[10px] border-y-transparent ${index % 2 === 0 ? 'border-r-[10px] border-r-gray-50' : 'border-l-[10px] border-l-gray-50'}`}></div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{step.title || step.name || `Passo ${index + 1}`}</h3>
                    <p className="text-gray-700">{step.description || step.content || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Exibe conteúdo HTML rico para outras páginas */}
          {!isLeadQualificationPage && usePortableTextInsteadOfSteps && howItWorks && (
            <div className="bg-gray-50 rounded-xl p-8 shadow-md">
              <div className="prose prose-lg max-w-none">
                <PortableText value={howItWorks} components={portableTextComponents} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
