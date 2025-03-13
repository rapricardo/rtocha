# Como Configurar o Token do Sanity

Este documento fornece instruções detalhadas para configurar corretamente o token do Sanity para este projeto.

## Passo 1: Obter o Token

1. Acesse [Sanity Manage](https://www.sanity.io/manage)
2. Selecione o projeto **rtocha**
3. No menu lateral, clique em **API**
4. Vá para a seção **Tokens**
5. Clique em **Add API token**
6. Dê um nome como "Website Integration"
7. **IMPORTANTE**: Selecione permissões **Editor** (ou pelo menos "Viewer" + "Write" + "Publishing rights")
8. Clique em **Create** para gerar o token
9. Copie o token gerado (você não poderá vê-lo novamente)

## Passo 2: Configurar o Token no Projeto

### Opção A: Usando .env.local (Recomendado)

1. Crie ou edite o arquivo `.env.local` na raiz do projeto
2. Adicione a seguinte linha:
   ```
   SANITY_API_TOKEN=seu_token_aqui
   ```
3. Substitua `seu_token_aqui` pelo token que você acabou de copiar
4. Salve o arquivo
5. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Opção B: Configuração Temporária para Testes

Como alternativa temporária, você pode editar o arquivo `src/lib/sanity/client.ts` e adicionar o token diretamente:

```typescript
// IMPORTANTE: Use apenas para desenvolvimento e teste
const TEMP_TOKEN = 'seu_token_aqui';
```

## Passo 3: Verificar a Configuração

1. Acesse [http://localhost:3001/api/test-env](http://localhost:3001/api/test-env)
2. Verifique se `hasToken` é `true`
3. Acesse [http://localhost:3001/api/test-write-lead](http://localhost:3001/api/test-write-lead)
4. Se funcionar, verá uma mensagem de sucesso

## Dicas de Solução de Problemas

- Certifique-se de que o arquivo `.env.local` esteja na raiz do projeto
- Verifique se não há espaços antes ou depois do token
- Garanta que o token tenha permissões suficientes no Sanity
- Reinicie o servidor sempre que alterar variáveis de ambiente