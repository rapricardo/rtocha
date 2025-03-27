import Image from "next/image";
import { Button } from "@/components/Button";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionTitle } from "@/components/SectionTitle";
import WelcomeBackWrapper from "@/components/personalization/WelcomeBackWrapper";

// Ícones SVG para os serviços
import LeadIcon from "@/components/icons/LeadIcon";
import ContentIcon from "@/components/icons/ContentIcon";
import WorkflowIcon from "@/components/icons/WorkflowIcon";
import IntegrationIcon from "@/components/icons/IntegrationIcon";
import AnalyticsIcon from "@/components/icons/AnalyticsIcon";

// Configuração de ISR
export const revalidate = 86400; // Revalidar a cada 24 horas

export default function Home() {
  return (
    <>
      {/* Banner de boas-vindas para leads retornantes */}
      {/* Ajustado para remover pt-32, pois pt-20 já está no layout global */}
      <div className="container mx-auto px-4 pt-12"> 
        <WelcomeBackWrapper />
      </div>

      {/* Hero Section */}
      {/* Removido pb-20, pode ser ajustado se necessário */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-gray-100 py-20"> 
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Mais resultados, <span className="text-[#d32b36]">menos esforço</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Ajudo profissionais de marketing e vendas a entregar mais resultados, 
              automatizando tarefas que consomem tempo e agregam pouco valor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/mini-auditoria" size="lg">Faça sua Mini-Auditoria Gratuita</Button>
            </div>
          </div>
          <div className="relative h-[400px] hero-image-container">
            <Image
              src="/images/personagem-_tocha_em_uma_camiseta_amarela_com_uma_postura_amigvel_e_receptiva_demonstrando_abertura_jzix2dyie3u1gj8e6a9f_2.webp"
              alt="Ricardo Tocha - Especialista em Automatização de Marketing"
              fill
              className="object-contain md:object-cover object-right rounded-2xl shadow-md hero-image"
              priority
            />
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px]">
            <Image
              src="/images/tocha_concentrado_trabalhando_em_um_mac_em_um_ambiente_moderno_e_bem_iluminado_4iok5b6eh8zw79pwchsc_0.webp"
              alt="Ricardo Tocha trabalhando"
              fill
              className="object-cover rounded-2xl shadow-xl"
            />
          </div>
          <div>
            <SectionTitle 
              title="Sobre Ricardo Tocha" 
              subtitle="Mais de 20 anos de experiência em marketing e tecnologia"
            />
            <p className="text-lg text-gray-700 mb-6">
              Sou especialista em automatizar processos de marketing e vendas, 
              ajudando profissionais a eliminar tarefas repetitivas e focar no que realmente importa: 
              estratégia e resultados.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Com mais de duas décadas de experiência unindo marketing e tecnologia, 
              desenvolvo soluções personalizadas que transformam a maneira como equipes trabalham, 
              trazendo mais eficiência e melhores resultados.
            </p>
            <p className="text-lg text-gray-700">
              Minha missão é eliminar o desperdício de tempo e talento em tarefas operacionais, 
              permitindo que profissionais de marketing e vendas alcancem seu verdadeiro potencial.
            </p>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section id="servicos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Como posso ajudar" 
            subtitle="Automatização inteligente que transforma resultados"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<LeadIcon className="w-12 h-12" />}
              title="Qualificação automática de leads"
              description="Identifique e priorize leads com maior potencial de conversão sem esforço manual."
              color="primary"
            />
            <ServiceCard 
              icon={<ContentIcon className="w-12 h-12" />}
              title="Geração de conteúdo"
              description="Crie conteúdo relevante para blogs e redes sociais de forma sistemática e eficiente."
              color="secondary"
            />
            <ServiceCard 
              icon={<WorkflowIcon className="w-12 h-12" />}
              title="Fluxos inteligentes para equipes"
              description="Otimize processos de trabalho com automações que eliminam etapas redundantes."
              color="accent"
            />
            <ServiceCard 
              icon={<IntegrationIcon className="w-12 h-12" />}
              title="Integração entre plataformas"
              description="Elimine o uso repetitivo de copiar e colar entre diferentes plataformas e ferramentas."
              color="primary"
            />
            <ServiceCard 
              icon={<AnalyticsIcon className="w-12 h-12" />}
              title="Apuração de resultados"
              description="Consolide dados de fontes diferentes para análise rápida e precisa de resultados."
              color="secondary"
            />
            <div className="bg-gradient-to-br from-[#d32b36] to-[#eea04a] rounded-2xl p-6 text-white flex flex-col justify-center shadow-md">
              <h3 className="text-2xl font-bold mb-4">Pronto para automatizar?</h3>
              <p className="mb-6">Transforme seu marketing e vendas com soluções personalizadas.</p>
              <Button 
                href="https://wa.me/5519991924835?text=Tocha%2C%20me%20ajuda%20a%20vender%20mais" 
                variant="accent" 
                className="self-start"
                target="_blank"
              >
                Vamos conversar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="py-20 bg-[#d32b36] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para entregar mais resultados com menos esforço?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Automatize suas tarefas repetitivas e libere tempo para o que realmente importa.
            Vamos construir juntos uma solução personalizada para suas necessidades.
          </p>
          <Button href="/mini-auditoria" variant="accent" size="lg">
            Faça sua Mini-Auditoria Gratuita
          </Button>
        </div>
      </section>
    </>
  );
}
