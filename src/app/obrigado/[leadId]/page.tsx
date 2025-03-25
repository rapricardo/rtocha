'use client';

import { useEffect } from 'react';
import { use } from 'react';
import { storeLeadId } from '@/lib/hooks/useReturningLead';
import ReportStatusIndicator from '@/components/ReportStatusIndicator';
import Link from 'next/link';

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
            <h3 className="text-lg font-medium mb-4">Enquanto isso, você pode:</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Explorar nossos <Link href="/solucoes" className="text-blue-600 hover:underline">serviços de automação</Link></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Conhecer <Link href="/#cases" className="text-blue-600 hover:underline">casos de sucesso</Link> de outras empresas</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Agendar uma <Link href="/contato" className="text-blue-600 hover:underline">conversa com nossa equipe</Link></span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/" className="inline-block px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
} 