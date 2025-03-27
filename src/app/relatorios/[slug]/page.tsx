import { Metadata } from 'next'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/sanity/client'
import { getReportBySlug } from '@/lib/sanity/queries'
import { Button } from '@/components/Button'
import { SectionTitle } from '@/components/SectionTitle'
import { PortableTextBlock } from '@/lib/types'
import { portableTextComponents } from '@/lib/portable-text/components'

// Defina os tipos necessários
type RecommendedService = {
  _key: string
  priority: number
  customProblemDescription: string
  customImpactDescription: string
  customBenefits: string[]
  service: {
    _id: string
    name: string
    slug?: string
    shortDescription: string
  }
}

type Report = {
  _id: string
  reportId: string
  reportTitle: string
  summary: string
  contextAnalysis: PortableTextBlock[]
  createdAt: string
  views: number
  lead: {
    name: string
    companyName: string
  }
  recommendedServices: RecommendedService[]
}

// Dados simulados para quando o relatório não é encontrado
const simulatedReport = {
  _id: 'simulated',
  reportId: 'simulated',
  reportTitle: 'Mini-Auditoria de Automação Personalizada',
  summary: 'Com base nas informações compartilhadas, a Empresa Fictícia tem potencial significativo para otimizar seus processos comerciais através de automação inteligente. O principal desafio identificado é escalar a equipe mantendo qualidade, com um objetivo claro de aumentar receita.',
  contextAnalysis: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'A Empresa Fictícia, com sua equipe de 51-200 colaboradores e uma estrutura de marketing interna, enfrenta o desafio comum de empresas em fase de crescimento: manter a qualidade e consistência enquanto escala suas operações. A equipe comercial de 4-10 vendedores indica um negócio com tração, mas o uso limitado do CRM sugere oportunidades significativas de otimização.'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Com uma maturidade digital intermediária e planos de implementar automação de marketing, a empresa está em um momento ideal para integrar soluções de automação inteligente que possam padronizar processos, reduzir tarefas manuais repetitivas e permitir que a equipe se concentre em atividades de maior valor. O objetivo de aumentar receita está diretamente alinhado com as recomendações de automação a seguir, que visam potencializar a performance da equipe comercial e otimizar o funil de vendas.'
        }
      ]
    }
  ],
  createdAt: new Date().toISOString(),
  views: 1,
  lead: {
    name: 'Usuário',
    companyName: 'Sua Empresa'
  },
  recommendedServices: [
    {
      _key: 'rec_1',
      priority: 1,
      customProblemDescription: 'Inconsistência no processo de vendas entre diferentes membros da equipe e perda de informações importantes durante negociações.',
      customImpactDescription: 'A falta de um processo padronizado resulta em ciclos de vendas mais longos e taxas de conversão abaixo do potencial, impactando diretamente na receita.',
      customBenefits: [
        'Aumento da taxa de conversão em 15-30% através de suporte em tempo real durante reuniões',
        'Padronização da excelência comercial entre todos os vendedores',
        'Registro automático de informações no CRM sem esforço manual'
      ],
      service: {
        _id: 'service-1',
        name: 'Assistente de Reuniões Integrado ao CRM',
        shortDescription: 'Sistema de apoio em tempo real para vendedores durante reuniões, fornecendo argumentos customizados e registrando informações automaticamente.'
      }
    },
    {
      _key: 'rec_2',
      priority: 2,
      customProblemDescription: 'Leads "esquecidos" no processo e oportunidades perdidas por falta de acompanhamento sistemático.',
      customImpactDescription: 'Cerca de 40% dos leads acabam não recebendo o devido acompanhamento, resultando em perda de receita potencial significativa.',
      customBenefits: [
        'Recuperação de 15-25% dos leads "esquecidos" através de sequências de follow-up personalizadas',
        'Reengajamento de clientes inativos ou prospects que não converteram',
        'Manutenção de relacionamento contínuo sem sobrecarregar a equipe comercial'
      ],
      service: {
        _id: 'service-2',
        name: 'Agente de Follow-up/Recuperação de Vendas',
        shortDescription: 'Sistema automatizado que identifica leads estagnados no funil de vendas e realiza follow-up personalizado.'
      }
    },
    {
      _key: 'rec_3',
      priority: 3,
      customProblemDescription: 'Informações fragmentadas entre departamentos e processos manuais redundantes.',
      customImpactDescription: 'A falta de integração entre sistemas resulta em retrabalho, inconsistências nos dados e ineficiência operacional.',
      customBenefits: [
        'Eliminação de 90% do trabalho manual de transferência de dados entre sistemas',
        'Criação de visão 360° do cliente com histórico completo de marketing e vendas',
        'Métricas unificadas de performance permitindo otimização baseada em dados'
      ],
      service: {
        _id: 'service-3',
        name: 'Integrações entre Sistemas de Marketing e Vendas',
        shortDescription: 'Ecossistema de automações que conecta ferramentas de marketing e vendas, eliminando silos de informação.'
      }
    }
  ]
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // Aguardar a resolução dos parâmetros antes de usá-los
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    const report = await client.fetch<Report | null>(getReportBySlug, { slug })
    
    if (!report) {
      return {
        title: `Mini-Auditoria de Automação | Ricardo Tocha`,
        description: 'Análise personalizada para identificar oportunidades de automação em processos de marketing e vendas.',
      }
    }

    return {
      title: `${report.reportTitle} | Ricardo Tocha`,
      description: report.summary.slice(0, 160),
    }
  } catch {
    return {
      title: `Mini-Auditoria de Automação | Ricardo Tocha`,
      description: 'Análise personalizada para identificar oportunidades de automação em processos de marketing e vendas.',
    }
  }
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  // Aguardar a resolução dos parâmetros
  const resolvedParams = await params;
  console.log("Buscando relatório com slug:", resolvedParams.slug);
  
  let report: Report | null = null;
  let isSimulated = false;
  
  try {
    report = await client.fetch<Report | null>(getReportBySlug, { slug: resolvedParams.slug })
    
    // Se encontrou o relatório, registrar visualização
    if (report) {
      console.log("Relatório encontrado:", report.reportTitle);
      
      try {
        await client
          .patch(report._id)
          .set({ 
            views: (report.views || 0) + 1,
            lastViewedAt: new Date().toISOString()
          })
          .commit()
      } catch (err) {
        console.error('Erro ao atualizar visualizações:', err)
      }
    }
  } catch (error) {
    console.error("Erro ao buscar relatório:", error);
  }
  
  // Se não encontrou o relatório ou ocorreu erro, usar o simulado
  if (!report) {
    console.log("Usando relatório simulado");
    report = simulatedReport;
    isSimulated = true;
  }

  return (
    <>
      {/* Ajustado pt-32 para pt-12 para compensar o pt-20 do layout global */}
      <div className="pt-12 pb-20"> 
        <div className="container mx-auto px-4">
          {/* Notificação de simulação */}
          {isSimulated && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Você está visualizando um exemplo de relatório. Para receber uma auditoria personalizada, complete o quiz.
                  </p>
                </div>
              </div>
            </div>
          )}
        
          {/* Cabeçalho do relatório */}
          <div className="mb-12 text-center">
            <span className="inline-block bg-[#d32b36]/10 text-[#d32b36] px-4 py-1 rounded-full text-sm font-medium mb-4">
              Mini-Auditoria Personalizada
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {report.reportTitle}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Preparado exclusivamente para {report.lead.name} da {report.lead.companyName}
            </p>
          </div>

          {/* Resumo do relatório */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-sm mb-12">
            <SectionTitle 
              title="Visão Geral" 
              subtitle="Análise inicial baseada nas informações compartilhadas"
            />
            <p className="text-lg text-gray-700 mt-4">
              {report.summary}
            </p>
          </div>

          {/* Análise de Contexto */}
          <div className="mb-12">
            <SectionTitle 
              title="Análise de Contexto" 
              subtitle="Entendendo seu cenário atual e oportunidades"
            />
            <div className="prose max-w-none mt-6 text-gray-700">
              <PortableText value={report.contextAnalysis} components={portableTextComponents} />
            </div>
          </div>

          {/* Serviços Recomendados */}
          <div className="mb-12">
            <SectionTitle 
              title="Serviços Recomendados" 
              subtitle="Soluções personalizadas para seu contexto específico"
            />

            <div className="space-y-8 mt-8">
              {report.recommendedServices.map(rec => {
                const priorityColors: Record<number, string> = {
                  1: "border-red-500 bg-red-50",
                  2: "border-orange-500 bg-orange-50",
                  3: "border-blue-500 bg-blue-50"
                };
                
                const priorityLabels: Record<number, string> = {
                  1: "Prioridade Alta",
                  2: "Prioridade Média",
                  3: "Prioridade Regular"
                };

                return (
                  <div 
                    key={rec._key} 
                    className={`border-l-4 rounded-2xl p-6 shadow-md ${priorityColors[rec.priority] || "border-gray-300"}`}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                      <h3 className="text-xl font-bold">{rec.service.name}</h3>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium inline-block ${
                        rec.priority === 1 ? "bg-red-100 text-red-700" : 
                        rec.priority === 2 ? "bg-orange-100 text-orange-700" : 
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {priorityLabels[rec.priority]}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 text-lg mb-2">Problema Identificado:</h4>
                      <p className="text-gray-600">{rec.customProblemDescription}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 text-lg mb-2">Impacto no Seu Negócio:</h4>
                      <p className="text-gray-600">{rec.customImpactDescription}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 text-lg mb-2">Benefícios:</h4>
                      <ul className="space-y-2">
                        {rec.customBenefits.map((benefit, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="w-5 h-5 text-[#d32b36] mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      href={rec.service.slug ? `/solucoes/${rec.service.slug}` : `/solucoes/${rec.service._id}`}
                    >
                      Saiba mais sobre este serviço
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#d32b36] to-[#eea04a] rounded-2xl p-8 text-white text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quer implementar estas recomendações?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Agende uma sessão estratégica gratuita de 30 minutos para discutir como 
              implementar estas recomendações na prática para seu negócio.
            </p>
            <Button 
              variant="accent" 
              size="lg"
              href="https://calendly.com/ricardotocha/sessao-estrategica"
              target="_blank"
            >
              Agendar Sessão Estratégica
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
