import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { portableTextComponents } from "@/lib/portable-text/components.tsx";

interface ServiceBenefitsProps {
  benefitsHTML?: PortableTextBlock[];
}

export default function ServiceBenefits({ benefitsHTML }: ServiceBenefitsProps) {
  if (!benefitsHTML) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Benefícios</h2>
          
          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="prose prose-lg max-w-none">
              <PortableText value={benefitsHTML} components={portableTextComponents} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
