import { Metadata } from "next";
import { getServiceBySlug, getAllServices } from "@/lib/services/serviceQueries";
import { urlForImage } from "@/lib/sanity/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import ServiceHeader from "@/components/services/ServiceHeader";
import ServiceDetails from "@/components/services/ServiceDetails";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceHowItWorks from "@/components/services/ServiceHowItWorks";
import ServiceRequirements from "@/components/services/ServiceRequirements";
import ServiceMetrics from "@/components/services/ServiceMetrics";
import ServiceCTA from "@/components/services/ServiceCTA";
import PersonalizedServiceWrapper from "@/components/services/PersonalizedServiceWrapper";

// Gera os parâmetros para as páginas estáticas
export async function generateStaticParams() {
  const services = await getAllServices();
  
  return services.map((service: any) => ({
    slug: service.slug,
  }));
}

// Gera os metadados para SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  
  if (!service) {
    return {
      title: "Serviço não encontrado",
      description: "A página que você está procurando não existe.",
    };
  }
  
  return {
    title: `${service.name} | Ricardo Tocha`,
    description: service.shortDescription,
    openGraph: service.image ? {
      images: [{ url: urlForImage(service.image).url() }],
    } : undefined,
  };
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  
  if (!service) {
    notFound();
  }
  
  return (
    <main className="min-h-screen">
      {/* Banner personalizado para leads retornantes (Client Component) */}
      <div id="personalizedBanner" data-service-id={service._id} data-service-name={service.name}>
        <PersonalizedServiceWrapper serviceId={service._id} />
      </div>
      
      {/* Cabeçalho do serviço */}
      <ServiceHeader
        name={service.name}
        shortDescription={service.shortDescription}
        image={service.image}
      />
      
      {/* Detalhes completos do serviço */}
      <ServiceDetails 
        fullDescription={service.fullDescription} 
        problemsSolved={service.problemsSolved}
      />
      
      {/* Benefícios do serviço */}
      <ServiceBenefits benefitsHTML={service.benefitsHTML} />
      
      {/* Como o serviço funciona */}
      <ServiceHowItWorks howItWorks={service.howItWorks} />
      
      {/* Requisitos */}
      <ServiceRequirements requirements={service.requirements} />
      
      {/* Métricas de sucesso */}
      <ServiceMetrics metrics={service.metrics} timeframe={service.implementationTimeframe} />
      
      {/* Call-to-action */}
      <ServiceCTA serviceName={service.name} />
      
      {/* Serviços relacionados */}
      {service.relatedServices && service.relatedServices.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Serviços Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.relatedServices.map((relatedService) => (
                <div key={relatedService._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {relatedService.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={urlForImage(relatedService.image).width(600).height(400).url()} 
                        alt={relatedService.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{relatedService.name}</h3>
                    <p className="text-gray-600 mb-4">{relatedService.shortDescription}</p>
                    <Link 
                      href={`/solucoes/${relatedService.slug}`}
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
      )}
    </main>
  );
}
