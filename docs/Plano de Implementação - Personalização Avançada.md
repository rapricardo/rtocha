# Plano de Implementação - Personalização Avançada

Este documento estabelece o plano de implementação para o próximo nível de personalização no projeto de Automação Inteligente de Ricardo Tocha, baseado nas recentes atualizações nos schemas do Sanity.

## 1. Contexto e Objetivos

Com base na implementação bem-sucedida da personalização para leads retornantes e das páginas de serviço, estamos agora expandindo a estratégia para incluir personalização baseada em IA com geração de imagens e análises automatizadas. Este documento descreve o plano de implementação técnica, etapas e prioridades.

### 1.1 Objetivos Principais

- Impressionar leads retornantes com conteúdo altamente personalizado
- Demonstrar capacidades técnicas de automação com IA
- Aumentar taxas de conversão através de experiências emocionalmente impactantes
- Coletar dados de interação para otimização contínua

## 2. Alterações de Schema Implementadas

As seguintes alterações foram implementadas nos schemas do Sanity para suportar a nova estratégia:

### 2.1 Lead Schema
- Adicionado grupo `personalization`
- Adicionado campos faltantes: `reportRequested`, `reportRequestedAt`, `usesAutomation`
- Adicionado campo `customImages` para armazenar imagens personalizadas geradas via Replicate
- Adicionado campo `companyAnalysis` para armazenar análises geradas via Perplexity e LinkedIn

### 2.2 Service Schema
- Adicionado campo `personalization` com subcampos:
  - `howItWorksSteps`: Para visualizar cada passo com imagens
  - `ctaOptions`: Para diferentes tipos de chamadas à ação personalizadas

### 2.3 Novo Schema: Personalization
- Criado novo schema para gerenciar elementos de personalização específicos
- Estrutura para rastreamento de visualizações, cliques e análise de eficácia

## 3. Plano de Implementação Técnica

### 3.1 Fase 1: Integrações com APIs Externas (Semanas 1-2)

#### 3.1.1 Integração com Replicate
- Implementar função serverless para gerar imagens personalizadas
- Configurar armazenamento de imagens no Sanity
- Desenvolver templates de prompts para cada tipo de imagem
- Implementar sistema de cache para evitar regeneração desnecessária

```typescript
// Exemplo de implementação da API Replicate
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { generatePersonalizedImage } from '@/lib/ai/replicate';

export async function POST(req: NextRequest) {
  const { leadId, imageType, customData } = await req.json();
  
  try {
    // Gerar imagem personalizada via Replicate
    const imageUrl = await generatePersonalizedImage(imageType, customData);
    
    // Armazenar no Sanity
    await client.patch(leadId)
      .setIfMissing({ customImages: {} })
      .set({
        [`customImages.${imageType}Image`]: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageUrl
          }
        }
      })
      .commit();
    
    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

#### 3.1.2 Integração com Perplexity
- Implementar função serverless para analisar sites de empresas
- Estruturar processamento de texto para extrair insights relevantes
- Desenvolver sistema de prompts para obter informações de valor comercial

#### 3.1.3 Integração com LinkedIn
- Implementar sistema para análise de perfis de empresas e leads
- Desenvolver templates para diferentes tipos de análise
- Configurar armazenamento estruturado dos resultados

### 3.2 Fase 2: Componentes de UI (Semanas 2-3)

#### 3.2.1 Componentes de Imagem Personalizada
- Desenvolver componente `PersonalizedImage` para exibir imagens específicas
- Implementar fallbacks para quando imagens não estão disponíveis
- Adicionar efeitos visuais para destacar o aspecto personalizado

```tsx
// Exemplo de componente PersonalizedImage
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useReturningLead } from '@/lib/hooks/useReturningLead';

