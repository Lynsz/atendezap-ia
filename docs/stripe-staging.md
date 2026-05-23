# Stripe staging

Use sempre Stripe test mode no ambiente staging. Nao misture `sk_live_`, prices live ou webhook live com a URL de staging.

## Produtos e prices

1. Abra o Stripe Dashboard em test mode.
2. Crie produto Starter.
3. Crie um price mensal recorrente para Starter e copie o ID para `STRIPE_PRICE_STARTER`.
4. Crie produto Pro.
5. Crie um price mensal recorrente normal para Pro e copie para `STRIPE_PRICE_PRO`.
6. Crie produto Premium.
7. Crie um price mensal recorrente para Premium e copie para `STRIPE_PRICE_PREMIUM`.
8. Para o Pro por R$ 29 no primeiro mes, crie um coupon com `duration=once` que ajusta somente a primeira fatura e copie para `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.
9. Se existir um price promocional legado para o Pro, copie para `STRIPE_PRICE_PRO_FIRST_MONTH_29` para compatibilidade de webhook.

## Variaveis na Vercel staging

```text
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRICE_PRO_FIRST_MONTH_29=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
```

## Webhook staging

1. No Stripe Dashboard, crie endpoint de webhook em test mode.
2. URL:

```text
https://SEU-STAGING.vercel.app/api/stripe/webhook
```

3. Selecione os eventos obrigatorios:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copie o signing secret `whsec_...`.
5. Configure `STRIPE_WEBHOOK_SECRET` no ambiente staging da Vercel.
6. Rode novo deploy.

## Teste de pagamento

1. Crie/login com usuario descartavel no staging.
2. Acesse `/precos`, `/dashboard` ou `/assinatura`.
3. Inicie checkout Starter, Pro e Premium em testes separados.
4. Use cartao de teste aprovado da Stripe.
5. Confirme retorno para `/assinatura?checkout=success`.
6. Confira `subscriptions` no Supabase:
   - `provider = stripe`
   - `plan = starter`, `pro` ou `premium`
   - `status = active`
   - `provider_customer_id` preenchido
   - `provider_subscription_id` preenchido apos webhook
   - `monthly_limit` conforme plano

## Teste de cancelamento

1. Abra o Customer Portal pelo app.
2. Cancele assinatura teste.
3. Confirme evento `customer.subscription.updated` ou `customer.subscription.deleted`.
4. Confirme status cancelado ou cancelamento agendado no Supabase e no dashboard.

## Teste de pagamento falho

1. Use um cartao de teste de falha da Stripe.
2. Confirme evento `invoice.payment_failed`.
3. Confirme `last_payment_status = failed` ou status interno equivalente.
4. Confirme que dados do usuario nao sao apagados.

## Cuidados

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, prices e coupon ficam somente no servidor.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` deve ser do mesmo modo da secret key.
- O checkout usa `NEXT_PUBLIC_APP_URL` para `success_url` e `cancel_url`.
- O portal usa `NEXT_PUBLIC_APP_URL` para `return_url`.
- Eventos gerados por `stripe trigger` podem nao ter `metadata.user_id`; prefira validar com checkout criado pelo app.
