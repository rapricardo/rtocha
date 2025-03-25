# Documento de Contexto do Projeto - Automação Inteligente Ricardo Tocha

## 1. Visão Geral do Projeto

O projeto "Automação Inteligente para Marketing e Vendas" de Ricardo Tocha é uma iniciativa que visa construir uma plataforma digital completa para demonstrar expertise, capturar leads qualificados e entregar valor através de automações personalizadas. O projeto tem como objetivo posicionar Ricardo Tocha como referência em automação inteligente para profissionais de marketing e vendas que buscam aumentar resultados com menos esforço.

### 1.1 Posicionamento

**Ricardo Tocha** ajuda profissionais de marketing e vendas a entregar mais resultados, com menos esforço, através da automação de tarefas repetitivas que consomem tempo e agregam pouco valor.

### 1.2 Objetivos de Negócio

- Demonstrar expertise técnica e posicionamento estratégico
- Gerar leads qualificados através de interações de valor
- Estabelecer casos de sucesso para referência
- Construir base de conhecimento e conteúdo relevante
- Criar ferramentas que se tornem ativos de crescimento sustentável

## 2. Arquitetura e Stack Tecnológico

### 2.1 Tecnologias Principais

- **Front-end**: Next.js (framework React)
- **CMS & Banco de Dados**: Sanity
- **Plataforma de Automação**: n8n
- **CRM**: HubSpot
- **Integração WhatsApp**: Evolution API
- **IA para Conteúdo**: Gemini (Google)
- **Agentes Inteligentes**: Relevance AI e Relay AI

### 2.2 Arquitetura do Sistema

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │◄───►│  Sanity CMS     │◄───►│    n8n          │
│    (Next.js)    │     │  (Dados)        │     │  (Automações)   │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         │                       │                       │
┌────────▼────────┐     ┌────────▼────────┐     ┌────────▼────────┐
│                 │     │                 │     │                 │
│  HubSpot CRM    │◄───►│ Evolution API   │◄───►│   IA Agents     │
│  (Leads/Vendas) │     │  (WhatsApp)     │     │  (Análise)      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.3 Estrutura de Dados (Sanity)

Principais schemas:
- **Post**: Conteúdo do blog
- **Author**: Autores de conteúdo
- **Category**: Categorização de conteúdo
- **Lead**: Informações de prospects, incluindo segmento/indústria e campos de personalização
- **Service**: Serviços oferecidos com campo `howItWorksSteps` estruturado para visualização de etapas do fluxo de automação
- **Report**: Relatórios de auditoria
- **Personalization**: Elementos personalizados para diferentes segmentos e contextos
- **Callout**: Componentes de destaque

## 3. Funcionalidades Implementadas

### 3.1 Quiz de Diagnóstico Automatizado
- Interface interativa para coleta de dados do lead
- Processamento de respostas e categorização
- Geração de insights preliminares

### 3.2 Sistema Assíncrono de Geração de Relatórios
- Solução para o problema de timeout no ambiente Vercel
- Verificação de relatórios existentes
- Sistema de polling para status
- Feedback visual durante processamento

### 3.3 Blog Estruturado
- Estrutura de dados para conteúdo rica e detalhada
- Suporte a categorização e tags
- Campos de SEO otimizados

### 3.4 Páginas Institucionais
- Home
- Sobre
- Contato

### 3.5 Personalização para Leads Retornantes
- Sistema de identificação e reconhecimento de leads retornantes implementado via hook `useReturningLead`
- Interface personalizada baseada em histórico de interações
- Banners personalizados com mensagens contextuais
- Integração com perfil do Sanity para dados persistentes

### 3.6 Páginas de Serviço/Produto
- Implementadas páginas dinâmicas em `/solucoes/[slug]` com estrutura modular
- Componentes especializados para diferentes seções (Cabeçalho, Benefícios, Como Funciona, etc.)
- Visualização avançada de fluxos de automação com layout alternado esquerda/direita
- Design responsivo com conectores visuais entre passos do fluxo
- Renderização condicional para seções com conteúdo
- Sistema de personalização que identifica serviços recomendados para leads retornantes
- Indicadores visuais para serviços recomendados na auditoria
- Navegação entre serviços relacionados

