# Configuração Stripe — AtendeZap IA

## Produtos no Stripe

Crie três produtos no Stripe:

- AtendeZap IA Starter
- AtendeZap IA Pro
- AtendeZap IA Premium

## Prices

Crie prices mensais recorrentes:

- Starter mensal -> `STRIPE_PRICE_STARTER`
- Pro mensal -> `STRIPE_PRICE_PRO`
- Premium mensal -> `STRIPE_PRICE_PREMIUM`

Esses IDs ficam apenas no servidor. Não use price ID no client.

## Oferta Pro primeiro mês R$ 29

Estratégia escolhida: cupom Stripe.

O checkout do Pro usa sempre o price mensal normal `STRIPE_PRICE_PRO`. Para cobrar R$ 29 apenas no primeiro mês, crie um cupom no Stripe com `duration=once` e desconto suficiente para a primeira fatura do Pro ficar em R$ 29. Salve o ID em:

```bash
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
```

`STRIPE_PRICE_PRO_FIRST_MONTH_29` fica documentado como compatibilidade para mapear eventos antigos/promocionais para `plan = "pro"` caso esse price apareça em webhooks. O checkout novo não usa esse price como desconto.

## Variáveis

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRICE_PRO_FIRST_MONTH_29=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
NEXT_PUBLIC_APP_URL=
```

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, prices e cupom ficam somente no servidor. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` e `NEXT_PUBLIC_APP_URL` podem ser públicas.

## Webhook

Endpoint:

```text
/api/stripe/webhook
```

Eventos:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

O webhook valida `STRIPE_WEBHOOK_SECRET`, usa raw body, registra idempotência em `stripe_webhook_events` e atualiza `subscriptions`.

## Teste local com Stripe CLI

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o `whsec_...` para `STRIPE_WEBHOOK_SECRET` e reinicie o servidor.

Eventos úteis:

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

Para validar o fluxo completo, prefira iniciar Checkout pelo app, porque a sessão carrega `metadata.user_id`, `metadata.plan` e `client_reference_id`.

## Teste manual

1. Criar usuário.
2. Acessar `/assinatura`.
3. Clicar Starter.
4. Concluir checkout test.
5. Confirmar webhook.
6. Confirmar Supabase em `subscriptions`.
7. Confirmar dashboard e `/assinatura`.
8. Repetir Pro.
9. Repetir Premium.
10. Testar Customer Portal.
11. Testar cancelamento no portal.
12. Testar pagamento falho.

## Resultado esperado no Supabase

- `provider = 'stripe'`
- `stripe_customer_id` preenchido
- `stripe_subscription_id` preenchido após webhook
- `subscription_status = active` ou status real da Stripe
- `status = active`, `trialing`, `past_due`, `canceled` ou equivalente interno
- `plan = starter`, `pro` ou `premium`
- `monthly_limit` conforme plano
- `current_period_start` e `current_period_end` preenchidos quando a Stripe enviar período
