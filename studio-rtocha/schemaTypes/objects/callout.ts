// callout.ts
import {defineField, defineType} from 'sanity'

export const calloutType = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          {title: 'Informação', value: 'info'},
          {title: 'Aviso', value: 'warning'},
          {title: 'Dica', value: 'tip'},
          {title: 'Erro', value: 'error'}
        ]
      },
      initialValue: 'info'
    }),
    defineField({
      name: 'heading',
      title: 'Título',
      type: 'string'
    }),
    defineField({
      name: 'body',
      title: 'Conteúdo',
      type: 'array',
      of: [{type: 'block'}]
    })
  ],
  preview: {
    select: {
      title: 'heading',
      type: 'type'
    },
    prepare({title, type}) {
      return {
        title: title || 'Callout sem título',
        subtitle: `Callout (${type || 'info'})`
      }
    }
  }
})