### 3.7 API de Leads
- Endpoints REST para acesso programático aos dados de leads armazenados no Sanity
- Autenticação Basic Auth para segurança dos dados sensíveis
- Suporte a filtragem por data de atualização e personalização dos dados retornados
- Integração com Redis para cache de leads, otimizando o uso em agentes de WhatsApp e outros serviços
- Dois endpoints principais implementados:
  - `/api/leads/export`: Consulta completa de leads com opções de filtragem
  - `/api/leads/get-by-id`: Consulta específica de um lead por ID

## 4. Funcionalidades em Desenvolvimento/Planejadas

### 4.1 Melhorias nas Páginas de Serviço
- ✅ Visualização de fluxos de automação com layout alternado e conectores visuais
- Animações e interatividade adicional para a visualização de fluxos (expansão de detalhes, etc.)
- Integração com imagens geradas por IA (via Replicate API)
- Personalização por segmento/indústria
- Calculadoras de ROI específicas por serviço
- Seção de testemunhos de clientes
- Demonstrações interativas das automações oferecidas
- Schema.org e metadados avançados para SEO

### 4.2 Integração com Redes Sociais
- Webhooks para publicação automática de conteúdo
- Geração de formatos adaptados para cada rede
- Agendamento e análise de performance

### 4.3 Sistema de Nutrição de Email
- Fluxos automatizados baseados em interesses
- Segmentação por engajamento e perfil
- Métricas de conversão e ajustes

### 4.4 Assistente via WhatsApp
- Chatbot conversacional para qualificação
- Entregáveis personalizados automatizados
- Agendamento de reuniões

## 5. Estado Atual por Módulo

| Módulo | Estado | Próximas Etapas |
|--------|--------|-----------------|
| **Quiz de Diagnóstico** | ✅ Implementado | Otimização de UX |
| **Geração de Relatórios** | ✅ Implementado | Melhorar persistência |
| **Blog** | 🟡 Parcial | Implementar webhooks |
| **Personalização** | ✅ Implementado | Expandir personalização |
| **Páginas de Serviço** | ✅ Implementado | Adicionar calculadoras de ROI e conteúdo completo |
| **WhatsApp** | ✅ Implementado | Configurar Evolution API |
| **Redes Sociais** | ✅ Implementado | Configurar webhooks n8n |
| **Email Marketing** | 🔴 Não iniciado | Definir fluxos e triggers |
| **API de Leads** | ✅ Implementado | Expandir endpoints e otimizar cache Redis |
| **Visualização de Fluxos** | ✅ Implementado | Adicionar dados estruturados a todos os serviços |

## 6. Estrutura de Arquivos do Projeto

### 6.1 Principais Componentes e Páginas

```
/app
  /api
    /audit-quiz
      /submit
      /request-report
      /report-status
      /generate-report
  /mini-auditoria
  /blog
  /solucoes
    /page.tsx
    /[slug]
      /page.tsx
  /relatorios

/components
  /audit-quiz
    AuditQuiz.tsx
    QuizComplete.tsx
  /layout
  /ui
  /blog
  /services
    ServiceHeader.tsx
    ServiceBenefits.tsx
    ServiceHowItWorks.tsx
    AutomationFlowSteps.tsx
    ServiceRequirements.tsx
    ServiceMetrics.tsx
    PersonalizedServiceBanner.tsx
    RelatedServices.tsx
  /personalization
    WelcomeBackBanner.tsx

/lib
  /services
    reportStatus.ts
    serviceQueries.ts
    serviceUtils.ts
  /hooks
    useReturningLead.ts
  /portable-text
    components.tsx
  /ai
    gemini.ts
  /sanity
  /types.ts
```

### 6.2 Fluxos de Dados Principais

1. **Fluxo de Diagnóstico e Relatório**:
   ```
   Quiz → API → Processamento → Relatório → Follow-up
   ```

2. **Fluxo de Blog e Redes Sociais**:
   ```
   Sanity → Webhook → n8n → Adaptação → Publicação
   ```

3. **Fluxo de Personalização**:
   ```
   Identificação → Recuperação de Dados → Renderização Personalizada
   ```

4. **Fluxo de Páginas de Serviço**:
   ```
   Requisição → Query Sanity → Verificação de Lead → Personalização → Renderização
   ```

## 7. Prioridades Atuais

