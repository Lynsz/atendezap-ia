# Teste Stripe em modo test

Este guia valida checkout, webhook, assinatura no Supabase e reflexo no dashboard/billing.

## Variaveis necessarias

No `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_PRICE_PRO_FIRST_MONTH_29=price_...
STRIPE_PRO_FIRST_MONTH_COUPON_ID=coupon_...
```

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, prices e cupom ficam somente no servidor. `STRIPE_PRICE_PRO_FIRST_MONTH_29` tambem e aceito pelo webhook como price do plano Pro para compatibilidade.

## Criar produtos e prices

No Stripe Dashboard em modo test:

- Produto Starter com price mensal recorrente e ID em `STRIPE_PRICE_STARTER`.
- Produto Pro com price mensal recorrente e ID em `STRIPE_PRICE_PRO`.
- Produto Premium com price mensal recorrente e ID em `STRIPE_PRICE_PREMIUM`.
- Para o primeiro mes do Pro por R$ 29, use um coupon com `duration=once` e ID em `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.

O checkout usa o price recorrente normal do Pro e aplica o coupon uma vez. Assim o segundo mes volta automaticamente para o valor normal.

## Rodar localmente

```bash
npm run dev
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o `whsec_...` exibido pelo Stripe CLI para `STRIPE_WEBHOOK_SECRET` e reinicie o servidor local.

## Testar checkout

1. Crie/login com um usuario no app local.
2. Acesse `/precos`, `/dashboard` ou `/assinatura`.
3. Clique em assinar/trocar plano.
4. Complete o pagamento com cartao test da Stripe.
5. Volte para `/assinatura?checkout=success`.
6. Confira no Supabase a linha em `subscriptions`:
   - `provider = stripe`
   - `provider_customer_id` e `stripe_customer_id` preenchidos
   - `provider_subscription_id` e `stripe_subscription_id` preenchidos apos o webhook
   - `status = active`
   - `subscription_status = active`
   - `plan = starter`, `pro` ou `premium`
   - `monthly_limit` conforme o plano

## Testar eventos de webhook

Com o listener ativo:

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

Eventos gerados por `stripe trigger` podem não carregar o mesmo `metadata.user_id` de um checkout real do app. Para validar atualização completa da assinatura, priorize completar um checkout real em modo test.

## Cancelamento e falha de pagamento

- Cancele a assinatura pelo Customer Portal aberto em `/assinatura`.
- Confirme que o webhook `customer.subscription.updated` ou `customer.subscription.deleted` atualiza `status`, `subscription_status`, `cancel_at_period_end` e periodos.
- Para falha de pagamento, use os cartoes de teste da Stripe e confirme `invoice.payment_failed`, `last_payment_status = failed` e assinatura sem exclusao de dados.

## Checklist rapido

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
- Checkout cria sessão autenticada.
- Webhook rejeita assinatura invalida.
- Webhook atualiza `subscriptions`.
- Dashboard e `/assinatura` leem o plano real do Supabase.
