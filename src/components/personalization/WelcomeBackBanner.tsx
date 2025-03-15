'use client';

import React from 'react';
import Link from 'next/link';
import { useReturningLead } from '@/lib/hooks/useReturningLead';

interface WelcomeBackBannerProps {
  className?: string;
}

export default function WelcomeBackBanner({ className = '' }: WelcomeBackBannerProps) {
  const { isReturningLead, isLoading, data } = useReturningLead();

  // Não mostrar nada enquanto carrega ou se não for lead retornante
  if (isLoading || !isReturningLead || !data) {
    return null;
  }

  const { lead, reports } = data;
  
  // Se não temos relatórios, não mostrar o banner
  if (!reports.length) {
    return null;
  }
  
  // Extrair informações relevantes do lead
  const firstName = lead.name?.split(' ')[0] || 'parceiro';
  const companyName = lead.companyName || 'sua empresa';
  
  // Determinar qual benefício mostrar baseado no improvementGoal
  let benefitText = 'otimizar seus resultados';
  
  if (lead.improvementGoal === 'increase_revenue') {
    benefitText = 'aumentar a receita';
  } else if (lead.improvementGoal === 'reduce_costs') {
    benefitText = 'reduzir custos operacionais';
  } else if (lead.improvementGoal === 'customer_experience') {
    benefitText = 'melhorar a experiência do cliente';
  } else if (lead.improvementGoal === 'optimize_processes') {
    benefitText = 'otimizar processos internos';
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 rounded-lg p-4 my-6 shadow-sm ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-gray-700">
            <span className="font-bold">Bem-vindo de volta, {firstName}!</span> Aqui está o plano para a {companyName} {benefitText} com nossas automações.
          </p>
          <div className="mt-3">
            <Link 
              href={`/relatorios/${reports[0].slug.current}`}
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Ver sua auditoria personalizada
              <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}