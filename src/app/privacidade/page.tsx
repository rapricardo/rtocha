import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Política de Privacidade | Ricardo Tocha",
  description: "Política de Privacidade do site Ricardo Tocha - Automação Inteligente para Marketing e Vendas",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen font-[family-name:var(--font-convergence)]">
      {/* Header / Navegação */}
      <Header />

      {/* Conteúdo */}
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#d32b36]">Política de Privacidade</h1>
            
            <div className="space-y-8">
              <p className="text-base text-gray-700 mb-4">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">1. Introdução</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ricardo Tocha ("nós", "nosso" ou "site") valoriza a privacidade dos visitantes e usuários 
                  do nosso site. Esta Política de Privacidade detalha como coletamos, usamos e protegemos 
                  suas informações pessoais quando você visita ou utiliza nossos serviços.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">2. Informações que coletamos</h2>
                <p className="text-gray-700 leading-relaxed mb-4">Podemos coletar os seguintes tipos de informações:</p>
                <ul className="list-disc pl-6 mb-6 space-y-3">
                  <li className="text-gray-700 leading-relaxed">
                    <strong>Informações de contato:</strong> Nome, e-mail, telefone, empresa, cargo que você 
                    fornece voluntariamente ao solicitar informações, realizar a mini-auditoria ou entrar em 
                    contato conosco.
                  </li>
                  <li className="text-gray-700 leading-relaxed">
                    <strong>Informações de uso:</strong> Dados sobre como você interage com nosso site, incluindo 
                    páginas visitadas, tempo de permanência e recursos utilizados.
                  </li>
                  <li className="text-gray-700 leading-relaxed">
                    <strong>Informações do dispositivo:</strong> Tipo de dispositivo, sistema operacional, 
                    tipo de navegador e outras tecnologias usadas para acessar nosso site.
                  </li>
                  <li className="text-gray-700 leading-relaxed">
                    <strong>Cookies e tecnologias similares:</strong> Utilizamos cookies e tecnologias similares 
                    para melhorar a experiência do usuário, analisar tendências e administrar o site.
                  </li>
                </ul>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">3. Como usamos suas informações</h2>
                <p className="text-gray-700 leading-relaxed mb-4">Utilizamos as informações coletadas para:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li className="text-gray-700 leading-relaxed">Fornecer e melhorar nossos serviços</li>
                  <li className="text-gray-700 leading-relaxed">Processar solicitações e responder a consultas</li>
                  <li className="text-gray-700 leading-relaxed">Personalizar sua experiência em nosso site</li>
                  <li className="text-gray-700 leading-relaxed">Enviar materiais promocionais, atualizações e comunicações relevantes</li>
                  <li className="text-gray-700 leading-relaxed">Analisar tendências de uso e otimizar nosso site</li>
                  <li className="text-gray-700 leading-relaxed">Cumprir obrigações legais</li>
                </ul>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">4. Compartilhamento de informações</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Não vendemos, comercializamos ou transferimos suas informações pessoais para terceiros, 
                  exceto em situações específicas:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li className="text-gray-700 leading-relaxed">Para prestadores de serviços que nos auxiliam nas operações do site</li>
                  <li className="text-gray-700 leading-relaxed">Para cumprir requisitos legais, proteger direitos ou segurança</li>
                  <li className="text-gray-700 leading-relaxed">Em caso de fusão, aquisição ou venda de ativos, mediante aviso prévio</li>
                </ul>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">5. Proteção de dados</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações 
                  contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método 
                  de transmissão pela internet é 100% seguro, e não podemos garantir segurança absoluta.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">6. Seus direitos</h2>
                <p className="text-gray-700 leading-relaxed mb-4">De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li className="text-gray-700 leading-relaxed">Acessar os dados pessoais que temos sobre você</li>
                  <li className="text-gray-700 leading-relaxed">Corrigir dados incompletos, imprecisos ou desatualizados</li>
                  <li className="text-gray-700 leading-relaxed">Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li className="text-gray-700 leading-relaxed">Revogar o consentimento para processamento de seus dados</li>
                  <li className="text-gray-700 leading-relaxed">Solicitar a portabilidade dos dados para outro fornecedor de serviço</li>
                </ul>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">7. Retenção de dados</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Mantemos suas informações pessoais pelo tempo necessário para cumprir as finalidades 
                  descritas nesta Política de Privacidade, a menos que um período de retenção mais longo 
                  seja exigido por lei.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">8. Alterações nesta política</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente 
                  estará sempre disponível nesta página, com a data da última atualização. Recomendamos 
                  que você revise esta política regularmente.
                </p>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#d32b36] mb-4">9. Contato</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre o 
                  tratamento de seus dados pessoais, entre em contato através do e-mail: 
                  <a href="mailto:contato@ricardotocha.com.br" className="text-[#d32b36] hover:underline ml-1">contato@ricardotocha.com.br</a>
                </p>
              </div>
            </div>
            
            <div className="mt-12 border-t pt-6">
              <p className="text-gray-600">
                Ao utilizar nosso site, você concorda com os termos desta Política de Privacidade.
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
      <Footer />
    </main>
  );
}