// lead.ts
import {defineField, defineType} from 'sanity'

export const leadType = defineType({
  name: 'lead',
  title: 'Leads',
  type: 'document',
  groups: [
    {
      name: 'personal',
      title: 'Dados Pessoais',
    },
    {
      name: 'company',
      title: 'Dados da Empresa',
    },
    {
      name: 'assessment',
      title: 'Avaliação',
    },
    {
      name: 'engagement',
      title: 'Engajamento',
    },
    {
      name: 'personalization',
      title: 'Personalização',
    },
  ],
  fields: [
    // Dados pessoais
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'personal'
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
      group: 'personal'
    }),
    defineField({
      name: 'phone',
      title: 'Telefone/WhatsApp',
      type: 'string',
      group: 'personal'
    }),
    defineField({
      name: 'linkedInUrl',
      title: 'Perfil LinkedIn',
      type: 'string',
      group: 'personal'
    }),
    defineField({
      name: 'jobTitle',
      title: 'Cargo',
      type: 'string',
      group: 'personal'
    }),
    
    // Dados da empresa
    defineField({
      name: 'companyName',
      title: 'Nome da Empresa',
      type: 'string',
      group: 'company'
    }),
    defineField({
      name: 'companySize',
      title: 'Tamanho da Empresa',
      type: 'string',
      options: {
        list: [
          {title: '1-10 colaboradores', value: '1-10'},
          {title: '11-50 colaboradores', value: '11-50'},
          {title: '51-200 colaboradores', value: '51-200'},
          {title: '201-500 colaboradores', value: '201-500'},
          {title: 'Mais de 500 colaboradores', value: '500+'},
        ]
      },
      group: 'company'
    }),
    defineField({
      name: 'industry',
      title: 'Segmento/Indústria',
      type: 'string',
      options: {
        list: [
          // Tecnologia
          {title: 'SaaS/Software', value: 'saas'},
          {title: 'TI/Tecnologia da Informação', value: 'it'},
          {title: 'Desenvolvimento Web/Apps', value: 'webdev'},
          
          // Comércio
          {title: 'E-commerce', value: 'ecommerce'},
          {title: 'Varejo Físico', value: 'retail'},
          {title: 'Atacado/Distribuição', value: 'wholesale'},
          
          // Serviços Profissionais
          {title: 'Advocacia/Jurídico', value: 'legal'},
          {title: 'Contabilidade/Finanças', value: 'accounting'},
          {title: 'Consultoria de Negócios', value: 'consulting'},
          {title: 'Agência de Marketing/Publicidade', value: 'agency'},
          {title: 'Imobiliário', value: 'realestate'},
          {title: 'Arquitetura/Design', value: 'architecture'},
          
          // Setores Específicos
          {title: 'Construção Civil', value: 'construction'},
          {title: 'Educação/Treinamento', value: 'education'},
          {title: 'Saúde/Healthcare', value: 'healthcare'},
          {title: 'Finanças/Fintech', value: 'finance'},
          {title: 'Manufatura/Indústria', value: 'manufacturing'},
          {title: 'Logística/Transporte', value: 'logistics'},
          {title: 'Alimentação/Restaurantes', value: 'food'},
          {title: 'Hotelaria/Turismo', value: 'hospitality'},
          
          // B2B e B2C
          {title: 'B2B/Serviços Empresariais', value: 'b2b'},
          {title: 'B2C/Serviços ao Consumidor', value: 'b2c'},
          
          // Outros
          {title: 'Terceiro Setor/ONGs', value: 'nonprofit'},
          {title: 'Setor Público/Governo', value: 'government'},
          {title: 'Outro', value: 'other'},
        ]
      },
      group: 'company'
    }),
    defineField({
      name: 'companySite',
      title: 'Site da Empresa',
      type: 'string',
      group: 'company'
    }),
    defineField({
      name: 'marketingStructure',
      title: 'Estrutura de Marketing',
      type: 'string',
      options: {
        list: [
          {title: 'Equipe interna', value: 'internal_team'},
          {title: 'Agência externa', value: 'external_agency'},
          {title: 'Modelo híbrido', value: 'hybrid'},
          {title: 'Sem marketing estruturado', value: 'unstructured'},
        ]
      },
      group: 'company'
    }),
    defineField({
      name: 'salesTeamSize',
      title: 'Tamanho da Equipe Comercial',
      type: 'string',
      options: {
        list: [
          {title: 'Somente sócios/fundadores', value: 'founders_only'},
          {title: '1-3 vendedores', value: '1-3'},
          {title: '4-10 vendedores', value: '4-10'},
          {title: '11+ vendedores', value: '11+'},
        ]
      },
      group: 'company'
    }),
    defineField({
      name: 'clientAcquisitionStrategy',
      title: 'Estratégia de Aquisição',
      type: 'string',
      options: {
        list: [
          {title: 'Principalmente inbound (80%+)', value: 'mainly_inbound'},
          {title: 'Principalmente outbound (80%+)', value: 'mainly_outbound'},
          {title: 'Mix equilibrado de ambas', value: 'balanced_mix'},
          {title: 'Sem estratégia definida', value: 'undefined'},
        ]
      },
      group: 'company'
    }),
    defineField({
      name: 'usesCRM',
      title: 'Usa CRM',
      type: 'string',
      options: {
        list: [
          {title: 'Sim, usamos ativamente', value: 'active_use'},
          {title: 'Sim, mas com uso limitado', value: 'limited_use'},
          {title: 'Não, mas estamos avaliando', value: 'evaluating'},
          {title: 'Não usamos', value: 'no_use'},
        ]
      },
      group: 'company'
    }),
    defineField({
      name: 'usesMarketingAutomation',
      title: 'Usa Automação de Marketing',
      type: 'string',
      options: {
        list: [
          {title: 'Sim, integrada com vendas', value: 'integrated'},
          {title: 'Sim, mas isolada de vendas', value: 'isolated'},
          {title: 'Não, mas planejamos implementar', value: 'planning'},
          {title: 'Não usamos', value: 'no_use'},
        ]
      },
      group: 'company'
    }),
    
    // Campos de avaliação
    defineField({
      name: 'mainChallenge',
      title: 'Desafio Principal',
      type: 'string',
      options: {
        list: [
          {title: 'Gerar leads qualificados', value: 'qualified_leads'},
          {title: 'Aumentar taxa de conversão', value: 'conversion_rate'},
          {title: 'Reduzir ciclo de vendas', value: 'sales_cycle'},
          {title: 'Melhorar retenção de clientes', value: 'retention'},
          {title: 'Escalar equipe mantendo qualidade', value: 'scaling'},
          {title: 'Outro', value: 'other'},
        ]
      },
      group: 'assessment'
    }),
    defineField({
      name: 'mainChallengeDescription',
      title: 'Descrição do Desafio Principal',
      type: 'text',
      group: 'assessment'
    }),
    defineField({
      name: 'improvementGoal',
      title: 'Objetivo de Melhoria',
      type: 'string',
      options: {
        list: [
          {title: 'Aumentar receita', value: 'increase_revenue'},
          {title: 'Reduzir custos operacionais', value: 'reduce_costs'},
          {title: 'Melhorar experiência do cliente', value: 'customer_experience'},
          {title: 'Otimizar processos internos', value: 'optimize_processes'},
          {title: 'Outro', value: 'other'},
        ]
      },
      group: 'assessment'
    }),
    defineField({
      name: 'maturidadeDigital',
      title: 'Maturidade Digital',
      type: 'string',
      options: {
        list: [
          {title: 'Básica', value: 'basic'},
          {title: 'Intermediária', value: 'intermediate'},
          {title: 'Avançada', value: 'advanced'},
        ]
      },
      group: 'assessment'
    }),
    
    // Campos de engajamento
    defineField({
      name: 'recommendedServices',
      title: 'Serviços Recomendados',
      type: 'array',
      of: [{type: 'reference', to: {type: 'service'}}],
      group: 'engagement'
    }),
    defineField({
      name: 'auditSummary',
      title: 'Resumo da Auditoria',
      type: 'text',
      group: 'engagement'
    }),
    defineField({
      name: 'reportGenerated',
      title: 'Relatório Gerado',
      type: 'boolean',
      initialValue: false,
      group: 'engagement'
    }),
    defineField({
      name: 'reportAccessedAt',
      title: 'Data de Acesso ao Relatório',
      type: 'datetime',
      group: 'engagement'
    }),
    defineField({
      name: 'report',
      title: 'Relatório',
      type: 'reference',
      to: [{type: 'report'}],
      group: 'engagement'
    }),
    // Campo para controlar o status da geração do relatório
    defineField({
      name: 'reportStatus',
      title: 'Status da Geração do Relatório',
      description: 'Controla o estado do processo de geração automática do relatório',
      type: 'object',
      group: 'engagement',
      fields: [
        defineField({
          name: 'status',
          title: 'Status',
          type: 'string',
          options: {
            list: [
              {title: 'Em Fila', value: 'queued'},
              {title: 'Processando', value: 'processing'},
              {title: 'Concluído', value: 'completed'},
              {title: 'Parcial', value: 'partial'},
              {title: 'Falhou', value: 'failed'}
            ]
          }
        }),
        defineField({
          name: 'message',
          title: 'Mensagem',
          type: 'string',
          description: 'Mensagem explicativa sobre o status atual'
        }),
        defineField({
          name: 'updatedAt',
          title: 'Atualizado em',
          type: 'datetime',
          description: 'Quando o status foi atualizado pela última vez'
        }),
        defineField({
          name: 'attempts',
          title: 'Tentativas',
          type: 'number',
          description: 'Número de tentativas de geração',
          initialValue: 0
        })
      ]
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Novo', value: 'new'},
          {title: 'Qualificado', value: 'qualified'},
          {title: 'Em contato', value: 'in_contact'},
          {title: 'Convertido', value: 'converted'},
          {title: 'Não qualificado', value: 'unqualified'},
          {title: 'Inativo', value: 'inactive'},
        ]
      },
      initialValue: 'new',
      group: 'engagement'
    }),
    defineField({
      name: 'origin',
      title: 'Origem',
      type: 'string',
      options: {
        list: [
          {title: 'Assistente WhatsApp', value: 'whatsapp'},
          {title: 'Formulário Site', value: 'website_form'},
          {title: 'LinkedIn', value: 'linkedin'},
          {title: 'Instagram', value: 'instagram'},
          {title: 'Outro', value: 'other'},
        ]
      },
      group: 'engagement'
    }),
    defineField({
      name: 'createdAt',
      title: 'Data de Criação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'engagement'
    }),
    defineField({
      name: 'updatedAt',
      title: 'Última Atualização',
      type: 'datetime',
      group: 'engagement'
    }),
    // Campos que estão faltando no schema
    defineField({
      name: 'reportRequested',
      title: 'Relatório Solicitado',
      type: 'boolean',
      initialValue: false,
      group: 'engagement'
    }),
    defineField({
      name: 'reportRequestedAt',
      title: 'Data de Solicitação do Relatório',
      type: 'datetime',
      group: 'engagement'
    }),
    defineField({
      name: 'usesAutomation',
      title: 'Usa Automação',
      type: 'string',
      options: {
        list: [
          {title: 'Sim, integrada com vendas', value: 'integrated'},
          {title: 'Sim, mas isolada de vendas', value: 'isolated'},
          {title: 'Não, mas planejamos implementar', value: 'planning'},
          {title: 'Não usamos', value: 'no_use'},
        ]
      },
      group: 'company'
    }),
    // Campos para personalização
    defineField({
      name: 'customImages',
      title: 'Imagens Personalizadas (Formato Antigo)',
      description: 'DEPRECATED - Use o campo "Imagens Personalizadas (URLs)" para novas imagens',
      type: 'object',
      group: 'personalization',
      fields: [
        defineField({
          name: 'welcomeImage',
          title: 'Imagem de Boas-vindas',
          type: 'image',
          description: 'Imagem personalizada para a home (você segurando uma placa)',
        }),
        defineField({
          name: 'ctaServiceImage',
          title: 'Imagem CTA Serviço (Jornal)',
          type: 'image',
          description: 'Imagem personalizada tipo manchete de jornal',
        }),
        defineField({
          name: 'ctaWhatsappImage',
          title: 'Imagem CTA WhatsApp',
          type: 'image',
          description: 'Imagem personalizada com telefone na mão',
        }),
        defineField({
          name: 'resultsImage',
          title: 'Imagem de Resultados',
          type: 'image',
          description: 'Imagem personalizada mostrando resultados',
        }),
      ]
    }),
    // NOVO CAMPO - URLs das imagens personalizadas
    defineField({
      name: 'customImagesUrls',
      title: 'Imagens Personalizadas (URLs)',
      description: 'URLs para imagens geradas e armazenadas externamente',
      type: 'object',
      group: 'personalization',
      fields: [
        defineField({
          name: 'welcomeImageUrl',
          title: 'URL da Imagem de Boas-vindas',
          type: 'url',
          description: 'URL da imagem personalizada para a home',
        }),
        defineField({
          name: 'ctaServiceImageUrl',
          title: 'URL da Imagem CTA Serviço',
          type: 'url',
          description: 'URL da imagem personalizada para CTA de serviço',
        }),
        defineField({
          name: 'ctaWhatsappImageUrl',
          title: 'URL da Imagem CTA WhatsApp',
          type: 'url',
          description: 'URL da imagem personalizada para CTA de WhatsApp',
        }),
        defineField({
          name: 'resultsImageUrl',
          title: 'URL da Imagem de Resultados',
          type: 'url',
          description: 'URL da imagem personalizada mostrando resultados',
        }),
      ]
    }),
    defineField({
      name: 'companyAnalysis',
      title: 'Análise da Empresa',
      type: 'object',
      group: 'personalization',
      fields: [
        defineField({
          name: 'perplexitySummary',
          title: 'Resumo Perplexity',
          type: 'text',
          rows: 6,
          description: 'Análise do site da empresa via Perplexity',
        }),
        defineField({
          name: 'linkedinAnalysis',
          title: 'Análise LinkedIn',
          type: 'text',
          rows: 6,
          description: 'Análise do perfil da empresa no LinkedIn',
        }),
        defineField({
          name: 'leadLinkedinAnalysis',
          title: 'Análise LinkedIn do Lead',
          type: 'text',
          rows: 6,
          description: 'Análise do perfil do lead no LinkedIn (quando disponível)',
        }),
        defineField({
          name: 'emotionalPitch',
          title: 'Resumo Vendedor Emocional',
          type: 'text',
          rows: 4,
          description: 'Resumo com foco emocional para áreas personalizadas',
        }),
      ]
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'companyName',
      status: 'status',
    },
    prepare({title, subtitle, status}) {
      return {
        title: title,
        subtitle: `${subtitle || 'Empresa não informada'} - Status: ${status}`
      }
    }
  }
})