import React from 'react';
import AuditQuiz from '@/components/audit-quiz/AuditQuiz';

export const metadata = {
  title: 'Mini-Auditoria de Automação | Ricardo Tocha',
  description: 'Descubra em 2 minutos como a automação pode transformar os resultados de marketing e vendas na sua empresa.'
};

export default function MiniAuditoriaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Descubra em 2 minutos como a automação pode transformar os resultados de marketing e vendas na sua empresa
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block mx-auto">
          <p className="text-blue-700 text-sm">
            Responda 13 perguntas rápidas e receba uma análise personalizada com recomendações
          </p>
        </div>
      </div>
      
      <AuditQuiz />
    </div>
  );
}