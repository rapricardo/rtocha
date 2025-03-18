# Estratégia de Personalização para Leads Retornantes

## 1. Visão Geral

A personalização para leads retornantes visa criar uma experiência diferenciada que demonstre valor contínuo e aumenta significativamente as chances de conversão. Esta estratégia utiliza dados previamente coletados durante interações anteriores para apresentar conteúdo contextual relevante.

## 2. Objetivos

- Aumentar a taxa de conversão de leads retornantes
- Reduzir o ciclo de vendas para leads pré-qualificados
- Demonstrar compreensão profunda dos desafios específicos do lead
- Estabelecer autoridade e confiança através da personalização contextual
- Diferenciar a experiência de usuários novos vs. retornantes

## 3. Identificação de Leads Retornantes

### 3.1 Métodos de Identificação
- Armazenamento em localStorage
- Cookies persistentes
- Identificação por email/token em URLs
- Reconhecimento por IP + fingerprinting (abordagem auxiliar)

### 3.2 Dados a Serem Armazenados
- ID do lead no Sanity
- Data do último relatório gerado
- Principais desafios identificados
- Serviços recomendados
- Nível de engajamento anterior
- Segmento/indústria (para personalização específica do setor)

## 4. Elementos de Personalização

### 4.1 Componentes Visuais
- Banner de boas-vindas personalizado
- Seção "Continuando de onde parou"
- Cards de serviços recomendados prioritários
- Timeline de interação
- Visualização interativa de fluxos de automação
- Imagens personalizadas geradas por IA

### 4.2 Conteúdo Adaptativo
- Artigos filtrados por interesses/desafios
- Casos de sucesso segmentados por similaridade
- Ofertas específicas baseadas no perfil
- Conteúdo adaptado ao segmento/indústria
- Análises personalizadas da empresa

### 4.3 Interações Contextuais
- Diagnósticos complementares focados
- Calculadoras de ROI pré-preenchidas
- Agendamento prioritário
- Fluxos de demonstração adaptados ao setor

## 5. Implementação Técnica

### 5.1 Hook de Detecção
```typescript
// Implementado em /src/lib/hooks/useReturningLead.ts
'use client';
import { useState, useEffect } from 'react';
import { groq } from 'next-sanity';
import { client } from '@/lib/sanity/client';

export function useReturningLead(): ReturningLeadState {
  // Lógica para detectar leads retornantes via localStorage
  // e buscar seus dados no Sanity
}

export function storeLeadId(leadId: string): void {
  // Armazena o ID do lead com prazo de validade
}
```

### 5.2 Componente de Boas-Vindas
```typescript
// Implementado em /src/components/personalization/WelcomeBackBanner.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useReturningLead } from '@/lib/hooks/useReturningLead';

export default function WelcomeBackBanner({ className = '' }: WelcomeBackBannerProps) {
  // Lógica para exibir banner personalizado na página inicial
}
```

### 5.3 Componente de Visualização de Fluxos
```typescript
// Implementado em /src/components/services/ServiceHowItWorks.tsx
'use client';
import React from 'react';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import { portableTextComponents } from '@/lib/portable-text/components.tsx';

interface Step {
  _key?: string;
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  stepNumber?: number;
}

interface ServiceHowItWorksProps {
  howItWorks?: PortableTextBlock[];
  howItWorksSteps?: Step[];
  slug?: string;
}

export default function ServiceHowItWorks({ howItWorks, howItWorksSteps, slug }: ServiceHowItWorksProps) {
  // Verifica se temos howItWorks mas não temos howItWorksSteps
  const usePortableTextInsteadOfSteps = !!howItWorks && (!howItWorksSteps || howItWorksSteps.length === 0);
  
  // Ordena os passos pelo número do passo ou usa a ordem original
  const orderedSteps = howItWorksSteps ? [...howItWorksSteps].sort((a, b) => {
    if (a.stepNumber !== undefined && b.stepNumber !== undefined) {
      return a.stepNumber - b.stepNumber;
    }
    return 0;
  }) : [];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Como Funciona</h2>
          
          {/* Visualização de fluxo com passos alternados esquerda/direita */}
          {!usePortableTextInsteadOfSteps && orderedSteps && orderedSteps.length > 0 && (
            <div className="relative">
              {/* Linha central de fluxo - visível apenas em desktop */}
              <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-1 bg-gradient-to-b from-[#d32b36] to-[#e67a48] transform -translate-x-1/2 rounded-full"></div>
              
              {orderedSteps.map((step, index) => (
                /* Implementação do fluxo visual alternado */
              ))}
            </div>
          )}
          
          {/* Exibe conteúdo HTML rico quando não há passos estruturados */}
          {usePortableTextInsteadOfSteps && howItWorks && (
            <div className="bg-gray-50 rounded-xl p-8 shadow-md">
              <div className="prose prose-lg max-w-none">
                <PortableText value={howItWorks} components={portableTextComponents} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

### 5.4 Integração com APIs Externas
```typescript
// Webhook handler em n8n para processamento em background
// Ativado quando um novo lead é criado ou relatório gerado

