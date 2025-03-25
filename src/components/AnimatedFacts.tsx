'use client';

import { useState, useEffect } from 'react';

const marketingFacts = [
  {
    title: "Aumento da Conversão",
    text: "Empresas B2B que adotam automação de marketing e vendas podem elevar suas taxas de conversão em até 50%.",
    source: "McKinsey, 2023"
  },
  {
    title: "Economia de Tempo",
    text: "A automação reduz em média até 30% o tempo gasto pela equipe comercial com tarefas repetitivas, permitindo mais foco em negociações.",
    source: "Salesforce State of Sales, 2024"
  },
  {
    title: "WhatsApp no Brasil",
    text: "Campanhas automatizadas no WhatsApp têm 81% mais abertura e até 40% mais engajamento que campanhas via e-mail.",
    source: "Meta/WhatsApp, 2024"
  },
  {
    title: "ROI Excepcional",
    text: "Sistemas de automação B2B geram em média um ROI de US$ 5,44 para cada US$ 1 investido, retorno médio de 544% em três anos.",
    source: "Nucleus Research, 2023"
  },
  {
    title: "Recuperação de Leads Frios",
    text: "Com automação e personalização, é possível reativar entre 2% e 5% da base de leads frios por ano, gerando novas oportunidades.",
    source: "RD Station, 2024"
  },
  {
    title: "IA Generativa no Marketing",
    text: "72% das empresas globais já adotam IA generativa para criar conteúdos personalizados, aumentando engajamento e conversão.",
    source: "McKinsey & Gartner, 2024"
  },
  {
    title: "Aumento no Ticket Médio",
    text: "Clientes nutridos por automações personalizadas gastam em média de 40% a 47% mais por compra.",
    source: "Forrester, 2024"
  },
  {
    title: "Redução do Ciclo de Vendas",
    text: "Empresas que usam automação personalizada encurtam seus ciclos comerciais em até 18%.",
    source: "Salesforce State of Sales, 2024"
  },
  {
    title: "Assistentes Virtuais Inteligentes",
    text: "Equipes de vendas que utilizam assistentes virtuais inteligentes com IA generativa podem aumentar em até 25% a produtividade comercial.",
    source: "NVIDIA Technical Blog, 2024"
  },
  {
    title: "Adoção em Vendas B2B",
    text: "No Brasil, 86% das empresas B2B já utilizam o WhatsApp como principal canal para vendas e relacionamento com clientes.",
    source: "RD Station, 2023"
  }
];

export default function AnimatedFacts() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      // Delay para a animação de saída
      setTimeout(() => {
        setCurrentFactIndex((prevIndex) => (prevIndex + 1) % marketingFacts.length);
        setIsAnimating(false);
      }, 500);
    }, 8000); // Muda a cada 8 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  const currentFact = marketingFacts[currentFactIndex];
  
  return (
    <div className="mt-6 bg-blue-50 rounded-lg p-6 shadow-sm" 
         aria-live="polite" 
         role="region" 
         aria-label="Fatos sobre automação de marketing">
      <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-xl font-bold text-blue-900 mb-3">{currentFact.title}</h3>
        <p className="text-gray-800 mb-3 text-md">{currentFact.text}</p>
        <p className="text-sm text-gray-600 italic">Fonte: {currentFact.source}</p>
      </div>
    </div>
  );
} 