# Release Notes MVP

## O que foi preparado nesta rodada

- Planos Starter, Pro e Premium centralizados em `src/config/plans.ts`.
- Billing recorrente preparado para Asaas, com Kiwify reposicionada para aquisicao.
- Webhooks Kiwify/Asaas com responsabilidades separadas: funil e assinatura.
- Criacao ou atualizacao de customer por e-mail no fluxo do Asaas.
- Geracao de kit com eventos de sucesso/falha e preservacao do token quando a IA falha.
- Registro de eventos para suporte e download de PDF.
- Schema Supabase com RLS habilitado e acesso publico direto revogado.
- Documentacao operacional para Asaas, Kiwify, Supabase, Vercel, testes manuais e troubleshooting.

## Como configurar producao

1. Rodar `supabase/schema.sql` no Supabase.
2. Configurar variaveis na Vercel.
3. Configurar Asaas e webhook `/api/asaas/webhook`.
4. Configurar Kiwify apenas para ebook/order bump e webhook de aquisicao.
5. Verificar dominio do Resend.
6. Definir `NEXT_PUBLIC_APP_URL` com o dominio final.

## Como testar

1. Rodar `npm run lint`.
2. Rodar `npm run typecheck`.
3. Rodar `npm run test`.
4. Rodar `npm run build`.
5. Seguir `docs/smoke-test.md`.
6. Conferir eventos nas tabelas `asaas_webhook_events` e `events`.

## Limitacoes restantes

- Sem integracao direta com WhatsApp API.
- Sem painel administrativo.
- Sem Supabase Storage para PDFs.
- Rate limit em memoria nao e compartilhado entre instancias serverless.
- Conteudo gerado por IA deve ser revisado pelo usuario.
- Captura de CPF/CNPJ no checkout Asaas ainda deve ser refinada na interface.

## Proximos passos recomendados

- Concluir captura de CPF/CNPJ no checkout Asaas quando necessario para criar novo customer.
- Criar painel minimo de pedidos e kits.
- Salvar PDFs em Supabase Storage se houver necessidade de auditoria/arquivo.
- Melhorar observabilidade com alertas externos.
