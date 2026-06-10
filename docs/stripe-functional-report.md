# Stripe e Assinatura Funcional — AtendeZap IA

## Status
- funcional

## Rotas implementadas/corrigidas
- `POST /api/stripe/create-checkout-session`
- `POST /api/stripe/create-portal-session`
- `POST /api/stripe/webhook`

## Planos
- Free: 20 respostas/mês, sem Stripe.
- Starter: 100 respostas/mês, `STRIPE_PRICE_STARTER`.
- Pro: 500 respostas/mês, `STRIPE_PRICE_PRO`, recomendado, primeiro mês por R$ 29 via cupom.
- Premium: 1.500 respostas/mês, `STRIPE_PRICE_PREMIUM`.

## Webhook
- Valida `STRIPE_WEBHOOK_SECRET`.
- Processa checkout, subscription created/updated/deleted e invoices pagas/falhas.
- Atualiza `subscriptions` com usuário, customer, subscription, plano, status, período e limite.
- Registra somente metadados mínimos do evento.

## Limite mensal
- Sem assinatura: free.
- `active`, `trial` ou `trialing`: limite do plano.
- `past_due`, `canceled`, `unpaid`, `incomplete` e similares: limite free.
- A rota de IA bloqueia antes da OpenAI quando o limite efetivo acaba.

## Como testar localmente
- Configurar Supabase, OpenAI e variáveis Stripe de teste.
- Abrir `/assinatura` logado.
- Clicar em um plano pago e concluir checkout no Stripe test mode.
- Enviar webhook Stripe para `/api/stripe/webhook`.
- Confirmar plano/uso em `/assinatura` e no dashboard.

## Variáveis necessárias
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_PREMIUM`
- `STRIPE_PRO_FIRST_MONTH_COUPON_ID` opcional

## Pendências
- Smoke test completo em staging com Stripe CLI e cartões de teste.
