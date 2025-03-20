# Atualização do Schema - Conversão do campo customImages para URLs

Este documento descreve a atualização necessária no schema do Sanity para substituir o campo `customImages` atual (que armazena o arquivo da imagem) para um novo formato que armazena apenas URLs de imagens hospedadas externamente (no Supabase Storage ou outro serviço).

## Justificativa

Estamos enfrentando problemas de conectividade entre o n8n e o Supabase para fazer upload das imagens geradas pelo Replicate. Para resolver esse problema, manteremos as imagens no formato URL em vez de tentar fazer upload delas para o Sanity.

## Alterações no Schema

### 1. Alteração no Schema do Lead

Localize o schema do tipo `lead` em seu Sanity Studio (provavelmente em `schemas/lead.js` ou similar) e modifique o campo `customImages`:

```javascript
// De:
{
  name: 'customImages',
  title: 'Imagens Personalizadas',
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
}

// Para:
{
  name: 'customImages',
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
}
```

### 2. Adicionar campo adicional para suporte à migração

Para garantir compatibilidade com dados existentes durante a transição, podemos adicionar um campo separado:

```javascript
// Adicionar esse campo ao schema do lead:
{
  name: 'customImagesUrls',
  title: 'Imagens Personalizadas (URLs Externas)',
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
}
```

Esta abordagem permite:
1. Manter compatibilidade com dados existentes
2. Fazer uma migração gradual para o novo formato de URLs
3. Atualizar o código para verificar ambos os formatos antes de descontinuar o formato antigo

## Passos para Implementação

1. Fazer backup dos dados existentes no Sanity
2. Atualizar o schema conforme a segunda opção (adicionando novo campo)
3. Atualizar o código para verificar ambos os campos (ver arquivo de atualização do useReturningLead.ts)
4. Migrar dados existentes (se houver) para o novo formato
5. Após verificação, remover campo antigo e renomear novo campo

## Considerações de Migração

Se houver dados existentes no Sanity com o campo `customImages` no formato antigo, você precisará migrar esses dados. Você pode usar o GROQ para consultar esses registros e, para cada imagem existente:

1. Fazer download da imagem do Sanity
2. Fazer upload para o Supabase Storage
3. Atualizar o documento no Sanity com a nova URL

```javascript
// Exemplo de GROQ para encontrar leads com imagens personalizadas
*[_type == "lead" && defined(customImages.welcomeImage)]
```
