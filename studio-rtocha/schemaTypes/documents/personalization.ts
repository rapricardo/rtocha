// personalization.ts
import {defineField, defineType} from 'sanity'

export const personalizationType = defineType({
  name: 'personalization',
  title: 'Personalização',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Conteúdo Personalizado',
    },
    {
      name: 'targeting',
      title: 'Segmentação',
    },
    {
      name: 'analytics',
      title: 'Analytics',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'content'
    }),
    defineField({
      name: 'contentType',
      title: 'Tipo de Conteúdo',
      type: 'string',
      options: {
        list: [
          {title: 'Banner Homepage', value: 'homepage_banner'},
          {title: 'CTA Serviço', value: 'service_cta'},
          {title: 'CTA WhatsApp', value: 'whatsapp_cta'},
          {title: 'Seção Como Funciona', value: 'how_it_works'},
          {title: 'Página de Serviço', value: 'service_page'},
        ]
      },
      validation: (rule) => rule.required(),
      group: 'content'
    }),
    defineField({
      name: 'lead',
      title: 'Lead',
      type: 'reference',
      to: [{type: 'lead'}],
      group: 'targeting'
    }),
    defineField({
      name: 'service',
      title: 'Serviço (se aplicável)',
      type: 'reference',
      to: [{type: 'service'}],
      group: 'targeting'
    }),
    defineField({
      name: 'content',
      title: 'Conteúdo',
      type: 'array',
      of: [{type: 'block'}],
      group: 'content'
    }),
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      options: {
        hotspot: true
      },
      group: 'content'
    }),
    defineField({
      name: 'active',
      title: 'Ativo',
      type: 'boolean',
      initialValue: true,
      group: 'targeting'
    }),
    defineField({
      name: 'priority',
      title: 'Prioridade',
      type: 'number',
      initialValue: 5,
      validation: (rule) => rule.min(1).max(10),
      group: 'targeting'
    }),
    defineField({
      name: 'views',
      title: 'Visualizações',
      type: 'number',
      initialValue: 0,
      group: 'analytics'
    }),
    defineField({
      name: 'clicks',
      title: 'Cliques',
      type: 'number',
      initialValue: 0,
      group: 'analytics'
    }),
    defineField({
      name: 'lastDisplayed',
      title: 'Última Exibição',
      type: 'datetime',
      group: 'analytics'
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'contentType',
      leadName: 'lead.name',
      active: 'active'
    },
    prepare({title, subtitle, leadName, active}) {
      const status = active ? 'Ativo' : 'Inativo';
      const target = leadName ? `Lead: ${leadName}` : 'Geral';
      return {
        title: title,
        subtitle: `${subtitle} | ${target} | ${status}`
      }
    }
  }
});