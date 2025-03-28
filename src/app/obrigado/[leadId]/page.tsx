'use client';

import { useEffect } from 'react';
// import { useEffect } from 'react'; // Removed duplicate
import { use } from 'react';
import { storeLeadId } from '@/lib/hooks/useReturningLead';
import ReportStatusIndicator from '@/components/ReportStatusIndicator';
import AnimatedFacts from '@/components/AnimatedFacts';
// import Link from 'next/link'; // Removed unused import

export default function ThankYouPage({ params }: { params: Promise<{ leadId: string }> }) {
  // Desembrulhar o objeto params usando React.use()
  const { leadId } = use(params);
  
  // Armazenar leadId no localStorage para identificar lead retornante
  useEffect(() => {
    if (leadId) {
      storeLeadId(leadId);
    }
  }, [leadId]);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Estamos gerando seu relatório personalizado
          </h1>

        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {leadId ? (
            <ReportStatusIndicator leadId={leadId} />
          ) : (
            <div className="p-4 bg-red-100 text-red-800 rounded-md">
              ID do lead não encontrado. Por favor, tente novamente ou entre em contato com suporte.
            </div>
          )}
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Você sabia que...</h3>
            <AnimatedFacts />
          </div>
        </div>
      </div>
    </div>
  );
}
