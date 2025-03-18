'use client';

import { useReturningLead } from '@/lib/hooks/useReturningLead';

interface ServiceCTAProps {
  serviceName: string;
}

export default function ServiceCTA({ serviceName }: ServiceCTAProps) {
  const { isReturningLead, isLoading, data } = useReturningLead();
  
  // Construir a mensagem de WhatsApp baseada nos dados do usuário
  const buildWhatsAppMessage = () => {
    if (isReturningLead && data?.lead?.name) {
      const leadName = data.lead.name;
      const companyName = data.lead.companyName || "minha empresa";
      return `Aqui é o ${leadName}, da ${companyName} e quero agendar uma conversa contigo sobre ${serviceName}`;
    }
    return `Quero agendar uma consultoria sobre ${serviceName}`;
  };
  
  const whatsAppMessage = encodeURIComponent(buildWhatsAppMessage());
  const whatsAppLink = `https://wa.me/5519991924835?text=${whatsAppMessage}`;

  return (
    <section id="agendar-consultoria" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Agende uma Consultoria</h2>
            <p className="text-lg text-gray-600 mb-8">
              Descubra como podemos implementar {serviceName} para seu negócio
            </p>
            
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-[#25D366] hover:bg-[#128C7E] transition duration-300 shadow-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.4539 3.5461C18.2473 1.33947 15.3018 0.122375 12.1688 0.122375C5.69008 0.122375 0.413924 5.39853 0.413924 11.8773C0.413924 13.9816 0.959917 16.0271 1.99288 17.8136L0.293945 24.1224L6.75382 22.4556C8.4692 23.3999 10.3924 23.8988 12.3535 23.8988H12.3605C12.3675 23.8988 12.3675 23.8988 12.3605 23.8988C18.8392 23.8988 24.1224 18.6226 24.1224 12.1438C24.1224 9.00384 22.8987 6.05271 20.4539 3.5461ZM12.1688 21.8954C10.3992 21.8954 8.66863 21.4175 7.15723 20.5077L6.77949 20.2867L2.93581 21.2519L3.91496 17.5041L3.67345 17.1123C2.67881 15.5406 2.15383 13.7402 2.15383 11.8773C2.15383 6.32532 6.61679 1.86236 12.1757 1.86236C14.7682 1.86236 17.2061 2.86397 19.0274 4.69225C20.8487 6.52053 21.8503 8.97236 21.8434 11.565C21.8364 17.1239 17.3735 21.8954 12.1688 21.8954ZM17.6583 14.3457C17.3616 14.1942 15.8781 13.4692 15.6022 13.3664C15.3264 13.2705 15.1262 13.2159 14.9261 13.5126C14.726 13.8093 14.1553 14.4856 13.9759 14.6858C13.7965 14.879 13.624 14.9059 13.3273 14.7544C11.7694 14.0018 10.7401 13.4085 9.70365 11.6359C9.42293 11.1511 10.0661 11.1789 10.6645 9.98239C10.7673 9.7822 10.7128 9.60891 10.6368 9.45741C10.5609 9.30591 9.93079 7.82235 9.6778 7.22875C9.42481 6.65603 9.17181 6.73891 8.97879 6.72797C8.79941 6.71704 8.59925 6.71704 8.39909 6.71704C8.19892 6.71704 7.8884 6.7929 7.61262 7.08967C7.33683 7.38643 6.55794 8.11142 6.55794 9.59498C6.55794 11.0786 7.63449 12.5135 7.78599 12.7136C7.94443 12.9138 9.91885 15.941 12.9144 17.2544C15.0217 18.1781 15.7745 18.2401 16.7137 18.0816C17.2883 17.9857 18.4781 17.3452 18.7312 16.6548C18.9843 15.9644 18.9843 15.3708 18.9083 15.2399C18.8392 15.0885 18.6391 15.004 18.3423 14.8525L17.6583 14.3457Z" />
              </svg>
              Agendar pelo WhatsApp
            </a>
            
            <p className="text-sm text-gray-500 mt-6">
              Você será redirecionado para o WhatsApp para agendar sua consultoria gratuita.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