1. Sanity --> Webhook --> n8n
2. n8n --> Replicate API (geração de imagens)
3. n8n --> Perplexity API (análise de empresa)
4. n8n --> LinkedIn API (dados de perfil)
5. n8n --> Atualização do lead no Sanity
```

## 6. Métricas e Analytics

### 6.1 KPIs Principais
- Taxa de conversão de leads retornantes vs. novos
- Tempo médio até conversão para leads retornantes
- Engajamento por tipo de conteúdo personalizado
- ROI dos elementos personalizados

### 6.2 Implementação de Rastreamento
- Eventos de visualização de conteúdo personalizado
- Rastreamento de cliques em elementos personalizados
- Funis específicos para leads retornantes

## 7. Testes e Otimização

### 7.1 Abordagens de Teste
- A/B testing de diferentes mensagens de boas-vindas
- Testes de diferentes níveis de personalização
- Análise de impacto por segmento de lead

### 7.2 Ciclo de Otimização
- Coleta inicial de dados (2 semanas)
- Análise e ajustes (semanal)
- Iterações maiores (mensal)

## 8. Próximos Passos

1. Implementar hook `useReturningLead`
2. Desenvolver componente de boas-vindas
3. Adaptar página inicial
4. Configurar sistema de follow-up
5. Implementar analytics específicos

# Estratégia de Personalização para Leads Retornantes - Status e Próximos Passos

## 1. Status de Implementação

A personalização para leads retornantes foi implementada com êxito, abrangendo os principais elementos definidos na estratégia original. Abaixo está o resumo do que foi concluído e o que ainda precisa ser implementado.

### ✅ Elementos Implementados

#### Identificação de Leads
- **Hook de detecção**: `useReturningLead` implementado no arquivo `/src/lib/hooks/useReturningLead.ts`
- **Armazenamento persistente**: Configurado com localStorage e período de expiração de 90 dias
- **Gestão de IDs**: Função `storeLeadId()` para armazenar o ID do lead quando um relatório é gerado

#### Personalização na Interface
- **Banner de boas-vindas**: Componente `WelcomeBackBanner` implementado na página inicial
- **Mensagens contextuais**: Personalização baseada no perfil do lead (nome, empresa, objetivos)
- **Banners em páginas de serviço**: Componente `PersonalizedServiceBanner` implementado

#### Componentes de Serviço
- **Personalização por serviço**: Sistema que detecta se um serviço é recomendado para o lead
- **Verificação de compatibilidade**: Algoritmo que avalia a compatibilidade entre perfil e serviço
- **Indicadores visuais**: Badges e formatação específica para serviços recomendados

#### Integração com o Ecossistema
- **Correção de links**: Atualização de links na página de relatórios para apontar para `/solucoes/[slug]`
- **Formatação de conteúdo**: Configuração do PortableText para renderizar corretamente o conteúdo

## 2. Progresso por Objetivo Original

| Objetivo | Status | Detalhes |
|---------|--------|----------|
| Aumentar conversão | ✅ Implementado | Banner personalizado + Recomendações contextualizadas |
| Reduzir ciclo de vendas | ✅ Implementado | Links diretos para relatórios e serviços recomendados |
| Demonstrar compreensão | ✅ Implementado | Mensagens específicas baseadas no perfil do lead |
| Estabelecer autoridade | ✅ Implementado | Design profissional com personalização relevante |
| Diferenciar experiência | ✅ Implementado | Fluxos distintos para leads novos e retornantes |

## 3. Componentes Técnicos Implementados

### 3.1 Hook de Detecção `useReturningLead`
```typescript
// Implementado em /src/lib/hooks/useReturningLead.ts
'use client';
import { useState, useEffect } from 'react';
import { groq } from 'next-sanity';
import { client } from '@/lib/sanity/client';

