import Link from "next/link";

export const metadata = {
  title: "Termos de Serviço | Ricardo Tocha",
  description: "Termos de Serviço do site Ricardo Tocha - Automação Inteligente para Marketing e Vendas",
};

export default function TermsOfServicePage() {
  return (
    <>
      {/* Conteúdo */}
      {/* Ajustado pt-28 para pt-8 para compensar o pt-20 do layout global */}
      <div className="pt-8 pb-20">
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
                  &quot;como estão&quot;, sem garantias de qualquer tipo. Os resultados são baseados nas informações
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
    </>
  );
}
