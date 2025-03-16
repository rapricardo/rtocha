import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { portableTextComponents } from "@/lib/portable-text/components.tsx";

interface ServiceDetailsProps {
  fullDescription?: PortableTextBlock[];
  problemsSolved?: string[];
}

export default function ServiceDetails({ fullDescription, problemsSolved }: ServiceDetailsProps) {
  if (!fullDescription && (!problemsSolved || problemsSolved.length === 0)) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {fullDescription && (
          <div className="mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Sobre o Serviço</h2>
            <div className="prose prose-lg max-w-none">
              <PortableText value={fullDescription} components={portableTextComponents} />
            </div>
          </div>
        )}

        {problemsSolved && problemsSolved.length > 0 && (
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Problemas Que Resolvemos</h2>
            <div className="bg-gray-50 rounded-xl p-8 shadow-md">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problemsSolved.map((problem, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-4 mt-1 text-[#d32b36]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg">{problem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
