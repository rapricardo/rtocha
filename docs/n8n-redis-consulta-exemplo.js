/**
 * Exemplo de função para consultar leads no Redis a partir do WhatsApp
 * Para uso no nó Function do n8n no fluxo de conversas do WhatsApp
 */

// Recebe o conteúdo da mensagem e o número do WhatsApp
async function consultarLead(whatsappNumber, $redis) {
  try {
    // Normalizar o número de telefone (remover caracteres não numéricos)
    const normalizedPhone = whatsappNumber.replace(/\D/g, '');
    
    // Tentar buscar o lead pelo número do WhatsApp
    const leadId = await $redis.get(`lead:phone:${normalizedPhone}`);
    
    // Se não encontrar, retorna que não existe
    if (!leadId) {
      return {
        exists: false,
        message: "Lead não encontrado no sistema."
      };
    }
    
    // Buscar os detalhes completos do lead
    const leadDetailsJson = await $redis.get(`lead:id:${leadId}`);
    
    // Se os detalhes não forem encontrados (inconsistência de dados)
    if (!leadDetailsJson) {
      return {
        exists: true,
        inconsistent: true,
        id: leadId,
        message: "Lead encontrado, mas sem detalhes. Possível inconsistência de dados."
      };
    }
    
    // Converter o JSON para objeto
    const leadDetails = JSON.parse(leadDetailsJson);
    
    // Formatar uma resposta amigável
    return {
      exists: true,
      lead: leadDetails,
      message: `Lead encontrado: ${leadDetails.name}${leadDetails.company ? ` da empresa ${leadDetails.company}` : ''}`,
      summary: formatarResumoLead(leadDetails)
    };
  } catch (error) {
    // Capturar qualquer erro durante o processo
    console.error('Erro ao consultar lead no Redis:', error);
    return {
      exists: false,
      error: true,
      message: "Erro ao consultar o sistema. Por favor, tente novamente mais tarde."
    };
  }
}

// Função para formatar um resumo amigável do lead
function formatarResumoLead(lead) {
  const linhas = [
    `📊 *Resumo de ${lead.name}*`,
    ``,
    `📧 Email: ${lead.email || 'Não informado'}`,
    `🏢 Empresa: ${lead.companyName || 'Não informada'}`,
    `👨‍💼 Cargo: ${lead.jobTitle || 'Não informado'}`,
    `📱 Telefone: ${lead.phone || lead.whatsapp || 'Não informado'}`,
    `🌐 Site: ${lead.companySite || 'Não informado'}`,
    `👥 Tamanho da empresa: ${lead.companySize || 'Não informado'}`,
    `👤 Tamanho da equipe comercial: ${lead.salesTeamSize || 'Não informado'}`,
    `💻 Usa CRM: ${lead.usesCRM || 'Não informado'}`,
    `🤖 Usa automação: ${lead.usesAutomation || 'Não informado'}`,
    ``,
    `💡 Desafio principal: ${lead.mainChallenge || 'Não informado'}`,
    `🏁 Objetivo de melhoria: ${lead.improvementGoal || 'Não informado'}`,
    ``,
    `📅 Cliente desde: ${formatarData(lead.createdAt)}`,
    `🔄 Última atualização: ${formatarData(lead.updatedAt)}`,
    `📑 Relatório gerado: ${lead.reportGenerated ? '✅ Sim' : '❌ Não'}`,
  ];
  
  // Adicionar serviços recomendados se existirem
  if (lead.recommendedServices && lead.recommendedServices.length > 0) {
    linhas.push('');
    linhas.push(`📫 *Serviços Recomendados:*`);
    lead.recommendedServices.forEach(service => {
      linhas.push(`  • ${service.name}`);
    });
  }
  
  // Adicionar resumo da auditoria se existir
  if (lead.auditSummary) {
    linhas.push('');
    linhas.push(`📋 *Resumo da Auditoria:*`);
    linhas.push(lead.auditSummary);
  }
  
  return linhas.join('\n');
}

// Função para formatar data
function formatarData(isoString) {
  if (!isoString) return 'Desconhecida';
  
  const data = new Date(isoString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Exemplo de uso no nó Function do n8n
async function executarNo(items, $redis) {
  // Obter o número do WhatsApp da mensagem recebida
  const whatsappNumber = items[0].json.from;
  
  // Consultar o lead
  const resultado = await consultarLead(whatsappNumber, $redis);
  
  // Retornar o resultado para ser usado nos próximos nós
  items[0].json.leadInfo = resultado;
  
  // Se o lead existir, adicionar ao contexto da conversa
  if (resultado.exists && resultado.lead) {
    items[0].json.leadContext = {
      name: resultado.lead.name,
      email: resultado.lead.email,
      company: resultado.lead.company,
      isExistingLead: true
    };
  }
  
  return items;
}

// Para teste em desenvolvimento
async function testarLocalmente() {
  // Mockup da função do Redis
  const mockRedis = {
    async get(key) {
      const mockData = {
        'lead:phone:5511999999999': 'lead123',
        'lead:id:lead123': JSON.stringify({
          id: 'lead123',
          name: 'João Silva',
          email: 'joao@empresa.com',
          phone: '+55 (11) 99999-9999',
          whatsapp: '+55 (11) 99999-9999',
          companyName: 'Empresa Exemplo Ltda',
          jobTitle: 'Diretor de Marketing',
          companySite: 'https://empresaexemplo.com.br',
          companySize: '11-50',
          salesTeamSize: '1-3',
          usesCRM: 'active_use',
          usesAutomation: 'planning',
          mainChallenge: 'qualified_leads',
          mainChallengeDescription: 'Temos dificuldade em conseguir leads qualificados para nossa equipe comercial.',
          improvementGoal: 'increase_revenue',
          industry: 'saas',
          status: 'qualified',
          auditSummary: 'Empresa com bom potencial, precisa melhorar a qualificação de leads e automatizar processos iniciais de vendas.',
          createdAt: '2023-01-15T10:30:00Z',
          updatedAt: '2023-05-20T14:45:00Z',
          reportGenerated: true,
          recommendedServices: [
            { _id: 'service1', name: 'Agente SDR Virtual', slug: 'agente-sdr-virtual', shortDescription: 'Qualificação automática de leads', priority: 1 },
            { _id: 'service2', name: 'Agente de Recuperação de Oportunidades', slug: 'agente-recuperacao-oportunidades', shortDescription: 'Recuperação automática de leads estagnados', priority: 2 }
          ]
        })
      };
      
      return mockData[key] || null;
    }
  };
  
  // Testar a consulta
  const resultado = await consultarLead('5511999999999', mockRedis);
  console.log('Resultado da consulta:', JSON.stringify(resultado, null, 2));
  
  // Testar lead não encontrado
  const resultadoNaoEncontrado = await consultarLead('5511888888888', mockRedis);
  console.log('Lead não encontrado:', JSON.stringify(resultadoNaoEncontrado, null, 2));
}

// Descomentar para testar localmente (fora do n8n)
// testarLocalmente().catch(console.error);

// No n8n, a exportação seria assim:
// module.exports = { executarNo };
