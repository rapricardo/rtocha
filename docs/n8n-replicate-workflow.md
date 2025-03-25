# Fluxo do n8n para Processar Imagens do Replicate

Este documento descreve o novo fluxo para trabalhar com imagens geradas pelo Replicate, armazenando apenas URLs no Sanity, ao invés de fazer upload dos arquivos.

## Visão Geral do Fluxo

1. Trigger (webhook do Sanity ou manual)
2. Geração de imagem no Replicate
3. **Alteração**: Em vez de baixar a imagem e fazer upload para o Supabase, vamos salvar diretamente a URL do Replicate
4. Atualização do documento no Sanity com a URL da imagem

## Implementação no n8n

### 1. Configuração do Nó de Trigger

- Webhook do Sanity quando um novo lead é criado
- Ou um trigger manual para testes

### 2. HTTP Request para o Replicate

```javascript
// Configuração do nó HTTP Request
{
  "url": "https://api.replicate.com/v1/predictions",
  "method": "POST",
  "authentication": "headerAuth",
  "headerParameters": {
    "Authorization": "Token seu_token_do_replicate"
  },
  "bodyParameters": {
    "version": "modelo_do_replicate", // ex: "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
    "input": {
      "prompt": "Uma imagem personalizada para {{$node.Webhook.json.body.name}} da empresa {{$node.Webhook.json.body.companyName}}, mostrando {{$node.Webhook.json.body.mainChallenge}}", 
      "negative_prompt": "Baixa qualidade, distorção",
      "width": 1024,
      "height": 1024
    }
  }
}
```

### 3. Verificação de Status (Wait)

```javascript
// Configuração do nó Function para verificar status
const MAX_RETRIES = 10;
const RETRY_INTERVAL = 5000; // 5 segundos

// Função para verificar status
async function checkStatus(replicateResponse) {
  let prediction = replicateResponse;
  let retries = 0;
  
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && retries < MAX_RETRIES) {
    await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    
    const response = await $http.get({
      url: `https://api.replicate.com/v1/predictions/${prediction.id}`,
      headers: {
        'Authorization': 'Token seu_token_do_replicate'
      }
    });
    
    prediction = response.data;
    retries++;
  }
  
  return prediction;
}

// Execução
const result = await checkStatus($input.item);
return result;
```

### 4. Atualização do Sanity

```javascript
// Configuração do nó HTTP Request para Sanity
{
  "url": "https://sua_api_sanity/v2023-06-01/data/mutate/production",
  "method": "POST",
  "authentication": "headerAuth",
  "headerParameters": {
    "Authorization": "Bearer {{$env.SANITY_API_TOKEN}}",
    "Content-Type": "application/json"
  },
  "bodyParameters": {
    "mutations": [
      {
        "patch": {
          "id": "{{$node.Webhook.json.body._id}}",
          "set": {
            "customImagesUrls": {
              "welcomeImageUrl": "{{$node.VerificaStatus.json.output[0]}}" // URL direta da imagem gerada pelo Replicate
            }
          }
        }
      }
    ]
  }
}
```

## Vantagens da Abordagem

1. **Simplicidade**: Elimina a etapa de upload para o Supabase Storage
2. **Confiabilidade**: Menos pontos de falha no processo
3. **Performance**: Evita processamento desnecessário de download e re-upload
4. **Economia de armazenamento**: Utiliza o armazenamento do Replicate (ou outro serviço) em vez de usar espaço no Supabase

## Considerações

1. **Tempo de vida das URLs**: As URLs do Replicate normalmente são permanentes, mas verifique a documentação para confirmar
2. **Backup**: Considere um processo periódico para fazer backup das imagens importantes caso deseje maior controle
3. **CDN**: Se necessário maior controle sobre a distribuição, uma etapa opcional pode ser criada para copiar as imagens mais importantes para um CDN próprio

## Exemplo de URL do Replicate

As URLs de saída do Replicate geralmente seguem este formato:
```
https://replicate.delivery/pbxt/4MGXpBB2R76Nn2yxQc1p9VqnEWXbjnwsT5Dggj0yZeUeVEjXA/out-0.png
```

## Tratamento de Erros

1. **Monitoramento de erros**: Configure alertas para falhas no fluxo
2. **Retentativas automáticas**: Implemente lógica de retry para casos de falha temporária
3. **Fallback**: Configure URLs de imagens padrão para casos onde a geração falha

## Migração de Dados Existentes

Para leads já existentes com imagens no formato antigo, você pode criar um fluxo adicional no n8n para:

1. Buscar todos os leads com imagens no formato antigo
2. Para cada um, extrair a URL da imagem existente do Sanity
3. Atualizar o documento com a mesma URL no novo campo de URLs
