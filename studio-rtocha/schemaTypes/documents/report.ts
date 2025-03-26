// report.ts
import {defineField, defineType} from 'sanity'

export const reportType = defineType({
  name: 'report',
  title: 'Relatórios de Auditoria',
  type: 'document',
  groups: [
    {
      name: 'client',
      title: 'Dados do Cliente',
    },
    {
      name: 'overview',
      title: 'Visão Geral',
    },
    {
      name: 'recommendations',
      title: 'Recomendações',
    },
    {
      name: 'analytics',
      title: 'Analytics',
    },
  ],
  fields: [
    // Dados do cliente
    defineField({
      name: 'lead',
      title: 'Lead',
      type: 'reference',
      to: [{type: 'lead'}],
      validation: (rule) => rule.required(),
      group: 'client'
    }),
    defineField({
      name: 'reportId',
      title: 'ID do Relatório',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'client'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'reportId',
        maxLength: 96
      },
      validation: (rule) => rule.required(),
      group: 'client'
    }),
    defineField({
      name: 'createdAt',
      title: 'Data de Criação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'client'
    }),
    defineField({
      name: 'expiresAt',
      title: 'Data de Expiração',
      type: 'datetime',
      group: 'client'
    }),
    
    // Visão geral
    defineField({
      name: 'reportTitle',
      title: 'Título do Relatório',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'overview'
    }),
    defineField({
      name: 'summary',
      title: 'Resumo da Auditoria',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
      group: 'overview'
    }),
    defineField({
      name: 'contextAnalysis',
      title: 'Análise de Contexto',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Análise geral da empresa, desafios e objetivos',
      group: 'overview'
    }),
    
    // Recomendações
    defineField({
      name: 'recommendedServices',
      title: 'Serviços Recomendados',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'recommendedService',
          fields: [
            defineField({
              name: 'service',
              title: 'Serviço',
              type: 'reference',
              to: [{type: 'service'}],
              validation: (rule) => rule.required()
            }),
            defineField({
              name: 'priority',
              title: 'Prioridade',
              type: 'number',
              validation: (rule) => rule.required().min(1).max(3),
              options: {
                list: [
                  {title: 'Alta', value: 1},
                  {title: 'Média', value: 2},
                  {title: 'Baixa', value: 3},
                ]
              }
            }),
            defineField({
              name: 'customProblemDescription',
              title: 'Descrição do Problema Personalizada',
              type: 'text',
              rows: 3
            }),
            defineField({
              name: 'customImpactDescription',
              title: 'Descrição do Impacto Personalizada',
              type: 'text',
              rows: 3
            }),
            defineField({
              name: 'customBenefits',
              title: 'Benefícios Personalizados',
              type: 'array',
              of: [{type: 'string'}]
            })
          ],
          preview: {
            select: {
              title: 'service.name',
              priority: 'priority'
            },
            prepare({title, priority}) {
              const priorityLabel = priority === 1 ? 'Alta' : priority === 2 ? 'Média' : 'Baixa';
              return {
                title: title,
                subtitle: `Prioridade: ${priorityLabel}`
              }
            }
          }
        }
      ],
      group: 'recommendations'
    }),
    defineField({
      name: 'nextSteps',
      title: 'Próximos Passos',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Orientações para implementação das recomendações',
      group: 'recommendations'
    }),
    
    // Analytics
    defineField({
      name: 'views',
      title: 'Número de Visualizações',
      type: 'number',
      initialValue: 0,
      group: 'analytics'
    }),
    defineField({
      name: 'lastViewedAt',
      title: 'Última Visualização',
      type: 'datetime',
      group: 'analytics'
    }),
    defineField({
      name: 'callToActionClicked',
      title: 'CTA Clicado',
      type: 'boolean',
      initialValue: false,
      group: 'analytics'
    }),
    defineField({
      name: 'sessionBooked',
      title: 'Sessão Agendada',
      type: 'boolean',
      initialValue: false,
      group: 'analytics'
    }),
    defineField({
      name: 'sessionDate',
      title: 'Data da Sessão',
      type: 'datetime',
      group: 'analytics'
    }),
  ],
  preview: {
    select: {
      title: 'reportTitle',
      clientName: 'lead.name',
      companyName: 'lead.companyName',
      date: 'createdAt'
    },
    prepare({title, clientName, companyName, date}) {
      return {
        title: title,
        subtitle: `${clientName} - ${companyName} (${new Date(date).toLocaleDateString()})`
      }
    }
  }
})