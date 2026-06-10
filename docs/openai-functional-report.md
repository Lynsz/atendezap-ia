# IA Funcional — AtendeZap IA

## Status
- funcional

## Rota de geração
- `POST /api/ai/generate-response`

## Contexto usado
- Sessão autenticada do Supabase.
- `user_profiles`: `business_name`, `business_type`, `tone`, `description`.
- `businesses`, quando um negócio salvo do usuário é informado.
- Fallbacks seguros para campos vazios.

## Limite de uso
- Tabela `ai_usage`, mês em `YYYY-MM`.
- Registro mensal criado quando não existe.
- Limite padrão conforme plano/free.
- Uso checado antes da OpenAI e incrementado somente após geração e salvamento com sucesso.

## Erros tratados
- Usuário deslogado.
- Pergunta vazia ou longa demais.
- Onboarding ausente.
- Assinatura inativa.
- Limite mensal atingido.
- `OPENAI_API_KEY` ausente.
- Falha temporária da OpenAI.

## Segurança
- OpenAI chamada apenas no servidor.
- `OPENAI_API_KEY` lida apenas de `process.env`.
- `user_id` vem da sessão, nunca do client.
- Logs não registram pergunta completa, resposta completa, tokens ou secrets.
- O produto não envia mensagens automaticamente e não integra com WhatsApp.

## Como testar
- Configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e `OPENAI_API_KEY`.
- Entrar no dashboard com usuário autenticado e onboarding concluído.
- Digitar uma mensagem no assistente, gerar resposta, copiar e salvar na biblioteca.
- Rodar `npm run lint`, `npm run typecheck`, `npm run build` e `npm run test`.

## Pendências
- Validar em staging com dados reais do Supabase e chave OpenAI do ambiente.
