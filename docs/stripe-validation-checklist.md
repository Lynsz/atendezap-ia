# Checklist de validacao Stripe

Use este checklist para validar o fluxo real de assinatura em Stripe test mode, Supabase e dashboard. Nao coloque chaves reais neste arquivo.

## Teste local

1. Preencher `.env.local` com chaves test da Stripe e variaveis Supabase do ambiente de teste.
2. Confirmar que `.env.local` nao aparece como arquivo rastreado no `git status`.
3. Rodar `npm run stripe:setup-products`.
4. Copiar para `.env.local` os valores gerados de `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_PREMIUM` e `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.
5. Rodar `npm run dev`.
6. Rodar `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
7. Copiar o `STRIPE_WEBHOOK_SECRET` gerado pela Stripe CLI para `.env.local`.
8. Reiniciar `npm run dev`.
9. Criar usuario no app.
10. Acessar `/assinatura`.
11. Assinar Starter.
12. Confirmar `checkout.session.completed` e `customer.subscription.*` no terminal do Stripe CLI.
13. Confirmar no Supabase que `subscriptions` tem `plan = starter`, `subscription_status`, `stripe_customer_id`, `stripe_subscription_id`, `monthly_limit = 150`, periodo atual e `updated_at`.
14. Confirmar que `/assinatura` mostra plano ativo, status, limite mensal, uso mensal e renovacao.
15. Confirmar que `/dashboard` mostra o mesmo plano, status, limite e uso mensal.
16. Repetir o fluxo com Pro.
17. Confirmar que Pro usa `STRIPE_PRICE_PRO` e aplica `STRIPE_PRO_FIRST_MONTH_COUPON_ID` quando configurado.
18. Confirmar que a assinatura Pro continua com `plan = pro` no Supabase.
19. Repetir o fluxo com Premium.
20. Testar o Customer Portal em `/assinatura`.
21. Confirmar que o portal retorna para `/assinatura`.
22. Testar cancelamento no portal ou painel Stripe.
23. Confirmar que `customer.subscription.deleted` marca a assinatura como `canceled`.
24. Testar pagamento falho com um cartao de teste de recusa.
25. Confirmar que `invoice.payment_failed` atualiza `last_payment_status` e status pendente/falho no app.

## Variaveis obrigatorias

```text
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRICE_PRO_FIRST_MONTH_29=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=
```

`OPENAI_API_KEY` pode ficar vazia se o objetivo for validar apenas billing, mas o teste completo do produto deve validar geracao real ou fallback esperado.

## Supabase

Antes de testar, aplique as migrations no ambiente usado pelo `.env.local`, especialmente:

- `supabase/migrations/0003_stripe_billing.sql`
- `supabase/migrations/0007_stripe_subscription_aliases.sql`

A tabela `subscriptions` deve conter:

- `user_id`
- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_status`
- `plan`
- `current_period_start`
- `current_period_end`
- `monthly_limit`
- `usage_count`
- `updated_at`

## Cartoes de teste

Consulte os cartoes de teste na documentacao oficial da Stripe ou no painel Stripe em test mode. Nao coloque dados reais de cartao, chaves reais ou dados sensiveis em arquivos versionados.

## Criterios de aceite

- Checkout sem login retorna 401.
- Plano invalido retorna 400.
- Starter usa `STRIPE_PRICE_STARTER`.
- Pro usa `STRIPE_PRICE_PRO`.
- Premium usa `STRIPE_PRICE_PREMIUM`.
- Cupom Pro so aplica no Pro.
- Webhook rejeita assinatura invalida.
- Webhook nao depende de usuario logado.
- Webhook nao e bloqueado pelo middleware.
- `/assinatura` e `/dashboard` refletem o Supabase apos webhook.
- Portal Stripe abre somente para usuario com `stripe_customer_id`.
- Cancelamento e pagamento falho aparecem com status amigavel.
