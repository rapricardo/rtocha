# Workflow n8n para Exportação de Leads para Redis

Este documento detalha o workflow do n8n para buscar leads da API do Next.js e armazená-los no Redis para acesso rápido durante interações no WhatsApp.

## Visão Geral do Workflow

Este workflow realiza as seguintes operações:

1. Agenda a execução para iniciar diariamente às 4:00 AM
2. Busca todos os leads da API do Next.js
3. Processa os dados para otimizar a busca
4. Armazena no Redis com diferentes padrões de chave para busca eficiente
5. Configura TTL (Time-To-Live) para expiração dos dados
6. Envia notificação sobre o resultado da atualização

## Configuração do n8n

### Pré-requisitos

- n8n configurado e rodando
- Credenciais do Redis configuradas no n8n
- Variáveis de ambiente para autenticação na API configuradas

### Nós do Workflow

#### 1. Schedule Trigger

- **Tipo**: Schedule
- **Configuração**:
  - Mode: `Basic`
  - Hour: `4` (4:00 AM)
  - Minute: `0`
  - Timezone: `America/Sao_Paulo`

#### 2. HTTP Request (Buscar Leads)

- **Tipo**: HTTP Request
- **Configuração**:
  - Method: `GET`
  - URL: `https://seu-dominio.com/api/leads/export`
  - Authentication: `Basic Auth`
  - User: `{{$env.API_USERNAME}}`
  - Password: `{{$env.API_PASSWORD}}`
  - Response Format: `JSON`
  - Options:
    - Timeout: `120000` (2 minutos)

#### 3. Function (Processar Leads)

- **Tipo**: Function
- **Configuração**:
  - Function Code:
```javascript
// Processar os leads para formato otimizado para Redis
const leads = items[0].json.leads;
const output = [];

// Para cada lead, criar diferentes entradas para diferentes tipos de busca
for (const lead of leads) {
  // Dados principais do lead com todos os campos relevantes
  const leadData = {
    id: lead._id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone || lead.whatsapp || '',
    whatsapp: lead.whatsapp || lead.phone || '',
    companyName: lead.companyName || '',
    jobTitle: lead.jobTitle || '',
    companySite: lead.companySite || '',
    companySize: lead.companySize || '',
    salesTeamSize: lead.salesTeamSize || '',
    usesCRM: lead.usesCRM || '',
    usesAutomation: lead.usesAutomation || '',
    mainChallenge: lead.mainChallenge || '',
    mainChallengeDescription: lead.mainChallengeDescription || '',
    improvementGoal: lead.improvementGoal || '',
    industry: lead.industry || '',
    status: lead.status || 'new',
    auditSummary: lead.auditSummary || '',
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt || lead.createdAt,
    reportStatus: lead.reportStatus,
    reportGenerated: lead.reportGenerated || false,
    reportRequested: lead.reportRequested || false,
    reportRef: lead.reportRef || null,
    recommendedServices: lead.recommendedServices || []
  };
  
  const leadDataString = JSON.stringify(leadData);
  
  // Entrada principal por ID
  output.push({
    key: `lead:id:${lead._id}`,
    value: leadDataString,
    json: leadData
  });
  
  // Índice por email (para busca rápida)
  if (lead.email) {
    output.push({
      key: `lead:email:${lead.email.toLowerCase()}`,
      value: lead._id,
      json: { id: lead._id }
    });
  }
  
  // Índice por telefone/whatsapp (para busca rápida no WhatsApp)
  const phone = lead.phone || lead.whatsapp;
  if (phone) {
    // Normalizando o formato do telefone (removendo caracteres não numéricos)
    const normalizedPhone = phone.replace(/\D/g, '');
    output.push({
      key: `lead:phone:${normalizedPhone}`,
      value: lead._id,
      json: { id: lead._id }
    });
  }
  
  // Índice por empresa (para busca por empresa)
  if (lead.companyName) {
    const companyKey = lead.companyName.toLowerCase().replace(/\s+/g, '_');
    output.push({
      key: `lead:company:${companyKey}`,
      value: lead._id,
      json: { id: lead._id }
    });
  }
}

// Adicionar metadados
output.push({
  key: 'lead:metadata',
  value: JSON.stringify({
    lastUpdated: new Date().toISOString(),
    count: leads.length
  }),
  json: {
    lastUpdated: new Date().toISOString(),
    count: leads.length
  }
});

return output;
```

