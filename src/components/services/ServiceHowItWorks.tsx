import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { portableTextComponents } from "@/lib/portable-text/components.tsx";

interface ServiceHowItWorksProps {
  howItWorks?: PortableTextBlock[];
}

export default function ServiceHowItWorks({ howItWorks }: ServiceHowItWorksProps) {
  if (!howItWorks) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Como Funciona</h2>
          
          <div className="bg-gray-50 rounded-xl p-8 shadow-md">
            <div className="prose prose-lg max-w-none">
              <PortableText value={howItWorks} components={portableTextComponents} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
