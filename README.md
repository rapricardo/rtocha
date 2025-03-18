# Automação Inteligente para Marketing e Vendas

Sistema de diagnóstico e recomendação automatizada para marketing e vendas, utilizando inteligência artificial para gerar insights personalizados e mini-auditorias.

## Visão Geral do Projeto

Este projeto implementa uma plataforma web para automação de processos de marketing e vendas através de:

- **Quiz de diagnóstico inteligente**: Coleta de dados estruturados sobre o cliente
- **Mini-auditoria automatizada**: Análise personalizada com recomendações específicas
- **Inteligência artificial generativa**: Utilização de LLMs para personalização avançada
- **Analytics integrado**: Rastreamento de visualizações e conversões para medição de resultados

O sistema segue uma metodologia estruturada de consultoria e implementação, focada na entrega de valor e resultados tangíveis.

## Principais Funcionalidades

- **Quiz Interativo**: Interface intuitiva para coleta de informações do cliente
- **Geração de Relatórios**: Criação automática de mini-auditorias personalizadas
- **Processamento Assíncrono**: Gerenciamento de tarefas longas usando verificação de status
- **Integração com IA**: Utilização do Google Gemini para análise contextual e recomendações
- **CMS Headless**: Gerenciamento de conteúdo via Sanity para facilitar atualizações
- **Rastreamento de Analytics**: Medição de visualizações, engagement e conversões

## Estrutura do Projeto

```
/src
  /app                # Rotas e páginas da aplicação
    /api              # Endpoints da API
      /audit-quiz     # Endpoints relacionados ao quiz e geração de relatórios
      /test-sanity    # Endpoints de teste para o Sanity
      /test-write     # Endpoints de teste para escrita
      /test-env       # Endpoints de teste para variáveis de ambiente
    /mini-auditoria   # Páginas relacionadas à mini-auditoria
    /relatorios       # Páginas de visualização de relatórios
  /components         # Componentes reutilizáveis
    /audit-quiz       # Componentes específicos do quiz
    /icons            # Componentes de ícones
  /docs               # Documentação interna do código
  /lib                # Bibliotecas e utilitários
    /ai               # Integração com APIs de IA (Gemini)
    /matching         # Algoritmos de matching para recomendações
    /sanity           # Cliente e queries do Sanity CMS
    /services         # Serviços para processamento assíncrono
    /utils            # Funções utilitárias gerais
    types.ts          # Definições de tipos TypeScript
/docs                 # Documentação do projeto
/public               # Arquivos estáticos
```

## Tecnologias Utilizadas

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **CMS**: Sanity.io
- **IA**: Google Gemini API
- **Hospedagem**: Vercel

## Metodologia de Desenvolvimento

Este projeto segue um processo estruturado de consultoria e implementação:

1. **Diagnóstico Inicial**: Coleta de dados e identificação de oportunidades
2. **Definição de Elementos Base**: Configuração do CMS e elementos da marca
3. **Blueprint do Agente**: Desenho do fluxo de processamento e decisão
4. **Implementação e Ajustes**: Codificação e testes do sistema
5. **Ativação e Acompanhamento**: Deploy, monitoramento e analytics

Para mais detalhes, consulte o [Processo de Consultoria e Implementação](docs/Processo%20de%20Consultoria%20e%20Implementacao.md).

## Analytics e Métricas

O sistema implementa rastreamento de:
- **Visualizações**: Contabiliza acessos aos relatórios
- **Engagement**: Avalia interação com o conteúdo
- **Conversões**: Monitora cliques em CTAs e outras ações
- **Jornada**: Mapeia o percurso do usuário pelo sistema

## Configuração do Ambiente

### Pré-requisitos

- Node.js 18+ e npm
- Conta no Sanity.io
- Chave de API do Google Gemini

### Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd [nome-do-projeto]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=seu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-12-01
SANITY_API_TOKEN=seu-token-de-escrita
GOOGLE_AI_API_KEY=sua-chave-do-gemini
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

5. Em outro terminal, inicie o Sanity Studio
```bash
cd studio
npm install
npm run dev
```

## Deploy

### Frontend (Next.js)
O deploy é realizado automaticamente na Vercel quando há push para a branch main.

### CMS (Sanity Studio)
```bash
cd studio
sanity deploy
```

## Limitações Técnicas e Soluções

- **Timeouts em Requisições Longas**: Implementado sistema de processamento assíncrono
- **Quotas de API**: Mecanismo de fallback para casos de excedentes
- **Consistência de Dados**: Sistema de tipos robusto para garantir integridade

## Próximos Passos

- [ ] Dashboard de visualização consolidada de métricas
- [ ] Integração com CRMs populares
- [ ] Sistema de notificações para leads gerados
- [ ] Expansão do sistema de recomendações

---

Este projeto foi desenvolvido para maximizar o retorno sobre investimento em automação inteligente, com foco em resultados tangíveis para profissionais de marketing e vendas.
