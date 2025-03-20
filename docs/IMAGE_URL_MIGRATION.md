# Migração do Schema de Imagens Personalizadas

Este documento descreve a migração do schema de imagens personalizadas do Sanity, passando de referências de imagem diretamente no CMS para URLs armazenadas externamente.

## Contexto

Anteriormente, as imagens personalizadas eram armazenadas como referências a ativos do Sanity no campo `customImages`. Isso exigia o uso de funcionalidades do Sanity para upload de imagens, o que era difícil de automatizar.

A nova abordagem armazena apenas as URLs das imagens em um novo campo `customImagesUrls`, permitindo que imagens sejam geradas e armazenadas externamente (por exemplo, via Replicate) e apenas as URLs sejam enviadas para o Sanity.

## Alterações Realizadas

### 1. Atualização do Schema do Sanity

O schema `lead.ts` foi modificado para incluir o novo campo `customImagesUrls`:

```typescript
// Campo legado (mantido para compatibilidade)
defineField({
  name: 'customImages',
  title: 'Imagens Personalizadas (Formato Antigo)',
  description: 'DEPRECATED - Use o campo "Imagens Personalizadas (URLs)" para novas imagens',
  type: 'object',
  fields: [
    // ...campos existentes
  ]
}),

// Novo campo para URLs de imagens
defineField({
  name: 'customImagesUrls',
  title: 'Imagens Personalizadas (URLs)',
  description: 'URLs para imagens geradas e armazenadas externamente',
  type: 'object',
  fields: [
    defineField({
      name: 'welcomeImageUrl',
      title: 'URL da Imagem de Boas-vindas',
      type: 'url',
    }),
    defineField({
      name: 'ctaServiceImageUrl',
      title: 'URL da Imagem CTA Serviço',
      type: 'url',
    }),
    defineField({
      name: 'ctaWhatsappImageUrl',
      title: 'URL da Imagem CTA WhatsApp',
      type: 'url',
    }),
    defineField({
      name: 'resultsImageUrl',
      title: 'URL da Imagem de Resultados',
      type: 'url',
    }),
  ]
})
```

### 2. Atualização dos Tipos TypeScript

Os tipos `LeadInfo` tanto em `/lib/hooks/useReturningLead.ts` quanto em `/types/service.ts` foram atualizados para incluir o novo campo:

```typescript
interface LeadInfo {
  // ...campos existentes
  
  // Campo legado para compatibilidade
  customImages?: {
    welcomeImage?: any;
    ctaServiceImage?: any;
    ctaWhatsappImage?: any;
    resultsImage?: any;
  };
  
  // Novo campo de URLs para imagens personalizadas
  customImagesUrls?: {
    welcomeImageUrl?: string;
    ctaServiceImageUrl?: string;
    ctaWhatsappImageUrl?: string;
    resultsImageUrl?: string;
  };
}
```

### 3. Utilitário para Obtenção de URLs de Imagem

Foi criado um novo utilitário em `/lib/services/imageUtils.ts` que verifica tanto o formato novo quanto o legado:

```typescript
export function getPersonalizedImageUrl(
  leadInfo: LeadInfo | null | undefined, 
  imageType: 'welcome' | 'ctaService' | 'ctaWhatsapp' | 'results', 
  fallbackUrl: string = ''
): string {
  // Primeiro verifica o novo formato
  if (leadInfo?.customImagesUrls?.[`${imageType}ImageUrl`]) {
    return leadInfo.customImagesUrls[`${imageType}ImageUrl`] as string;
  }
  
  // Fallback para o formato legado
  // ... lógica para extrair URL do formato legado
  
  // Se nada for encontrado, retorna URL de fallback
  return fallbackUrl;
}
```

### 4. Novo Componente PersonalizedImage

Foi criado um novo componente em `/components/personalization/PersonalizedImage.tsx` que utiliza o utilitário acima:

```typescript
export default function PersonalizedImage({
  imageType,
  fallbackImageUrl,
  width = 600,
  height = 400,
  priority = false,
  alt = 'Imagem personalizada',
  className = '',
  showBadge = true
}: PersonalizedImageProps) {
  // Utiliza o hook useReturningLead para obter dados do lead
  // e o utilitário getPersonalizedImageUrl para obter a URL da imagem
}
```

### 5. Atualização dos Componentes Existentes

Os seguintes componentes foram atualizados para utilizar o novo sistema:

- `/components/personalization/WelcomeBackWrapper.tsx`
- `/components/personalization/PersonalizedWelcomeBlock.tsx`

## Como Usar

### Para Exibir Imagens Personalizadas

Use o novo componente `PersonalizedImage`:

```tsx
<PersonalizedImage 
  imageType="welcome" // Tipos disponíveis: welcome | ctaService | ctaWhatsapp | results
  fallbackImageUrl="/images/default.jpg"
  width={500}
  height={350}
  alt="Descrição da imagem"
  priority={true} // Para carregamento prioritário
  showBadge={true} // Mostrar ou não uma badge "Personalizado para você"
/>
```

### Para Obter URL da Imagem Diretamente

Use o utilitário `getPersonalizedImageUrl`:

```tsx
import { getPersonalizedImageUrl } from '@/lib/services/imageUtils';

// Em algum componente...
const imageUrl = getPersonalizedImageUrl(
  leadInfo, 
  'welcome',
  '/images/default.jpg'
);
```

## APIs e Webhooks

Para APIs que precisam criar ou atualizar imagens personalizadas, use o novo formato:

```typescript
await client.patch(leadId)
  .setIfMissing({ customImagesUrls: {} })
  .set({
    [`customImagesUrls.${imageType}ImageUrl`]: imageUrl
  })
  .commit();
```

## Compatibilidade com Dados Existentes

Esta implementação é totalmente compatível com dados existentes. O sistema verificará primeiro o novo formato (`customImagesUrls`) e, se não encontrar, buscará no formato legado (`customImages`).
