"use client";

import { useState } from 'react';
import { Button } from './Button';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="flex items-center p-2 rounded-md text-gray-700 hover:text-[#d32b36] hover:bg-gray-100"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          )}
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md py-3 px-4 z-20">
          <nav className="flex flex-col space-y-3">
            <a 
              href="/#sobre" 
              className="py-2 text-gray-700 hover:text-[#d32b36]"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </a>
            <a 
              href="/#servicos" 
              className="py-2 text-gray-700 hover:text-[#d32b36]"
              onClick={() => setIsOpen(false)}
            >
              Serviços
            </a>
            <a 
              href="/#cta-section" 
              className="py-2 text-gray-700 hover:text-[#d32b36]"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </a>
            <Button 
              href="https://wa.me/5519991924835?text=Tocha%2C%20me%20ajuda%20a%20vender%20mais" 
              className="w-full mt-2"
              target="_blank"
              onClick={() => setIsOpen(false)}
            >
              Fale Comigo
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}