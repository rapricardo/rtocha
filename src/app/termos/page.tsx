import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/Button";

export const metadata = {
  title: "Termos de Serviço | Ricardo Tocha",
  description: "Termos de Serviço do site Ricardo Tocha - Automação Inteligente para Marketing e Vendas",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen font-[family-name:var(--font-convergence)]">
      {/* Header / Navegação */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <Image 
                src="/images/logo-ricardotocha-vermelho.webp"
                alt="Ricardo Tocha Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="/#sobre" className="font-medium text-gray-700 hover:text-[#d32b36]">Sobre</Link>
            <Link href="/#servicos" className="font-medium text-gray-700 hover:text-[#d32b36]">Serviços</Link>
            <Link href="/#cta-section" className="font-medium text-gray-700 hover:text-[#d32b36]">Contato</Link>
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

      {/* Conteúdo */}
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#d32b36]">Termos de Serviço</h1>
            
            <div className="space-y-8">
              <p className="text-base text-gray-700 mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ao acessar e utilizar o site Ricardo Tocha (ricardotocha.com.br), você concorda em 
                  cumprir e estar vinculado a estes Termos de Serviço. Se você não concordar com 
                  qualquer parte destes termos, por favor, não utilize nosso site ou serviços.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">2. Descrição dos Serviços</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ricardo Tocha oferece serviços de consultoria e implementação de automação inteligente 
                  para marketing e vendas, incluindo mas não se limitando a:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li className="text-gray-700 leading-relaxed">Consultoria em automação de processos</li>
                  <li className="text-gray-700 leading-relaxed">Implementação de soluções personalizadas</li>
                  <li className="text-gray-700 leading-relaxed">Integração entre plataformas de marketing e vendas</li>
                  <li className="text-gray-700 leading-relaxed">Criação de fluxos de trabalho automatizados</li>
                  <li className="text-gray-700 leading-relaxed">Auditorias de processos existentes</li>
                </ul>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">3. Uso do Site</h2>
                <p className="text-gray-700 leading-relaxed mb-4">Ao utilizar nosso site, você concorda em:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li className="text-gray-700 leading-relaxed">Fornecer informações precisas e atualizadas quando solicitado</li>
                  <li className="text-gray-700 leading-relaxed">Utilizar o site apenas para fins legítimos e de acordo com estes termos</li>
                  <li className="text-gray-700 leading-relaxed">Não utilizar o site de maneira que possa danificar, desabilitar ou sobrecarregar nossos servidores</li>
                  <li className="text-gray-700 leading-relaxed">Não tentar acessar áreas restritas do site ou nossos sistemas</li>
                  <li className="text-gray-700 leading-relaxed">Não utilizar ferramentas automatizadas para extrair dados do site sem autorização prévia</li>
                </ul>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">4. Propriedade Intelectual</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Todo o conteúdo disponibilizado no site Ricardo Tocha, incluindo textos, gráficos, 
                  logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, 
                  é propriedade de Ricardo Tocha ou de seus fornecedores de conteúdo e está protegido pelas 
                  leis brasileiras e internacionais de direitos autorais.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  O uso não autorizado de qualquer material contido neste site pode violar leis de direitos 
                  autorais, marcas registradas e outras leis aplicáveis.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">5. Mini-Auditoria e Ferramentas Gratuitas</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  A Mini-Auditoria e outras ferramentas gratuitas oferecidas em nosso site são disponibilizadas 
                  "como estão", sem garantias de qualquer tipo. Os resultados são baseados nas informações 
                  fornecidas e devem ser considerados como recomendações gerais, não como análises exaustivas.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ao utilizar estas ferramentas, você concorda que podemos entrar em contato para oferecer 
                  serviços relacionados às necessidades identificadas.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">6. Limitação de Responsabilidade</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ricardo Tocha não será responsável por quaisquer danos diretos, indiretos, incidentais, 
                  consequenciais ou punitivos resultantes do uso ou incapacidade de usar nossos serviços, 
                  ou por qualquer informação, produtos ou serviços obtidos através do nosso site.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Não garantimos que o site estará disponível ininterruptamente, sem atrasos ou erros. 
                  Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do site 
                  a qualquer momento sem aviso prévio.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">7. Links para Sites de Terceiros</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nosso site pode conter links para sites de terceiros. Estes links são fornecidos apenas 
                  para sua conveniência e não significam endorso ou responsabilidade pelo conteúdo desses sites. 
                  Ricardo Tocha não tem controle sobre esses sites e não é responsável por suas práticas de 
                  privacidade ou conteúdo.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">8. Modificações nos Termos</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer momento. As alterações 
                  entrarão em vigor imediatamente após sua publicação no site. O uso contínuo do site após a 
                  publicação de quaisquer modificações constitui aceitação dessas alterações.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">9. Contratos de Serviço</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Os serviços pagos oferecidos por Ricardo Tocha são regidos por contratos específicos, 
                  que serão fornecidos separadamente. Estes Termos de Serviço complementam, mas não substituem, 
                  os termos de qualquer contrato formal entre Ricardo Tocha e seus clientes.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">10. Lei Aplicável</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Estes Termos de Serviço são regidos pelas leis da República Federativa do Brasil. 
                  Qualquer disputa relacionada a estes termos será submetida à jurisdição exclusiva dos 
                  tribunais da cidade de São Paulo, SP.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">11. Contato</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Se você tiver dúvidas ou preocupações sobre estes Termos de Serviço, entre em contato 
                  através do e-mail: 
                  <a href="mailto:contato@ricardotocha.com.br" className="text-[#d32b36] hover:underline ml-1">contato@ricardotocha.com.br</a>
                </p>
              </div>
            </div>
            
            <div className="mt-12 border-t pt-6">
              <p className="text-gray-600">
                Ao utilizar nosso site e serviços, você concorda com estes Termos de Serviço.
              </p>
              <div className="mt-4">
                <Link href="/" className="text-[#d32b36] hover:underline">
                  Voltar para a página inicial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start">
            <div className="mb-6 w-full">
              <Link href="/">
                <Image 
                  src="/images/logo-ricardotocha-branco.webp"
                  alt="Ricardo Tocha Logo"
                  width={180}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
              <p className="mt-4 text-gray-400">
                Ajudando profissionais de marketing e vendas a alcançarem mais resultados com menos esforço.
              </p>
              
              <div className="mt-3 flex flex-wrap gap-4">
                <Link href="/privacidade" className="text-gray-400 hover:text-white text-sm">
                  Política de Privacidade
                </Link>
                <Link href="/termos" className="text-gray-400 hover:text-white text-sm">
                  Termos de Serviço
                </Link>
              </div>
              
              <p className="mt-3 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Ricardo Tocha. Todos os direitos reservados.
              </p>
            </div>
            
            <div className="flex space-x-4 self-start mt-2">
              <a href="https://linkedin.com/in/ricardotocha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://twitter.com/ricardotocha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://instagram.com/ricardotocha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}