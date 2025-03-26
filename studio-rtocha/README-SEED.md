# Instruções para Inserção de Dados de Teste

Este documento explica como usar o script de seed para inserir dados iniciais no Sanity.

## Pré-requisitos

- Você deve ter um token de API do Sanity com permissões de escrita
- Node.js instalado na sua máquina

## Passos para Inserir os Dados

1. **Criar token de API**:
   - Vá para [manage.sanity.io](https://manage.sanity.io/)
   - Selecione seu projeto "rtocha"
   - Navegue para "API" > "Tokens"
   - Clique em "Add New Token"
   - Dê um nome como "Seed Script"
   - Selecione permissões de "Editor" ou "Developer"
   - Copie o token gerado

2. **Configurar o Script**:
   - Abra o arquivo `scripts/seed-data.js`
   - Substitua `SEU_TOKEN_AQUI` pelo token que você acabou de criar

3. **Instalar Dependências**:
   ```bash
   npm install
   ```

4. **Executar o Script**:
   ```bash
   npm run seed
   ```

5. **Verificar os Dados**:
   - Abra o Sanity Studio (`npm run dev`)
   - Verifique se os serviços, leads e relatório foram criados corretamente

## Notas Importantes

- O script criará 4 serviços, 2 leads e 1 relatório
- O relatório será vinculado ao lead "Maria Silva" e aos serviços "Assistente de Reuniões Comerciais" e "Agente de Qualificação de Leads"
- Se você executar o script múltiplas vezes, haverá duplicação de dados
- Se quiser limpar os dados antes de executar novamente, use o Studio para excluir os documentos criados anteriormente

## Solução de Problemas

Se encontrar erros:

1. **Erro de Permissão**: Verifique se o token tem permissões adequadas
2. **Erro de Schema**: Verifique se os schemas foram adicionados corretamente
3. **Erro de Dependências**: Verifique se as dependências foram instaladas (`@sanity/client` e `uuid`)
