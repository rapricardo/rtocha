# API de Leads

Esta API fornece acesso programático aos dados de leads armazenados no Sanity.

## Endpoints

### `GET /api/leads/export`

Exibe todos os leads armazenados no Sanity, com opções de filtragem e personalização dos dados retornados.

#### Autenticação

Utiliza autenticação Basic Auth. Configure as seguintes variáveis de ambiente:

```
API_USERNAME=seu_usuario
API_PASSWORD=sua_senha
```

#### Parâmetros de consulta

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `updatedSince` | ISO Date | Filtra leads atualizados ou criados após a data especificada | `2023-01-01T00:00:00Z` |
| `includeAnalysis` | Boolean | Inclui dados de análise detalhados (campos mais pesados) | `true` ou `false` |
| `limit` | Number | Limita o número de registros retornados | `100` (padrão: 1000) |

#### Exemplo de requisição

```bash
curl -X GET "https://seu-dominio.com/api/leads/export?updatedSince=2023-01-01T00:00:00Z&includeAnalysis=false" \
     -H "Authorization: Basic $(echo -n 'seu_usuario:sua_senha' | base64)"
```

#### Resposta de sucesso

```json
{
  "success": true,
  "timestamp": "2023-05-03T12:34:56.789Z",
  "count": 42,
  "leads": [
    {
      "_id": "abc123",
      "name": "Nome do Lead",
      "email": "email@exemplo.com",
      "companyName": "Empresa Exemplo",
      "jobTitle": "Cargo",
      "phone": "+5511987654321",
      "whatsapp": "+5511987654321",
      "mainChallenge": "qualified_leads",
      "improvementGoal": "increase_revenue",
      "status": "qualified",
      "reportGenerated": true,
      "reportRef": "def456",
      "recommendedServices": ["servico-1", "servico-2"],
      "createdAt": "2023-01-15T10:30:00Z",
      "updatedAt": "2023-02-20T14:45:00Z"
    },
    // ... mais leads
  ]
}
```

#### Códigos de resposta

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 401 | Não autorizado (credenciais inválidas) |
| 500 | Erro interno do servidor |

## Uso com o n8n

Para configurar o n8n para consumir esta API:

1. Adicione um nó HTTP Request
2. Configure o método como GET
3. URL: `https://seu-dominio.com/api/leads/export`
4. Authentication: Basic Auth
5. Forneça as credenciais configuradas no ambiente

O resultado pode ser processado e armazenado no Redis usando o nó Set do Redis.

## Segurança

- Este endpoint utiliza autenticação Basic Auth
- Configure credenciais fortes e únicas
- O tráfego deve ser protegido com HTTPS em produção
- As credenciais nunca devem ser compartilhadas
- Considere implementar rate limiting para proteção contra ataques de força bruta