### 7.1 Prioridade Alta
1. **Completar dados no Sanity para serviços**
   - Preencher completamente os campos de serviços no Sanity
   - Adicionar dados estruturados de passos para cada serviço utilizando o campo `howItWorksSteps`
   - Adicionar imagens de qualidade para cada serviço
   - Verificar todos os cenários de personalização

2. **Integração com APIs externas**
   - Desenvolver integração com Perplexity e LinkedIn
   - Expandir uso do webhook Sanity -> n8n já configurado
   - Otimizar fluxos de processamento assíncrono

3. **Rastreamento e métricas**
   - Implementar sistema de eventos para rastreamento detalhado de interações
   - Configurar dashboard de conversão específico para leads retornantes
   - Adicionar rastreamento de cliques e conversões para análise

4. **Verificar e corrigir campos do quiz de auditoria**
   - Auditar campos não salvos no Sanity
   - Garantir que todos os dados coletados estejam sendo persistidos
   - Otimizar estrutura de dados para melhor análise

### 7.2 Prioridade Média
1. **Calculadoras de ROI**
   - Desenvolver calculadoras por serviço com valores pré-preenchidos
   - Integrar estimativas de ganho com dados do setor do lead

2. **Webhooks para redes sociais**
   - Configuração do n8n
   - Templates por rede social
   - Sistema de programação

3. **Continuidade do blog**
   - Calendário editorial
   - Otimização de SEO
   - Métricas de performance

### 7.3 Prioridade Baixa
1. **Nutrição de email**
   - Configuração de sequências
   - Integração com HubSpot
   - Relatórios de desempenho

2. **Testemunhos e casos de sucesso**
   - Implementar seção de depoimentos de clientes por serviço
   - Criar estrutura para casos de uso segmentados

## 8. Aspectos Técnicos e Desafios

### 8.1 Desafios Atuais
- Persistência confiável dos estados no sistema assíncrono
- Manutenção de conteúdo estruturado no Sanity
- Consistência visual entre personalização e design base

### 8.2 Considerações de Escalabilidade
- Crescimento potencial da base de leads
- Aumento de demanda de processamento para relatórios
- Necessidade de cache estratégico

### 8.3 Segurança e Privacidade
- Conformidade com LGPD
- Proteção de dados de leads
- Acesso controlado a informações sensíveis

## 9. Plano de Implementação

### 9.1 Curto Prazo (Próximas 2 Semanas)
1. ✅ Implementar visualização de fluxos no componente `ServiceHowItWorks`
2. Completar dados no Sanity com conteúdo formatado
3. Adicionar dados estruturados para todos os serviços no campo `howItWorksSteps`
4. Implementar rastreamento básico de interações
5. Configurar webhook Sanity -> n8n para processamento assíncrono

### 9.2 Médio Prazo (1-2 Meses)
1. Integrar com Replicate para geração de imagens personalizadas
2. Desenvolver calculadoras de ROI específicas por serviço
3. Implementar seção de depoimentos de clientes
4. Configurar webhooks para redes sociais
5. Implementar schema.org e metadados avançados para SEO

### 9.3 Longo Prazo (3-6 Meses)
1. Implementar assistente de WhatsApp
2. Sistema completo de nutrição por email
3. Expansão para modelos preditivos de recomendação
4. Adicionar demonstrações interativas das automações oferecidas

## 10. Colaboração e Workflow

### 10.1 Metodologia de Desenvolvimento
- Desenvolvimento incremental baseado em prioridade
- Revisões periódicas de código e arquitetura
- Documentação contínua de decisões e aprendizados

### 10.2 Política de Versionamento
- Controle de versão via Git
- Ambientes de desenvolvimento, teste e produção
- Estratégia de releases progressivos

## 11. Conclusão e Próximos Passos Prioritários

O projeto encontra-se em fase avançada, com várias funcionalidades essenciais implementadas, incluindo as páginas de serviço, personalização para leads retornantes, API de leads e visualização de fluxos de automação. As prioridades imediatas são:

1. Adicionar dados estruturados no campo `howItWorksSteps` para todos os serviços no Sanity
2. Verificar e corrigir campos do quiz de auditoria que não estão sendo salvos
3. Expandir uso do webhook Sanity -> n8n já configurado para integrações adicionais
4. Implementar rastreamento e métricas de conversão

Este documento serve como referência central para o estado atual do projeto e diretrizes para o desenvolvimento contínuo, refletindo as implementações recentes e os próximos passos.