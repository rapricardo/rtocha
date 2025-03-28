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
- **Analytics**: Vercel Analytics

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
- **Lead**: Informações de prospects, incluindo `reportStatus` e campos de personalização
- **Service**: Serviços oferecidos com campo `howItWorksSteps` estruturado
- **Report**: Relatórios de auditoria com campos de analytics (`views`, `lastViewedAt`, `callToActionClicked`)
- **Personalization**: Elementos personalizados
- **Callout**: Componentes de destaque

## 3. Funcionalidades Implementadas

### 3.1 Quiz de Diagnóstico Automatizado
- Interface interativa para coleta de dados do lead
- Processamento de respostas e categorização
- Geração de insights preliminares
- Mapeamento de todos os campos para o Sanity verificado

### 3.2 Sistema Assíncrono de Geração de Relatórios
- Solução para o problema de timeout no ambiente Vercel
- Verificação de relatórios existentes
- Sistema de polling refatorado para usar Sanity como fonte da verdade (status persistente)
- Feedback visual durante processamento
- Otimização: Chamadas à IA paralelizadas (`Promise.all`)
- Segurança: API `/generate` protegida por secret token

### 3.3 Blog Estruturado
- Estrutura de dados para conteúdo rica e detalhada
- Suporte a categorização e tags
- Campos de SEO otimizados

### 3.4 Páginas Institucionais e Layout
- Home, Sobre, Contato, Privacidade, Termos
- Layout global com Header/Footer refatorado

### 3.5 Personalização para Leads Retornantes
- Sistema de identificação e reconhecimento de leads retornantes implementado via hook `useReturningLead`
- Interface personalizada baseada em histórico de interações
- Banners personalizados com mensagens contextuais
- Integração com perfil do Sanity para dados persistentes

### 3.6 Páginas de Serviço/Produto
- Implementadas páginas dinâmicas em `/solucoes/[slug]` com estrutura modular
- Componentes especializados para diferentes seções
- Visualização avançada de fluxos de automação (`howItWorksSteps`)
- Design responsivo com conectores visuais
- Renderização condicional
- Sistema de personalização (identificação de serviços recomendados)
- Indicadores visuais para serviços recomendados
- Navegação entre serviços relacionados

### 3.7 API de Leads
- Endpoints REST (`/export`, `/get-by-id`) com Basic Auth
- Filtragem e personalização de dados
- Integração com Redis para cache

### 3.8 Analytics Básico
- Integração com Vercel Analytics (Page Views, Web Vitals)
- Rastreamento de eventos customizados chave: `Quiz Submitted`, `Report Requested`, `Report Viewed`, `Report Scrolled`, `Report CTA Clicked`

## 4. Funcionalidades em Desenvolvimento/Planejadas

### 4.1 Melhorias nas Páginas de Serviço
- Animações e interatividade adicional para a visualização de fluxos
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
- Chatbot conversacional para qualificação (n8n + Evolution API)
- Entregáveis personalizados automatizados
- Agendamento de reuniões

## 5. Estado Atual por Módulo

| Módulo | Estado | Próximas Etapas |
|--------|--------|-----------------|
| **Quiz de Diagnóstico** | ✅ Implementado | Otimização de UX |
| **Geração de Relatórios** | ✅ Refatorado | Implementar notificação de falha |
| **Blog** | 🟡 Parcial | Implementar webhooks |
| **Personalização** | ✅ Implementado | Otimizar velocidade de carregamento? Expandir? |
| **Páginas de Serviço** | ✅ Implementado | Adicionar calculadoras ROI, testemunhos |
| **WhatsApp** | 🟡 Parcial | Configurar/Testar fluxos n8n |
| **Redes Sociais** | 🟡 Parcial | Configurar webhooks n8n |
| **Email Marketing** | 🔴 Não iniciado | Definir fluxos e triggers |
| **API de Leads** | ✅ Implementado | Expandir endpoints? Otimizar cache? |
| **Visualização de Fluxos** | ✅ Implementado | - |
| **Analytics** | 🟡 Parcial | Expandir eventos rastreados |

## 6. Estrutura de Arquivos do Projeto

### 6.1 Principais Componentes e Páginas

```
/app
  /api
    /audit-quiz
      /submit
      /request-report
      /report-status
    /reports
      /generate # (Endpoint interno protegido)
  /mini-auditoria
  /obrigado
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
    QuizProgress.tsx
    QuizQuestion.tsx
  /layout
    Header.tsx
    Footer.tsx
  /ui # (Considerar mover Button, SectionTitle, etc. para cá)
    Button.tsx
    SectionTitle.tsx
    ServiceCard.tsx
    MobileMenu.tsx
  /blog
  /services
    ServiceHeader.tsx
    ServiceBenefits.tsx
    ServiceHowItWorks.tsx
    # AutomationFlowSteps.tsx (Existe? Ou faz parte de HowItWorks?)
    ServiceRequirements.tsx
    ServiceMetrics.tsx
    ServiceCTA.tsx
    PersonalizedServiceBanner.tsx
    PersonalizedServiceWrapper.tsx
    # RelatedServices.tsx (Existe?)
  /personalization
    WelcomeBackBanner.tsx
    WelcomeBackWrapper.tsx
    PersonalizedImage.tsx
    PersonalizedWelcomeBlock.tsx
    RecommendedServices.tsx
  /reports
    ReportCTAButton.tsx
  AnalyticsTracker.tsx
  AnimatedFacts.tsx
  ReportStatusIndicator.tsx

/lib
  /services
    serviceQueries.ts
    serviceUtils.ts
    imageUtils.ts
    /reports
      reportGenerator.ts
  /hooks
    useReturningLead.ts
  /portable-text
    components.tsx
  /ai
    gemini.ts
  /matching
    serviceRecommender.ts
  /sanity
    client.ts
    image.ts
    mutations.ts
    queries.ts
    utils.ts
  /utils
    reportGenerator.ts
    simulation.ts
  /types.ts
```
*(Nota: Estrutura de arquivos atualizada com base nas refatorações e arquivos existentes)*

