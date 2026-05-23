# Configuracao Stripe - AtendeZap IA

## Produtos no Stripe

Crie tres produtos no Stripe:

- AtendeZap IA Starter
- AtendeZap IA Pro
- AtendeZap IA Premium

## Criacao via script

Preferencia para test mode:

```bash
npm run stripe:setup-products
```

Antes de rodar, configure `STRIPE_SECRET_KEY` no ambiente local e ajuste os valores se necessario:

```bash
STRIPE_STARTER_AMOUNT_CENTS=
STRIPE_PRO_AMOUNT_CENTS=
STRIPE_PREMIUM_AMOUNT_CENTS=
STRIPE_PRO_FIRST_MONTH_AMOUNT_CENTS=
STRIPE_CURRENCY=brl
```

O script cria ou reutiliza produtos e prices mensais recorrentes e imprime:

```bash
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
```

Copie os IDs para `.env.local` e para a Vercel. O script nao imprime `STRIPE_SECRET_KEY`.

## Prices

Crie prices mensais recorrentes:

- Starter mensal -> `STRIPE_PRICE_STARTER`
- Pro mensal -> `STRIPE_PRICE_PRO`
- Premium mensal -> `STRIPE_PRICE_PREMIUM`

Esses IDs ficam apenas no servidor. Nao use price ID no client.

## Oferta Pro primeiro mes R$ 29

Estrategia escolhida: cupom Stripe.

O checkout do Pro usa sempre o price mensal normal `STRIPE_PRICE_PRO`. Para cobrar R$ 29 apenas no primeiro mes, crie um cupom no Stripe com `duration=once` e desconto suficiente para a primeira fatura do Pro ficar em R$ 29. Salve o ID em:

```bash
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
```

Se o cupom nao estiver configurado, o checkout do Pro continua funcionando sem desconto e sem marcar a oferta como aplicada.

`STRIPE_PRICE_PRO_FIRST_MONTH_29` fica documentado como compatibilidade para mapear eventos antigos/promocionais para `plan = "pro"` caso esse price apareca em webhooks. O checkout novo nao usa esse price como desconto.

## Criacao manual no painel Stripe

1. Entrar no Stripe Dashboard.
2. Ativar modo test.
3. Criar produto `AtendeZap IA Starter`.
4. Criar price mensal recorrente em BRL.
5. Copiar price ID para `STRIPE_PRICE_STARTER`.
6. Criar produto `AtendeZap IA Pro`.
7. Criar price mensal recorrente em BRL.
8. Copiar price ID para `STRIPE_PRICE_PRO`.
9. Criar produto `AtendeZap IA Premium`.
10. Criar price mensal recorrente em BRL.
11. Copiar price ID para `STRIPE_PRICE_PREMIUM`.
12. Criar cupom para o Pro primeiro mes por R$ 29.
13. Usar desconto fixo em BRL com `duration=once`.
14. Copiar coupon ID para `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.
15. Configurar webhook.
16. Testar checkout em modo test.

## Variaveis

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRICE_PRO_FIRST_MONTH_29=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
STRIPE_STARTER_AMOUNT_CENTS=
STRIPE_PRO_AMOUNT_CENTS=
STRIPE_PREMIUM_AMOUNT_CENTS=
STRIPE_PRO_FIRST_MONTH_AMOUNT_CENTS=
STRIPE_CURRENCY=brl
NEXT_PUBLIC_APP_URL=
```

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, prices e cupom ficam somente no servidor. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` e `NEXT_PUBLIC_APP_URL` podem ser publicas.

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

O webhook valida `STRIPE_WEBHOOK_SECRET`, usa raw body, registra idempotencia em `stripe_webhook_events` e atualiza `subscriptions`.

## Teste local com Stripe CLI

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o `whsec_...` para `STRIPE_WEBHOOK_SECRET` e reinicie o servidor.

Eventos uteis:

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

Para validar o fluxo completo, prefira iniciar Checkout pelo app, porque a sessao carrega `metadata.user_id`, `metadata.plan` e `client_reference_id`.

## Teste manual

1. Criar usuario.
2. Acessar `/assinatura`.
3. Clicar Starter.
4. Concluir checkout test.
5. Confirmar webhook.
6. Confirmar Supabase em `subscriptions`.
7. Confirmar dashboard e `/assinatura`.
8. Repetir Pro com cupom configurado.
9. Repetir Premium.
10. Testar Customer Portal.
11. Testar cancelamento no portal.
12. Testar pagamento falho.

## Resultado esperado no Supabase

- `provider = 'stripe'`
- `stripe_customer_id` preenchido
- `stripe_subscription_id` preenchido apos webhook
- `subscription_status = active` ou status real da Stripe
- `status = active`, `trialing`, `past_due`, `canceled` ou equivalente interno
- `plan = starter`, `pro` ou `premium`
- `monthly_limit` conforme plano
- `current_period_start` e `current_period_end` preenchidos quando a Stripe enviar periodo
