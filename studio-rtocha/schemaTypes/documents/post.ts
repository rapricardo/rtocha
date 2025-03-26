import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Conteúdo',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'settings',
      title: 'Configurações',
    },
  ],
  fields: [
    // Campos principais de conteúdo
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'content'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (rule) => rule.required(),
      group: 'settings'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
      group: 'settings'
    }),
    defineField({
      name: 'updatedAt',
      title: 'Última atualização',
      type: 'datetime',
      group: 'settings'
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: [{type: 'author'}],
      group: 'content'
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo',
      description: 'Breve resumo do post que aparecerá na listagem',
      type: 'text',
      rows: 3,
      group: 'content'
    }),
    defineField({
      name: 'image',
      title: 'Imagem principal',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Importante para SEO e acessibilidade',
        }),
        defineField({
          name: 'caption',
          title: 'Legenda',
          type: 'string',
        }),
      ],
      group: 'content'
    }),
    defineField({
      name: 'body',
      title: 'Conteúdo',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Heading 4', value: 'h4'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL'
                  },
                  {
                    name: 'isAnchor',
                    type: 'boolean',
                    title: 'É uma âncora?'
                  },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Abrir em nova aba'
                  }
                ]
              },
              {
                name: 'internalLink',
                type: 'object',
                title: 'Link Interno',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Referência',
                    to: [
                      {type: 'post'}
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo',
              description: 'Importante para SEO e acessibilidade',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Legenda',
            })
          ]
        },
        {
          type: 'code',
          options: {
            withFilename: true,
            languageAlternatives: [
              {title: 'JavaScript', value: 'javascript'},
              {title: 'HTML', value: 'html'},
              {title: 'CSS', value: 'css'},
              {title: 'TypeScript', value: 'typescript'},
              {title: 'Python', value: 'python'},
              {title: 'PHP', value: 'php'},
              {title: 'Java', value: 'java'},
            ]
          }
        },
        {
          type: 'callout',
          title: 'Callout',
        }
      ],
      group: 'content'
    }),
    // Tabela de conteúdo
    defineField({
      name: 'tableOfContents',
      title: 'Tabela de Conteúdo',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tocItem',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Título'
            }),
            defineField({
              name: 'anchor',
              type: 'string',
              title: 'ID da âncora'
            }),
            defineField({
              name: 'level',
              type: 'number',
              title: 'Nível (1-3)',
              validation: (rule) => rule.min(1).max(3)
            })
          ],
          preview: {
            select: {
              title: 'title',
              level: 'level'
            },
            prepare({title, level}) {
              return {
                title: `${Array(level).fill('-').join('')} ${title}`
              }
            }
          }
        }
      ],
      group: 'content'
    }),
    // Campos de categorização
    defineField({
      name: 'categories',
      title: 'Categorias',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
      group: 'settings'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      group: 'settings'
    }),
    // Campos de SEO
    defineField({
      name: 'metaTitle',
      title: 'Meta Título (SEO)',
      type: 'string',
      description: 'Título otimizado para SEO (55-60 caracteres)',
      validation: rule => rule.max(60),
      group: 'seo'
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Descrição',
      type: 'text',
      rows: 3,
      description: 'Descrição para resultados de busca (150-160 caracteres)',
      validation: rule => rule.max(160),
      group: 'seo'
    }),
    defineField({
      name: 'keywords',
      title: 'Palavras-chave',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      group: 'seo'
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'URL Canônica',
      type: 'url',
      description: 'Use apenas se este conteúdo existir em outro lugar',
      group: 'seo'
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagem para redes sociais',
      type: 'image',
      description: 'Imagem que aparecerá quando o link for compartilhado (1200x630px recomendado)',
      group: 'seo'
    }),
    // Adicione este campo ao postType
defineField({
  name: 'socialPosts',
  title: 'Posts para Redes Sociais',
  description: 'Selecione em quais formatos de redes sociais este conteúdo será compartilhado',
  type: 'object',
  group: 'settings',
  fields: [
    defineField({
      name: 'channels',
      title: 'Canais',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'channel',
          fields: [
            defineField({
              name: 'type',
              title: 'Tipo',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram Carrossel', value: 'instagram_carousel'},
                  {title: 'Instagram Feed', value: 'instagram_feed'},
                  {title: 'Instagram Reels', value: 'instagram_reels'},
                  {title: 'LinkedIn Carrossel', value: 'linkedin_carousel'},
                  {title: 'LinkedIn Feed', value: 'linkedin_feed'},
                ],
                layout: 'checkbox'
              }
            }),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              initialValue: 'pending',
              options: {
                list: [
                  {title: 'Pendente', value: 'pending'},
                  {title: 'Programado', value: 'scheduled'},
                  {title: 'Publicado', value: 'published'},
                  {title: 'Falhou', value: 'failed'}
                ]
              }
            }),
            defineField({
              name: 'scheduledAt',
              title: 'Data/Hora programada',
              type: 'datetime'
            }),
            defineField({
              name: 'publishedAt',
              title: 'Data/Hora publicada',
              type: 'datetime'
            }),
            defineField({
              name: 'customText',
              title: 'Texto personalizado',
              description: 'Texto específico para esta rede social (opcional)',
              type: 'text'
            })
          ],
          preview: {
            select: {
              title: 'type',
              status: 'status'
            },
            prepare({title, status}) {
              return {
                title: title.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                subtitle: `Status: ${status}`
              }
            }
          }
        }
      ]
    })
  ]
}),
    defineField({
      name: 'structuredData',
      title: 'Dados estruturados',
      type: 'object',
      fields: [
        defineField({
          name: 'articleType',
          title: 'Tipo de artigo',
          type: 'string',
          options: {
            list: [
              {title: 'Artigo', value: 'Article'},
              {title: 'Blog Post', value: 'BlogPosting'},
              {title: 'News Article', value: 'NewsArticle'}
            ]
          }
        }),
        defineField({
          name: 'publisherName',
          title: 'Nome do publisher',
          type: 'string'
        }),
        defineField({
          name: 'publisherLogo',
          title: 'Logo do publisher',
          type: 'image'
        })
      ],
      group: 'seo'
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'image'
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author ? `por ${author}` : ''}
    }
  }
})