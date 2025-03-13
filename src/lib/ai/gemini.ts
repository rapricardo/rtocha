import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa a API do Google com a chave de API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Obtém o modelo Gemini 1.5 Flash (o modelo rápido)
const getModel = () => {
  return genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.4, // Valor mais baixo para maior determinismo
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192, // Ajuste conforme necessário
    }
  });
};

// Função para gerar recomendações personalizadas
export async function generatePersonalizedRecommendations(leadData: any, services: any[]) {
  try {
    const model = getModel();
    
    // Formata as informações dos serviços disponíveis
    const formattedServices = services.map(s => 
      `Nome: ${s.name}\nDescrição: ${s.shortDescription}\nProblemas resolvidos: ${(s.problemsSolved || []).join(', ')}\n`
    ).join('\n---\n');
    
    // Constrói o prompt
    const prompt = `
    Você é um especialista em automação para marketing e vendas. Com base nos dados deste lead, recomende os 3 melhores serviços e personalize as descrições.
    
    ## DADOS DO LEAD:
    - Nome: ${leadData.name}
    - Empresa: ${leadData.companyName}
    - Cargo: ${leadData.jobTitle || 'Não informado'}
    - Site da empresa: ${leadData.companySite || 'Não informado'}
    - Tamanho da empresa: ${leadData.companySize}
    - Estrutura de marketing: ${leadData.marketingStructure || 'Não informado'}
    - Tamanho da equipe comercial: ${leadData.salesTeamSize || 'Não informado'}
    - Estratégia de aquisição: ${leadData.clientAcquisitionStrategy || 'Não informado'}
    - Usa CRM: ${leadData.usesCRM || 'Não informado'}
    - Usa automações: ${leadData.usesAutomation || 'Não informado'}
    - Desafio principal: ${leadData.mainChallenge}
    - Objetivo de melhoria: ${leadData.improvementGoal}
    
    ## SERVIÇOS DISPONÍVEIS:
    ${formattedServices}
    
    ## INSTRUÇÕES:
    Analise os dados do lead e recomende os 3 serviços mais adequados para resolver seus desafios e atingir seus objetivos.
    
    Para cada serviço recomendado, forneça:
    1. O nome exato do serviço (como aparece na lista acima)
    2. Uma descrição personalizada do problema que este serviço resolverá especificamente para este lead (2-3 frases)
    3. Uma descrição personalizada do impacto deste problema nos resultados da empresa (2-3 frases)
    4. Três benefícios personalizados e quantificados sempre que possível
    5. Uma prioridade de implementação (1=alta, 2=média, 3=baixa)
    
    ## FORMATO DA RESPOSTA:
    Sua resposta deve ser um objeto JSON válido com esta estrutura:
    {
      "recommendations": [
        {
          "serviceName": "Nome do Serviço",
          "problemDescription": "Descrição personalizada do problema",
          "impactDescription": "Descrição personalizada do impacto",
          "benefits": ["Benefício 1", "Benefício 2", "Benefício 3"],
          "priority": 1
        },
        ...outros serviços...
      ]
    }
    
    Retorne APENAS o JSON válido, sem comentários adicionais.
    `;
    
    // Chama o modelo e solicita formato JSON
    console.log("📝 Enviando prompt para o Gemini...");
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = result.response;
    const text = response.text();
    console.log("✅ Resposta recebida do Gemini");
    
    // Processa a resposta - extrai e parse o JSON
    try {
      // Tenta fazer o parse direto primeiro
      return JSON.parse(text);
    } catch (error) {
      console.log("⚠️ Erro ao fazer parse direto, tentando extrair JSON do texto...");
      
      // Se falhar, tenta extrair o JSON de dentro do texto
      const jsonRegex = /{[\s\S]*}/;
      const match = text.match(jsonRegex);
      
      if (match) {
        return JSON.parse(match[0]);
      } else {
        throw new Error("Não foi possível extrair JSON válido da resposta");
      }
    }
  } catch (error) {
    console.error("❌ Erro ao gerar recomendações com Gemini:", error);
    throw error;
  }
}

// Função para gerar uma análise de contexto para o relatório
export async function generateContextAnalysis(leadData: any) {
  try {
    const model = getModel();
    
    const prompt = `
    Você é um consultor especialista em automação para marketing e vendas. Gere uma análise de contexto para um relatório de mini-auditoria para esta empresa específica.
    
    ## DADOS DA EMPRESA:
    - Nome: ${leadData.companyName}
    - Contato: ${leadData.name} (${leadData.jobTitle || 'Não informado'})
    - Site: ${leadData.companySite || 'Não informado'}
    - Tamanho da empresa: ${leadData.companySize}
    - Estrutura de marketing: ${leadData.marketingStructure || 'Não informado'}
    - Tamanho da equipe comercial: ${leadData.salesTeamSize || 'Não informado'}
    - Estratégia de aquisição: ${leadData.clientAcquisitionStrategy || 'Não informado'}
    - Usa CRM: ${leadData.usesCRM || 'Não informado'}
    - Usa automações: ${leadData.usesAutomation || 'Não informado'}
    - Desafio principal: ${leadData.mainChallenge}
    - Objetivo de melhoria: ${leadData.improvementGoal}
    
    ## INSTRUÇÕES:
    Gere duas partes distintas para o relatório:

    1. VISÃO GERAL: Um parágrafo conciso e direto (3-4 frases) que:
       - Mencione o nome da empresa especificamente
       - Identifique claramente o principal desafio que a empresa enfrenta
       - Conecte esse desafio com o objetivo declarado pela empresa
       - Enfatize o potencial de automação para resolver esses problemas
       - Use um tom profissional e assertivo

    2. ANÁLISE DE CONTEXTO: Dois parágrafos que:
       - Apresente uma análise detalhada da situação atual da empresa
       - Descreva o ambiente operacional da empresa com detalhes específicos (tamanho, estrutura, uso de tecnologia)
       - Identifique gargalos e oportunidades baseados nos dados fornecidos
       - Explique como a automação inteligente pode resolver os desafios identificados
       - Relacione as soluções aos objetivos de negócio da empresa
       - Seja específico e evite generalidades
    
    ## FORMATO DA RESPOSTA:
    Forneça apenas o texto da análise, sem introduções ou conclusões adicionais, no seguinte formato JSON:

    {
      "visaoGeral": "Parágrafo conciso e direto com 3-4 frases conforme instruções...",
      "analiseContexto": "Dois parágrafos detalhados conforme instruções..."
    }

    Não inclua nada além do JSON válido.
    `;
    
    console.log("📝 Enviando prompt para análise de contexto ao Gemini...");
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = result.response;
    const text = response.text();
    console.log("✅ Análise de contexto recebida do Gemini");
    
    try {
      // Tentar fazer o parse do JSON diretamente
      const jsonResponse = JSON.parse(text);
      return jsonResponse;
    } catch (error) {
      // Se falhar, tentar extrair o JSON do texto
      const jsonRegex = /{[\s\S]*}/;
      const match = text.match(jsonRegex);
      
      if (match) {
        return JSON.parse(match[0]);
      } else {
        // Se ainda falhar, retornar um objeto formatado com o texto bruto
        return {
          visaoGeral: "Análise personalizada para identificar oportunidades de automação em processos de marketing e vendas.",
          analiseContexto: text
        };
      }
    }
  } catch (error) {
    console.error("❌ Erro ao gerar análise de contexto com Gemini:", error);
    throw error;
  }
}