export function useReturningLead(): ReturningLeadState {
  // Lógica para detectar leads retornantes via localStorage
  // e buscar seus dados no Sanity
}

export function storeLeadId(leadId: string): void {
  // Armazena o ID do lead com prazo de validade
}
```

### 3.2 Componente de Boas-Vindas
```typescript
// Implementado em /src/components/personalization/WelcomeBackBanner.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useReturningLead } from '@/lib/hooks/useReturningLead';

export default function WelcomeBackBanner({ className = '' }: WelcomeBackBannerProps) {
  // Lógica para exibir banner personalizado na página inicial
}
```

### 3.3 Componente de Personalização para Serviços
```typescript
// Implementado em /src/components/services/PersonalizedServiceBanner.tsx
'use client';
import { useEffect, useState } from "react";
import { LeadInfo, Service } from "@/types/service";
import { checkServiceCompatibility, generatePersonalizedMessage } from "@/lib/services/serviceUtils";

export default function PersonalizedServiceBanner({ 
  leadInfo, 
  service, 
  isRecommended 
}: PersonalizedServiceBannerProps) {
  // Lógica para exibir banner personalizado nas páginas de serviço
}
```

## 4. Próximos Passos Recomendados

### 4.1 Curto Prazo (1-2 Semanas)

1. **✅ Implementação da visualização de fluxos**
   - ✅ Implementado no componente existente `ServiceHowItWorks`
   - ✅ Layout alternado esquerda/direita com conectores visuais
   - ✅ Design totalmente responsivo para mobile e desktop
   - Adicionar dados estruturados no campo `howItWorksSteps` para todos os serviços

2. **Configuração de webhook para processamento assíncrono**
   - Configurar webhook Sanity -> n8n
   - Estruturar fluxo para processamento em background
   - Testar integração

3. **Personalização por segmento**
   - Utilizar novo campo de industry para segmentação
   - Criar experiências específicas por segmento
   - Adaptar conteúdo para diferentes indústrias

### 4.2 Médio Prazo (1-2 Meses)

1. **Integração com APIs externas**
   - Implementar geração de imagens via Replicate
   - Desenvolver análise de empresas via Perplexity
   - Integrar com LinkedIn para dados adicionais

2. **Analytics Avançado**
   - Implementar sistema de eventos para rastreamento detalhado de interações
   - Configurar dashboard de conversão específico para leads retornantes

3. **Calculadoras de ROI Personalizadas**
   - Desenvolver calculadoras por serviço com valores pré-preenchidos baseados no perfil
   - Integrar estimativas de ganho com dados do setor do lead

### 4.3 Longo Prazo (3-6 Meses)

1. **Sistema de Follow-up Automatizado**
   - Implementar sequências de emails personalizados baseados nas interações
   - Integrar com WhatsApp para lembretes contextuais

2. **Recomendação com Machine Learning**
   - Evoluir o sistema de compatibilidade para usar modelos preditivos
   - Implementar personalização dinâmica baseada em comportamento e interações

3. **Testes A/B de Personalização**
   - Configurar sistema para testar diferentes abordagens de mensagens
   - Avaliar impacto de diferentes níveis de personalização na conversão

## 5. Métricas a Serem Monitoradas

1. **Engajamento**
   - Taxa de clique em banners personalizados
   - Tempo médio de sessão para leads retornantes vs. novos

2. **Conversão**
   - Taxa de agendamento de consultoria para leads retornantes
   - Número médio de páginas de serviço visitadas por sessão

3. **ROI**
   - Custo de aquisição para leads retornantes vs. novos
   - Valor médio de contratos para leads retornantes vs. novos

## 6. Conclusão

A implementação atual da estratégia para leads retornantes atende aos objetivos iniciais estabelecidos, com todos os componentes técnicos essenciais desenvolvidos e funcionando. O sistema está pronto para uso e deve começar a demonstrar resultados à medida que mais leads retornam ao site.

Os próximos passos focam na expansão da personalização, análise de desempenho e desenvolvimento de novas funcionalidades que aumentem ainda mais a eficácia da estratégia. O monitoramento contínuo e ajustes regulares serão essenciais para maximizar o valor da personalização para leads retornantes.