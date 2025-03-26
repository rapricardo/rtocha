// service.ts
import {defineField, defineType} from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Serviços',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Informações Básicas',
    },
    {
      name: 'details',
      title: 'Detalhes do Serviço',
    },
    {
      name: 'marketing',
      title: 'Marketing e Conversão',
    },
    {
      name: 'matching',
      title: 'Critérios de Recomendação',
    },
  ],
  fields: [
    // Informações básicas
    defineField({
      name: 'name',
      title: 'Nome do Serviço',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'basic'
    }),
    defineField({
      name: 'marketingTitle',
      title: 'Título de Marketing',
      description: 'Título mais impactante usado em materiais de marketing',
      type: 'string',
      group: 'basic'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: (rule) => rule.required(),
      group: 'basic'
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descrição Curta',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
      group: 'basic'
    }),
    defineField({
      name: 'marketingDescription',
      title: 'Descrição de Marketing',
      description: 'Versão mais persuasiva da descrição para uso em landing pages',
      type: 'text',
      rows: 4,
      group: 'marketing'
    }),
    defineField({
      name: 'image',
      title: 'Imagem do Serviço',
      type: 'image',
      options: {
        hotspot: true
      },
      group: 'basic'
    }),
    
    // Detalhes do serviço
    defineField({
      name: 'fullDescription',
      title: 'Descrição Completa',
      type: 'array',
      of: [{type: 'block'}],
      group: 'details'
    }),
    defineField({
      name: 'problemsSolved',
      title: 'Problemas Resolvidos',
      type: 'array',
      of: [{type: 'string'}],
      group: 'details'
    }),
    defineField({
      name: 'benefitsHTML',
      title: 'Benefícios (HTML)',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Lista de benefícios do serviço formatada em HTML',
      group: 'details'
    }),
    defineField({
      name: 'benefitsList',
      title: 'Lista de Benefícios',
      description: 'Benefícios em formato de lista com ícones',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'benefit',
            title: 'Benefício',
            type: 'string',
            validation: (rule) => rule.required()
          },
          {
            name: 'description',
            title: 'Descrição detalhada',
            type: 'text',
            rows: 2
          }
        ],
        preview: {
          select: {
            title: 'benefit'
          },
          prepare({title}) {
            return {
              title: `✅ ${title}`
            }
          }
        }
      }],
      group: 'marketing'
    }),
    defineField({
      name: 'howItWorks',
      title: 'Como Funciona',
      type: 'array',
      of: [{type: 'block'}],
      group: 'details'
    }),
    defineField({
      name: 'howItWorksSteps',
      title: 'Passos do Fluxo',
      description: 'Passos estruturados para visualização de fluxo',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'step',
          fields: [
            defineField({
              name: 'stepNumber',
              title: 'Número do Passo',
              type: 'number',
              validation: (rule) => rule.required().min(1)
            }),
            defineField({
              name: 'title',
              title: 'Título',
              type: 'string',
              validation: (rule) => rule.required()
            }),
            defineField({
              name: 'description',
              title: 'Descrição',
              type: 'text',
              rows: 3
            })
          ],
          preview: {
            select: {
              title: 'title',
              stepNumber: 'stepNumber'
            },
            prepare({title, stepNumber}) {
              return {
                title: `${stepNumber}. ${title}`
              }
            }
          }
        }
      ],
      group: 'details'
    }),
    defineField({
      name: 'requirements',
      title: 'Requisitos',
      type: 'array',
      of: [{type: 'string'}],
      description: 'O que o cliente precisa ter/fornecer para implementar este serviço',
      group: 'details'
    }),
    defineField({
      name: 'metrics',
      title: 'Métricas de Sucesso',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Indicadores para medir o sucesso da implementação',
      group: 'details'
    }),
    defineField({
      name: 'impactMetrics',
      title: 'Métricas de Impacto',
      description: 'Estatísticas concretas de resultados (ex: "Aumento de 40% em conversão")',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'metric',
            title: 'Métrica',
            type: 'string',
            validation: (rule) => rule.required()
          },
          {
            name: 'value',
            title: 'Valor',
            type: 'string',
            validation: (rule) => rule.required()
          },
          {
            name: 'description',
            title: 'Descrição',
            type: 'text',
            rows: 2
          }
        ],
        preview: {
          select: {
            metric: 'metric',
            value: 'value'
          },
          prepare({metric, value}) {
            return {
              title: `${metric}: ${value}`
            }
          }
        }
      }],
      group: 'marketing'
    }),
    defineField({
      name: 'implementationTimeframe',
      title: 'Tempo de Implementação',
      type: 'string',
      description: 'Estimativa de tempo para implementação completa',
      group: 'details'
    }),
    defineField({
      name: 'relatedServices',
      title: 'Serviços Relacionados',
      type: 'array',
      of: [{type: 'reference', to: {type: 'service'}}],
      group: 'details'
    }),
    // Elementos de marketing e conversão
    defineField({
      name: 'recommendedCTAs',
      title: 'CTAs Recomendados',
      description: 'Textos de call-to-action sugeridos para este serviço',
      type: 'array',
      of: [{type: 'string'}],
      group: 'marketing'
    }),
    defineField({
      name: 'faqs',
      title: 'Perguntas Frequentes',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'question',
            title: 'Pergunta',
            type: 'string',
            validation: (rule) => rule.required()
          },
          {
            name: 'answer',
            title: 'Resposta',
            type: 'array',
            of: [{type: 'block'}],
            validation: (rule) => rule.required()
          }
        ],
        preview: {
          select: {
            title: 'question'
          }
        }
      }],
      group: 'marketing'
    }),
    defineField({
      name: 'testimonials',
      title: 'Depoimentos',
      description: 'Depoimentos específicos para este serviço',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'quote',
            title: 'Citação',
            type: 'text',
            rows: 3,
            validation: (rule) => rule.required()
          },
          {
            name: 'author',
            title: 'Autor',
            type: 'string',
            validation: (rule) => rule.required()
          },
          {
            name: 'role',
            title: 'Cargo',
            type: 'string'
          },
          {
            name: 'company',
            title: 'Empresa',
            type: 'string'
          },
          {
            name: 'image',
            title: 'Imagem',
            type: 'image',
            options: {
              hotspot: true
            }
          }
        ],
        preview: {
          select: {
            title: 'author',
            subtitle: 'company',
            media: 'image'
          }
        }
      }],
      group: 'marketing'
    }),
    
    // Critérios de recomendação
    defineField({
      name: 'forCompanySize',
      title: 'Tamanhos de Empresa Ideais',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: '1-10 colaboradores', value: '1-10'},
          {title: '11-50 colaboradores', value: '11-50'},
          {title: '51-200 colaboradores', value: '51-200'},
          {title: '201-500 colaboradores', value: '201-500'},
          {title: 'Mais de 500 colaboradores', value: '500+'},
        ]
      },
      group: 'matching'
    }),
    defineField({
      name: 'forDigitalMaturity',
      title: 'Maturidade Digital Ideal',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Básica', value: 'basic'},
          {title: 'Intermediária', value: 'intermediate'},
          {title: 'Avançada', value: 'advanced'},
        ]
      },
      group: 'matching'
    }),
    defineField({
      name: 'forMainChallenges',
      title: 'Desafios Principais Relacionados',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Gerar leads qualificados', value: 'qualified_leads'},
          {title: 'Aumentar taxa de conversão', value: 'conversion_rate'},
          {title: 'Reduzir ciclo de vendas', value: 'sales_cycle'},
          {title: 'Melhorar retenção de clientes', value: 'retention'},
          {title: 'Escalar equipe mantendo qualidade', value: 'scaling'},
        ]
      },
      group: 'matching'
    }),
    defineField({
      name: 'forImprovementGoals',
      title: 'Objetivos de Melhoria Relacionados',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Aumentar receita', value: 'increase_revenue'},
          {title: 'Reduzir custos operacionais', value: 'reduce_costs'},
          {title: 'Melhorar experiência do cliente', value: 'customer_experience'},
          {title: 'Otimizar processos internos', value: 'optimize_processes'},
        ]
      },
      group: 'matching'
    }),
    defineField({
      name: 'priority',
      title: 'Prioridade na Recomendação',
      type: 'number',
      description: 'Números maiores aparecem primeiro nas recomendações',
      validation: (rule) => rule.required().min(1).max(10),
      initialValue: 5,
      group: 'matching'
    }),
    // Campos para personalização
    defineField({
      name: 'personalization',
      title: 'Personalização',
      type: 'object',
      group: 'details',
      fields: [
        defineField({
          name: 'howItWorksSteps',
          title: 'Passos de Como Funciona',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Título',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Descrição',
                  type: 'text',
                  rows: 3,
                }),
                defineField({
                  name: 'image',
                  title: 'Imagem',
                  type: 'image',
                  options: {
                    hotspot: true
                  },
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  media: 'image'
                }
              }
            }
          ]
        }),
        defineField({
          name: 'ctaOptions',
          title: 'Opções de CTA',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'type',
                  title: 'Tipo',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Jornal', value: 'newspaper'},
                      {title: 'WhatsApp', value: 'whatsapp'},
                      {title: 'Resultados', value: 'results'},
                    ]
                  },
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'heading',
                  title: 'Título',
                  type: 'string',
                }),
                defineField({
                  name: 'text',
                  title: 'Texto',
                  type: 'text',
                  rows: 2,
                }),
                defineField({
                  name: 'buttonText',
                  title: 'Texto do Botão',
                  type: 'string',
                }),
                defineField({
                  name: 'buttonUrl',
                  title: 'URL do Botão',
                  type: 'string',
                }),
              ]
            }
          ]
        }),
      ]
    }),
  ],
  preview: {
    select: {
      title: 'name',
      marketingTitle: 'marketingTitle',
      subtitle: 'shortDescription',
      media: 'image'
    },
    prepare({title, marketingTitle, subtitle, media}) {
      return {
        title: marketingTitle || title,
        subtitle,
        media
      }
    }
  }
})