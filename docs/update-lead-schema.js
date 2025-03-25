// Este é um exemplo de como você pode atualizar o schema do lead no Sanity Studio
// Salve este arquivo como schema/lead.js ou modifique seu arquivo existente

export default {
  name: 'lead',
  title: 'Leads',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'companyName',
      title: 'Nome da Empresa',
      type: 'string'
    },
    {
      name: 'jobTitle',
      title: 'Cargo',
      type: 'string'
    },
    {
      name: 'companySite',
      title: 'Website da Empresa',
      type: 'url'
    },
    {
      name: 'companySize',
      title: 'Tamanho da Empresa',
      type: 'string',
      options: {
        list: [
          { title: 'Solopreneur', value: 'solopreneur' },
          { title: 'Pequena (2-10)', value: 'pequena' },
          { title: 'Média (11-50)', value: 'media' },
          { title: 'Grande (51+)', value: 'grande' }
        ]
      }
    },
    {
      name: 'marketingStructure',
      title: 'Estrutura de Marketing',
      type: 'string',
      options: {
        list: [
          { title: 'Sem equipe dedicada', value: 'sem_equipe' },
          { title: '1 pessoa', value: 'uma_pessoa' },
          { title: 'Pequena equipe (2-5)', value: 'pequena_equipe' },
          { title: 'Equipe robusta (6+)', value: 'equipe_robusta' }
        ]
      }
    },
    {
      name: 'salesTeamSize',
      title: 'Tamanho da Equipe de Vendas',
      type: 'string',
      options: {
        list: [
          { title: 'Sem equipe dedicada', value: 'sem_equipe' },
          { title: '1 pessoa', value: 'uma_pessoa' },
          { title: 'Pequena equipe (2-5)', value: 'pequena_equipe' },
          { title: 'Equipe robusta (6+)', value: 'equipe_robusta' }
        ]
      }
    },
    {
      name: 'clientAcquisitionStrategy',
      title: 'Estratégia de Aquisição de Clientes',
      type: 'string',
      options: {
        list: [
          { title: 'Principalmente outbound', value: 'outbound' },
          { title: 'Principalmente inbound', value: 'inbound' },
          { title: 'Mix de estratégias', value: 'mix' },
          { title: 'Indicações', value: 'indicacoes' }
        ]
      }
    },
    {
      name: 'usesCRM',
      title: 'Utiliza CRM',
      type: 'string',
      options: {
        list: [
          { title: 'Sim', value: 'sim' },
          { title: 'Não', value: 'nao' },
          { title: 'Planeja implementar', value: 'planeja' }
        ]
      }
    },
    {
      name: 'usesAutomation',
      title: 'Utiliza Automação',
      type: 'string',
      options: {
        list: [
          { title: 'Sim, extensivamente', value: 'sim_extensivamente' },
          { title: 'Sim, parcialmente', value: 'sim_parcialmente' },
          { title: 'Não, mas interessado', value: 'nao_interessado' },
          { title: 'Não', value: 'nao' }
        ]
      }
    },
    {
      name: 'mainChallenge',
      title: 'Principal Desafio',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'improvementGoal',
      title: 'Objetivo de Melhoria',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Novo', value: 'novo' },
          { title: 'Qualificado', value: 'qualificado' },
          { title: 'Em contato', value: 'em_contato' },
          { title: 'Cliente', value: 'cliente' },
          { title: 'Perdido', value: 'perdido' }
        ]
      },
      initialValue: 'novo'
    },
    {
      name: 'reportGenerated',
      title: 'Relatório Gerado',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'reportRequested',
      title: 'Relatório Solicitado',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'reportRequestedAt',
      title: 'Data de Solicitação do Relatório',
      type: 'datetime'
    },
    {
      name: 'report',
      title: 'Relatório',
      type: 'reference',
      to: [{ type: 'report' }]
    },
    {
      name: 'createdAt',
      title: 'Criado em',
      type: 'datetime',
      readOnly: true
    },
    {
      name: 'updatedAt',
      title: 'Atualizado em',
      type: 'datetime',
      readOnly: true
    },
    {
      name: 'recommendedServices',
      title: 'Serviços Recomendados',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'service' }]
        }
      ]
    },
    // CAMPO ANTIGO - Mantido temporariamente para compatibilidade
    {
      name: 'customImages',
      title: 'Imagens Personalizadas (Formato Antigo)',
      description: 'DEPRECATED - Use customImagesUrls em novas implementações',
      type: 'object',
      fields: [
        {
          name: 'welcomeImage',
          title: 'Imagem de Boas-Vindas',
          type: 'image',
          options: {
            hotspot: true,
          }
        },
        {
          name: 'ctaServiceImage',
          title: 'Imagem do CTA de Serviço',
          type: 'image',
          options: {
            hotspot: true,
          }
        },
        {
          name: 'ctaWhatsappImage',
          title: 'Imagem do CTA de WhatsApp',
          type: 'image',
          options: {
            hotspot: true,
          }
        },
        {
          name: 'resultsImage',
          title: 'Imagem de Resultados',
          type: 'image',
          options: {
            hotspot: true,
          }
        }
      ]
    },
    // NOVO CAMPO - Formato com URLs
    {
      name: 'customImagesUrls',
      title: 'Imagens Personalizadas (URLs)',
      type: 'object',
      fields: [
        {
          name: 'welcomeImageUrl',
          title: 'URL da Imagem de Boas-Vindas',
          type: 'url',
          description: 'URL da imagem armazenada externamente'
        },
        {
          name: 'ctaServiceImageUrl',
          title: 'URL da Imagem do CTA de Serviço',
          type: 'url',
          description: 'URL da imagem armazenada externamente'
        },
        {
          name: 'ctaWhatsappImageUrl',
          title: 'URL da Imagem do CTA de WhatsApp',
          type: 'url',
          description: 'URL da imagem armazenada externamente'
        },
        {
          name: 'resultsImageUrl',
          title: 'URL da Imagem de Resultados',
          type: 'url',
          description: 'URL da imagem armazenada externamente'
        }
      ]
    },
    {
      name: 'companyAnalysis',
      title: 'Análise da Empresa',
      type: 'object',
      fields: [
        {
          name: 'perplexitySummary',
          title: 'Resumo (Perplexity)',
          type: 'text'
        },
        {
          name: 'linkedinAnalysis',
          title: 'Análise LinkedIn da Empresa',
          type: 'text'
        },
        {
          name: 'leadLinkedinAnalysis',
          title: 'Análise LinkedIn do Lead',
          type: 'text'
        },
        {
          name: 'emotionalPitch',
          title: 'Pitch Emocional',
          type: 'text'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      company: 'companyName'
    },
    prepare({ title, subtitle, company }) {
      return {
        title: title || 'Lead sem nome',
        subtitle: company ? `${company} | ${subtitle}` : subtitle
      };
    }
  }
};
