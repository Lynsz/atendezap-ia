# Release Notes MVP

## O que foi preparado nesta rodada

- Planos Starter, Pro e Premium centralizados em `src/config/plans.ts`.
- Billing recorrente preparado para Stripe Checkout, Stripe Billing, Customer Portal e webhooks.
- Kiwify reposicionada para aquisicao, ebook, order bump e origem do lead.
- Webhooks Kiwify/Stripe com responsabilidades separadas: funil e assinatura.
- Schema Supabase com RLS habilitado e acesso publico direto revogado.
- Documentacao operacional para Stripe, Kiwify, Supabase, Vercel, testes manuais e troubleshooting.

## Como configurar producao

1. Rodar `supabase/schema.sql` ou as migrations no Supabase.
2. Configurar variaveis na Vercel.
3. Criar produtos, prices, cupom e Customer Portal na Stripe.
4. Configurar webhook Stripe em `/api/stripe/webhook`.
5. Configurar Kiwify apenas para ebook/order bump e webhook de aquisicao.
6. Definir `NEXT_PUBLIC_APP_URL` com o dominio final.

## Como testar

1. Rodar `npm run lint`.
2. Rodar `npm run typecheck`.
3. Rodar `npm run test`.
4. Rodar `npm run build`.
5. Seguir `docs/smoke-test.md`.
6. Conferir eventos nas tabelas `stripe_webhook_events` e `events`.