#### 4. Redis (Armazenar Leads)

- **Tipo**: Redis
- **Configuração**:
  - Operation: `Set`
  - Key: `={{ $json.key }}`
  - Value: `={{ $json.value }}`
  - Expire: `86400` (24 horas em segundos)

#### 5. Function (Preparar Relatório)

- **Tipo**: Function
- **Configuração**:
  - Function Code:
```javascript
// Preparar relatório de resultados
let leadsByType = {
  id: 0,
  email: 0,
  phone: 0,
  company: 0,
  metadata: 0
};

for (const item of items) {
  const key = item.json.key;
  
  if (key.includes(':id:')) leadsByType.id++;
  else if (key.includes(':email:')) leadsByType.email++;
  else if (key.includes(':phone:')) leadsByType.phone++;
  else if (key.includes(':company:')) leadsByType.company++;
  else if (key.includes(':metadata')) leadsByType.metadata++;
}

// Buscar o total de leads
const totalLeads = leadsByType.id;

return [{
  json: {
    success: true,
    timestamp: new Date().toISOString(),
    message: `Cache do Redis atualizado com sucesso. ${totalLeads} leads armazenados com índices para email, telefone e empresa.`,
    details: leadsByType
  }
}];
```

#### 6. IF (Verificar Sucesso)

- **Tipo**: IF
- **Configuração**:
  - Condition 1:
    - Value 1: `={{ $json.success }}`
    - Operation: `equals`
    - Value 2: `true`

#### 7A. Slack (Notificação de Sucesso) - IF branch

- **Tipo**: Slack
- **Configuração**:
  - Channel: `#automacao-avisos`
  - Text: `✅ Atualização do cache de leads no Redis concluída com sucesso!\n\n${$json.message}`
  - Attachments: `{{ $json.details }}`

#### 7B. Slack (Notificação de Erro) - ELSE branch

- **Tipo**: Slack
- **Configuração**:
  - Channel: `#automacao-erros`
  - Text: `🚨 Erro na atualização do cache de leads no Redis!\n\n${$json.message || $json.error}`
  - Attachments: `{{ $json.details || $json.stack }}`

## Fluxo de Dados no Redis

### Estrutura de Chaves

O workflow cria as seguintes estruturas de chaves no Redis:

1. **lead:id:{id}** - Armazena todos os dados principais do lead pelo ID
2. **lead:email:{email}** - Mapeia email → ID do lead
3. **lead:phone:{phone}** - Mapeia telefone normalizado → ID do lead
4. **lead:company:{company}** - Mapeia nome da empresa → ID do lead
5. **lead:metadata** - Armazena metadados sobre a última atualização

### Exemplo de Uso no n8n para WhatsApp

Exemplo de como usar os dados do Redis em um workflow do WhatsApp:

```javascript
// Exemplo: Buscar lead pelo número de telefone
const whatsappNumber = $node.WhatsApp.json.from.replace(/\D/g, '');

// Buscar ID do lead usando o número do WhatsApp
const leadId = await $nodeRedis.get(`lead:phone:${whatsappNumber}`);

if (!leadId) {
  // Lead não encontrado, tratar como novo
  return { exists: false, message: "Lead não encontrado" };
}

// Buscar detalhes completos do lead
const leadDetails = await $nodeRedis.get(`lead:id:${leadId}`);
const lead = JSON.parse(leadDetails);

return {
  exists: true,
  lead: lead,
  message: `Lead encontrado: ${lead.name} da empresa ${lead.company}`
};
```

## Manutenção e Monitoramento

### Verificação de Saúde

Para verificar o status do cache de leads no Redis:

1. Crie um workflow separado com um trigger HTTP
2. Adicione um nó Redis configurado para `GET lead:metadata`
3. Retorne os dados de metadados como resposta, incluindo contagem e data da última atualização

### Reconstrução Manual

Para forçar uma reconstrução manual do cache:

1. Adicione um trigger HTTP ao workflow principal
2. Configure com um token de segurança como parâmetro de consulta
3. Permita a execução manual através de uma chamada HTTP autenticada

## Considerações de Segurança

- As credenciais da API e do Redis devem ser armazenadas como variáveis de ambiente no n8n
- O acesso ao n8n deve ser restrito apenas aos administradores autorizados
- O tráfego entre o n8n e o Redis deve ser criptografado se estiverem em servidores diferentes
- Implemente monitoramento para detectar falhas na atualização do cache
