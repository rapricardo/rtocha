import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { portableTextComponents } from "@/lib/portable-text/components";

interface BenefitItem {
  _key?: string;
  benefit: string;
  description?: string;
}

interface ServiceBenefitsProps {
  benefitsHTML?: PortableTextBlock[];
  benefitsList?: BenefitItem[];
}

export default function ServiceBenefits({ benefitsHTML, benefitsList }: ServiceBenefitsProps) {
  // Se não houver benefícios, não renderiza o componente
  if (!benefitsHTML && (!benefitsList || benefitsList.length === 0)) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Benefícios</h2>
          
          {/* Exibe lista de benefícios com ícones se disponível */}
          {benefitsList && benefitsList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {benefitsList.map((benefit, index) => (
                <div key={benefit._key || index} className="bg-white rounded-xl p-5 shadow-md flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#d32b36] flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{benefit.benefit}</p>
                    {benefit.description && (
                      <p className="text-gray-600 text-sm mt-1">{benefit.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Exibe conteúdo HTML rico se disponível e não houver lista de benefícios */}
          {benefitsHTML && (!benefitsList || benefitsList.length === 0) && (
            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="prose prose-lg max-w-none">
                <PortableText value={benefitsHTML} components={portableTextComponents} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