export default function PersonalizedImage({ 
  imageType, 
  fallbackImage,
  width = 600,
  height = 400,
  priority = false
}) {
  const { leadInfo, isLoading } = useReturningLead();
  const [imageSrc, setImageSrc] = useState(fallbackImage);
  
  useEffect(() => {
    if (!isLoading && leadInfo?.customImages?.[`${imageType}Image`]) {
      // Obter URL da imagem do Sanity
      setImageSrc(leadInfo.customImages[`${imageType}Image`]);
    }
  }, [leadInfo, isLoading, imageType]);
  
  return (
    <div className="relative overflow-hidden rounded-lg">
      <Image 
        src={imageSrc}
        width={width}
        height={height}
        alt="Imagem personalizada"
        className="transition-all duration-500"
        priority={priority}
      />
      {leadInfo && !isLoading && (
        <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-tl-md">
          Personalizado para você
        </div>
      )}
    </div>
  );
}
```

#### 3.2.2 Componentes de Insight
- Desenvolver componente para exibir insights personalizados
- Implementar diferentes visualizações baseadas no tipo de insight
- Adicionar interatividade para expandir/colapsar informações detalhadas

#### 3.2.3 Atualização de Páginas Existentes
- Integrar novos componentes na página inicial
- Atualizar páginas de serviço para incluir elementos personalizados
- ✅ Implementada seção "Como Funciona" com visualização de fluxo alternado e conectores visuais
- Adicionar dados estruturados no campo `howItWorksSteps` para todos os serviços no Sanity

### 3.3 Fase 3: Fluxos de Geração de Conteúdo (Semanas 3-4)

#### 3.3.1 Fluxo de Geração de Imagens
- Implementar triggers para geração de imagens quando lead é criado
- Configurar sistema de fila para processamento assíncrono
- Adicionar notificações quando novas imagens estão disponíveis

#### 3.3.2 Fluxo de Análise de Empresa
- Implementar sistema para verificar disponibilidade de domínio de empresa
- Configurar processos de fallback quando dados estão indisponíveis
- Desenvolver mecanismo de atualização periódica das análises

#### 3.3.3 Mecanismo de Pitch Emocional
- Criar sistema para gerar resumos vendedores com foco emocional
- Implementar segmentação por indústria e desafios
- Desenvolver múltiplas variações para testes A/B

### 3.4 Fase 4: Analytics e Otimização (Semanas 4-6)

#### 3.4.1 Sistema de Rastreamento
- Implementar rastreamento de visualizações por tipo de conteúdo personalizado
- Configurar medição de cliques e conversões
- Desenvolver dashboard para análise de eficácia

#### 3.4.2 Testes A/B
- Configurar sistema para testar diferentes versões de conteúdo personalizado
- Implementar rotação de variações para otimização contínua
- Desenvolver mecanismo para determinar vencedores automaticamente

#### 3.4.3 Otimização Contínua
- Implementar sistema de feedback do usuário
- Configurar atualização automática com base em dados de interação
- Desenvolver relatórios para análise periódica de eficácia

## 4. Requisitos Técnicos

### 4.1 APIs Externas
- **Replicate**: Para geração de imagens personalizadas
- **Perplexity**: Para análise de websites e conteúdo público
- **LinkedIn API**: Para obtenção de dados de perfis de empresas

### 4.2 Sanity Studio
- Campos personalizados para visualização de imagens geradas
- Utilitários para regenerar conteúdo personalizado
- Painéis para monitoramento de uso e eficácia

### 4.3 Infraestrutura
- Funções serverless para processamento pesado
- Sistema de filas para operações assíncronas
- Armazenamento para conteúdo gerado

## 5. Prioridades e Cronograma

### 5.1 Semana 1
- ✅ Implementar visualização de fluxos de automação no `ServiceHowItWorks`
- Configurar integração com Replicate
- Implementar prompts iniciais para geração de imagens
- Desenvolver componente PersonalizedImage

### 5.2 Semana 2
- Configurar integração com Perplexity
- Implementar componentes de insight
- Atualizar página inicial com novos componentes

### 5.3 Semana 3
- Configurar integração com LinkedIn
- Desenvolver sistema de pitch emocional
- Implementar fluxo completo de geração de conteúdo

### 5.4 Semana 4
- Implementar sistema de rastreamento
- Configurar dashboard de analytics
- Iniciar testes A/B

### 5.5 Semanas 5-6
- Otimizar baseado em dados iniciais
- Expandir personalização para mais seções do site
- Implementar aprimoramentos baseados em feedback

## 6. Métricas de Sucesso

- **Engagement**: Aumento no tempo médio de permanência na página
- **Conversão**: Aumento na taxa de cliques em CTAs personalizados
- **Satisfação**: Feedback positivo sobre a experiência personalizada
- **ROI**: Redução no custo de aquisição de leads qualificados

## 7. Limitações e Mitigações

### 7.1 Limitações Conhecidas
- **Tempo de Geração**: Imagens podem levar tempo para serem geradas
- **Precisão das Análises**: Dados de empresas podem estar incompletos
- **Uso de API**: Custos associados podem escalar com o volume
- **Dados Estruturados**: A implementação da visualização depende da adição de dados no campo `howItWorksSteps`

### 7.2 Estratégias de Mitigação
- Implementar sistema de cache para reutilização de conteúdo
- Desenvolver fallbacks elegantes quando dados estão indisponíveis
- Configurar quotas e alertas para controle de custos
- ✅ Implementado fallback para usar PortableText quando não há dados estruturados de passos
- Criar script de conversão para acelerar a adição de dados estruturados no Sanity

## 8. Considerações para o Futuro

- Expansão para personalização baseada em comportamento de navegação
- Implementação de recomendações dinâmicas usando ML
- Integração com mais fontes de dados para enriquecimento
- Sistema de personalização para retargeting em outros canais

Este plano será revisado e ajustado conforme a implementação progride, com atualizações regulares sobre métricas de desempenho e aprendizados.
