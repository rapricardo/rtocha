import Image from "next/image";
import { Button } from "@/components/Button";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionTitle } from "@/components/SectionTitle";
import { MobileMenu } from "@/components/MobileMenu";
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
    <main className="min-h-screen font-[family-name:var(--font-convergence)]">
      {/* Header / Navegação */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image 
              src="/images/logo-ricardotocha-vermelho.webp"
              alt="Ricardo Tocha Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#sobre" className="font-medium text-gray-700 hover:text-[#d32b36]">Sobre</a>
            <a href="#servicos" className="font-medium text-gray-700 hover:text-[#d32b36]">Serviços</a>
            <a href="#cta-section" className="font-medium text-gray-700 hover:text-[#d32b36]">Contato</a>
          </nav>
          <div className="hidden md:block">
            <Button 
              href="https://wa.me/5519991924835?text=Tocha%2C%20me%20ajuda%20a%20vender%20mais" 
              size="sm" 
              variant="primary"
              target="_blank"
            >
              Fale Comigo
            </Button>
          </div>
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Banner de boas-vindas para leads retornantes */}
      <div className="container mx-auto px-4 pt-32">
        <WelcomeBackWrapper />
      </div>

      {/* Hero Section */}
      <section className="pb-20 bg-gradient-to-br from-white via-gray-50 to-gray-100">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="mb-6 md:mb-0">
              <Image 
                src="/images/logo-ricardotocha-branco.webp"
                alt="Ricardo Tocha Logo"
                width={180}
                height={50}
                className="h-12 w-auto"
              />
              <p className="mt-4 text-gray-400">
                Ajudando profissionais de marketing e vendas a alcançarem mais resultados com menos esforço.
              </p>
              <p className="mt-2 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Ricardo Tocha. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end self-start">
              <div className="flex space-x-4">
                <a href="https://linkedin.com/in/ricardotocha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/ricardotocha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/ricardotocha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
