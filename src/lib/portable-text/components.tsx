// src/lib/portable-text/components.ts
import { PortableTextComponents } from '@portabletext/react';

export const portableTextComponents: PortableTextComponents = {
  // Configuração para listas
  list: {
    // Lista não ordenada (bullet list)
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-3 mb-4">{children}</ul>
    ),
    // Lista ordenada (numbered list)
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-3 mb-4">{children}</ol>
    ),
  },
  
  // Configuração para itens de lista
  listItem: {
    // Item de lista normal
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
    // Item de lista numerada
    number: ({ children }) => <li className="mb-2">{children}</li>,
  },
  
  // Configuração para formatação de texto (marks)
  marks: {
    // Texto em negrito
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    // Texto em itálico
    em: ({ children }) => <em className="italic">{children}</em>,
    // Código inline
    code: ({ children }) => (
      <code className="bg-gray-100 rounded-sm px-1 py-0.5 font-mono text-sm">{children}</code>
    ),
    // Links
    link: ({ value, children }) => {
      const { href, blank } = value || {};
      return blank ? (
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="text-[#d32b36] hover:underline font-medium"
        >
          {children}
        </a>
      ) : (
        <a href={href} className="text-[#d32b36] hover:underline font-medium">
          {children}
        </a>
      );
    },
  },

  // Configuração para tipos de blocos
  block: {
    // Blocos normais (parágrafos)
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    // Cabeçalhos
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold mt-5 mb-2">{children}</h4>,
    // Citações
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-200 pl-4 py-1 mb-4 italic">
        {children}
      </blockquote>
    ),
  },
};
