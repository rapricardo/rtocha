"use client";

import React from 'react';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Pergunta {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-blue-600">
          {percentage}% completo
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}