### 6.2 Fluxos de Dados Principais

1. **Fluxo de Diagnóstico e Relatório**:
   ```
   Quiz/WhatsApp(n8n) → API /submit → createLead (Sanity) → fetch API /generate (async) → generateReportAsync (IA, Sanity) → updateLead (Sanity)
   Frontend (Obrigado) → polling API /report-status → fetch Lead (Sanity) → Exibe Status/Link
   ```

2. **Fluxo de Blog e Redes Sociais**: (Inalterado)
   ```
   Sanity → Webhook → n8n → Adaptação → Publicação
   ```

3. **Fluxo de Personalização**: (Inalterado - Investigar otimização de velocidade)
   ```
   Identificação (Cookie/localStorage?) → Recuperação de Dados (Client-side Sanity fetch) → Renderização Personalizada
   ```

4. **Fluxo de Páginas de Serviço**: (Inalterado)
   ```
   Requisição → Query Sanity → Verificação de Lead → Personalização → Renderização
   ```

## 7. Prioridades Atuais

### 7.1 Prioridade Alta
1.  ✅ **Completar dados no Sanity para serviços** (Assumindo concluído conforme informado)
2.  ✅ **Integração com APIs externas**
    *   Desenvolver integração com Perplexity e LinkedIn
    *   Expandir uso do webhook Sanity -> n8n já configurado
3.  🟡 **Rastreamento e métricas**
    *   Expandir eventos rastreados no Vercel Analytics (ex: visualização de serviço, identificação de lead retornante).
    *   Configurar dashboard de conversão (na Vercel ou ferramenta externa).
4.  ✅ **Verificar e corrigir campos do quiz de auditoria** (Auditoria concluída, sem problemas encontrados)
5.  🟡 **Otimizar fluxos de processamento assíncrono** (Refatoração feita, falta notificação)
    *   Implementar notificação de falha na geração de relatório (`TODO` em `generateReportAsync`).

### 7.2 Prioridade Média
*(Inalterado)*
1.  Calculadoras de ROI
2.  Webhooks para redes sociais
3.  Continuidade do blog

### 7.3 Prioridade Baixa
*(Inalterado)*
1.  Nutrição de email
2.  Testemunhos e casos de sucesso

## 8. Aspectos Técnicos e Desafios

### 8.1 Desafios Atuais
- Monitoramento de falhas na geração assíncrona
- Manutenção de conteúdo estruturado no Sanity
- Consistência visual entre personalização e design base
- Otimização da velocidade de carregamento da personalização client-side

### 8.2 Considerações de Escalabilidade
*(Inalterado)*
- Crescimento potencial da base de leads
- Aumento de demanda de processamento para relatórios
- Necessidade de cache estratégico

### 8.3 Segurança e Privacidade
- Conformidade com LGPD
- Proteção de dados de leads
- Acesso controlado a informações sensíveis
- ✅ API `/generate` protegida por secret token

## 9. Plano de Implementação

*(Atualizado com base no estado atual)*

### 9.1 Curto Prazo
1.  ✅ Implementar visualização de fluxos no componente `ServiceHowItWorks`
2.  ✅ Completar dados no Sanity com conteúdo formatado
3.  ✅ Adicionar dados estruturados para todos os serviços no campo `howItWorksSteps`
4.  🟡 Implementar rastreamento básico de interações (Vercel Analytics iniciado)
5.  ✅ Configurar webhook Sanity -> n8n para processamento assíncrono
6.  ✅ Refatorar sistema de status da geração de relatórios
7.  ✅ Proteger API de geração de relatórios
8.  ✅ Consolidar lógica de simulação

### 9.2 Médio Prazo
1.  🟡 Integrar com Replicate para geração de imagens personalizadas (Verificar se ainda é prioridade)
2.  Desenvolver calculadoras de ROI específicas por serviço
3.  Implementar seção de depoimentos de clientes
4.  Configurar webhooks para redes sociais
5.  Implementar schema.org e metadados avançados para SEO
6.  Implementar notificação de falha na geração de relatório
7.  Expandir rastreamento de eventos no Analytics

### 9.3 Longo Prazo
*(Inalterado)*
1.  Implementar assistente de WhatsApp
2.  Sistema completo de nutrição por email
3.  Expansão para modelos preditivos de recomendação
4.  Adicionar demonstrações interativas das automações oferecidas

## 10. Colaboração e Workflow

*(Inalterado)*

## 11. Conclusão e Próximos Passos Prioritários

O projeto avançou com refatorações importantes no sistema de geração de relatórios (status, segurança, otimização) e na implementação inicial de analytics. As prioridades imediatas agora são:

1.  **Implementar Notificação de Falha:** Adicionar a notificação pendente (`TODO`) em `generateReportAsync`.
2.  **Expandir Analytics:** Adicionar rastreamento para mais eventos chave (visualização de serviço, lead retornante).
3.  **Otimizar Personalização:** Investigar e implementar melhorias na velocidade de carregamento da personalização na home page (ex: server-side fetching com cookies).
4.  **Integrações Externas:** Continuar desenvolvimento das integrações com Perplexity, LinkedIn e n8n.

Este documento reflete o estado atual após as últimas modificações.
