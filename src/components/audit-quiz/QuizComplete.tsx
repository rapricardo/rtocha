"use client";

import React from 'react';
import Link from 'next/link';

interface QuizCompleteProps {
  preview: any;
  isLoading: boolean;
  onRequestFullReport: () => void;
  error: string | null;
}

export default function QuizComplete({
  preview,
  isLoading,
  onRequestFullReport,
  error
}: QuizCompleteProps) {
  if (isLoading && !preview) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Analisando suas respostas...
        </h3>
        <p className="text-gray-600">
          Estamos preparando sua mini-auditoria personalizada.
        </p>
      </div>
    );
  }

  if (error && !preview) {
    return (
      <div className="text-center py-10">
        <div className="inline-block rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Ocorreu um erro
        </h3>
        <p className="text-red-600 mb-4">
          {error}
        </p>
        <p className="text-gray-600">
          Por favor, tente novamente mais tarde ou entre em contato conosco.
        </p>
      </div>
    );
  }

  if (!preview) {
    return null;
  }

  return (
    <div className="py-4">
      <div className="text-center mb-6">
        <div className="inline-block rounded-full h-16 w-16 bg-green-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Sua mini-auditoria está pronta!
        </h3>
        <p className="text-gray-600">
          Aqui está um preview das oportunidades que identificamos para sua empresa.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Preview da mini-auditoria:</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-blue-600">SERVIÇO RECOMENDADO:</h5>
            <p className="text-gray-800 font-semibold">{preview.recommendedService}</p>
          </div>
          
          <div>
            <h5 className="font-medium text-blue-600">PROBLEMA RESOLVIDO:</h5>
            <p className="text-gray-800">{preview.problemSolved}</p>
          </div>
          
          <div>
            <h5 className="font-medium text-blue-600">BENEFÍCIO ESPERADO:</h5>
            <p className="text-gray-800">{preview.benefit}</p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-700">
            Sua auditoria completa contém mais {preview.additionalServices} serviços personalizados com detalhamento de implementação e exemplos de aplicação prática.
          </p>
        </div>
      </div>

      {preview.reportRequested ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Sua auditoria completa está pronta!
                </p>
              </div>
            </div>
            
            {preview.reportUrl ? (
              <Link 
                href={preview.reportUrl}
                className="block w-full md:w-auto px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition"
              >
                Ver minha auditoria completa
              </Link>
            ) : (
              <p className="text-gray-700">
                Seu relatório será gerado em breve e você terá acesso pela mesma URL.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button
            type="button"
            onClick={onRequestFullReport}
            disabled={isLoading}
            className={`w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></span>
                Gerando relatório...
              </>
            ) : (
              'Ver auditoria completa'
            )}
          </button>
          
          <p className="mt-4 text-sm text-gray-600">
            A auditoria completa estará disponível para acesso imediato após ser gerada.
          </p>
        </div>
      )}
    </div>
  );
}