import { Metadata } from "next";
import Link from "next/link";
import { getAllServices } from "@/lib/services/serviceQueries";
import { urlForImage } from "@/lib/sanity/image";
import Image from 'next/image'; // Import Image
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Soluções de Automação | Ricardo Tocha",
  description: "Conheça nossas soluções de automação inteligente para marketing e vendas que aumentam resultados com menos esforço.",
};

export default async function ServicesPage() {
  const services = await getAllServices();
  
  return (
    <main className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-[#d32b36] to-[#e67a48] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Soluções de Automação Inteligente</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Transforme sua estratégia de marketing e vendas com automações que aumentam resultados e reduzem esforço manual.
          </p>
        </div>
      </section>
      
      {/* Services grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Nossas Soluções"
            subtitle="Conheça as soluções de automação que desenvolvemos para resolver desafios específicos de marketing e vendas"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Define a more specific type for service, including image asset structure */}
            {services.map((service: { _id: string; name: string; shortDescription: string; slug: string; image?: { asset?: { _ref?: string; url?: string } } }) => (
              <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {service.image && (
                  <div className="relative h-48 overflow-hidden"> {/* Added relative */}
                    <Image 
                      src={urlForImage(service.image).url()} // Use base URL
                      alt={service.name}
                      fill // Use fill
                      className="object-cover" // Keep object-cover
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{service.name}</h2>
                  <p className="text-gray-600 mb-6">{service.shortDescription}</p>
                  <Link 
                    href={`/solucoes/${service.slug}`}
                    className="inline-block bg-[#d32b36] hover:bg-[#b22026] text-white font-medium py-2 px-4 rounded-md transition duration-300"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Não sabe por onde começar?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Faça nossa mini-auditoria gratuita e receba um diagnóstico personalizado com recomendações específicas para seu negócio.
          </p>
          <Link 
            href="/mini-auditoria"
            className="inline-block bg-[#d32b36] hover:bg-[#b22026] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300"
          >
            Fazer Diagnóstico Gratuito
          </Link>
        </div>
      </section>
    </main>
  );
}
