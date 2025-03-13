"use client";

import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface QuestionProps {
  id: string;
  type: 'text' | 'email' | 'select';
  question: string;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
}

interface QuizQuestionProps {
  question: QuestionProps;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  error: string | null;
  showBack: boolean;
  isLast: boolean;
}

export default function QuizQuestion({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  error,
  showBack,
  isLast,
}: QuizQuestionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && question.type !== 'select') {
      onNext();
    }
  };

  return (
    <div className="space-y-6 min-h-[300px] flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800">
        {question.question}
      </h3>
      
      <div className="flex-grow">
        {question.type === 'select' ? (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  value === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <input
            type={question.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            autoFocus
          />
        )}
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <div className="flex justify-between pt-4">
        {showBack ? (
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            Voltar
          </button>
        ) : (
          <div></div>
        )}
        
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          {isLast ? 'Concluir' : 'Continuar'}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}