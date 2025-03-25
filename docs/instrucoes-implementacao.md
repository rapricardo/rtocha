# Instruções de Implementação - Alteração no Schema para Imagens

Este documento fornece instruções para implementar a alteração proposta: modificar o schema do Sanity para armazenar URLs de imagens em vez de arquivos, resolvendo os problemas de conectividade entre o n8n e o Supabase Storage.

## Etapas de Implementação

### 1. Atualizar o Schema do Sanity

1. Acesse seu Sanity Studio
2. Localize o arquivo de schema para o tipo de documento `lead` (geralmente em `schemas/lead.js` ou similar)
3. Utilize como base o arquivo de exemplo fornecido: `update-lead-schema.js`
4. Adicione o novo campo `customImagesUrls` enquanto mantém temporariamente o campo antigo `customImages`
5. Implante as alterações no Sanity Studio

**Arquivo de referência:** `docs/update-lead-schema.js`

### 2. Atualizar o Hook useReturningLead

1. Modifique o arquivo `src/lib/hooks/useReturningLead.ts` para suportar ambos os formatos de imagem
2. Adicione a função `getImageUrl` para abstrair a lógica de busca, considerando ambos formatos
3. Atualize as referências de tipo para incluir o novo formato

**Arquivo de referência:** `docs/updated-useReturningLead.ts`

### 3. Atualizar o Fluxo no n8n

1. Modifique o fluxo existente para remover as etapas de download e upload para o Supabase Storage
2. Configure o n8n para salvar diretamente as URLs do Replicate no Sanity
3. Atualize a referência do campo no Sanity para usar `customImagesUrls` em vez de `customImages`

**Arquivo de referência:** `docs/n8n-replicate-workflow.md`

### 4. Testar a Implementação

1. Crie um lead de teste
2. Acione o fluxo do n8n para gerar uma imagem
3. Verifique se a URL está sendo corretamente armazenada no novo campo
4. Teste a exibição na interface usando o hook atualizado

### 5. Migrar Dados Existentes (Se Necessário)

Se houver leads com imagens no formato antigo:

1. Crie um script de migração ou um fluxo no n8n para transferir os dados
2. Para cada lead com imagens no formato antigo:
   - Extraia as URLs das imagens do Sanity
   - Atualize o documento inserindo as mesmas URLs no novo campo

### 6. Monitoramento e Revisão

1. Monitore o funcionamento do novo fluxo
2. Verifique se todas as partes da aplicação estão utilizando a função `getImageUrl` para acessar as imagens
3. Corrija quaisquer problemas identificados

## Benefícios da Implementação

- **Eliminação do problema de conectividade** entre n8n e Supabase Storage
- **Processo simplificado** com menos etapas e pontos de falha
- **Redução no uso de armazenamento** ao utilizar diretamente as URLs do Replicate
- **Melhor desempenho** ao evitar downloads e uploads desnecessários

## Considerações Futuras

- Após um período de funcionamento estável, remover o campo antigo `customImages` do schema
- Avaliar a necessidade de um sistema de backup para as imagens mais importantes
- Considerar a implementação de um CDN próprio para maior controle sobre as imagens, se necessário

## Documentação Adicional

Para informações detalhadas sobre cada componente da solução, consulte os seguintes documentos:

- `docs/schema-update-custom-images.md` - Detalhes completos sobre as alterações no schema
- `docs/updated-useReturningLead.ts` - Hook atualizado para suportar ambos os formatos
- `docs/update-lead-schema.js` - Exemplo de implementação do schema atualizado
- `docs/n8n-replicate-workflow.md` - Detalhes sobre o fluxo atualizado no n8n
