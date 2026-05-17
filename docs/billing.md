# Billing: Kiwify + Stripe

## Estrategia

- Stripe: billing principal do SaaS, Stripe Checkout, assinatura mensal, Customer Portal e webhooks.
- Supabase: fonte final de verdade para plano, status, limite e acesso ao dashboard.
- Kiwify: funil opcional de aquisicao, ebook, baixo ticket, order bump e origem do lead.

O dashboard nao consulta Stripe nem Kiwify diretamente no front-end.

```text
Pagamento confirmado na Stripe
-> /api/stripe/webhook
-> subscriptions no Supabase
-> dashboard le Supabase
-> plano, limite e acesso sao liberados
```

## Planos

Fonte unica no codigo: `src/config/plans.ts`.

- Starter: R$ 49/mes, 150 respostas com IA por mes.
- Pro: R$ 29 no primeiro mes para novos usuarios, depois R$ 97/mes, 600 respostas com IA por mes.
- Premium: R$ 197/mes, 2.000 respostas com IA por mes.

A oferta do Pro e permanente para novos usuarios. Nao depende de lancamento, vagas ou prazo temporario.

## Oferta do primeiro mes do Pro

O preco normal do Pro fica na Stripe como um Price recorrente mensal de R$ 97.

Para o primeiro mes por R$ 29, crie na Stripe um cupom com `duration=once`. Esse cupom deve reduzir a primeira fatura do Plano Pro para R$ 29. A partir do segundo mes, a Stripe cobra automaticamente o valor normal do Price mensal.

O backend aplica o cupom apenas quando:

- `planId = "pro"`;
- a conta ainda nao tem `first_month_offer_used_at`;
- a conta ainda nao tem `first_month_price_applied`.

## Variaveis

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_COUPON_PRO_FIRST_MONTH_29=

KIWIFY_WEBHOOK_SECRET=
NEXT_PUBLIC_KIWIFY_EBOOK_URL=
NEXT_PUBLIC_KIWIFY_PRO_ORDER_BUMP_URL=
```

`STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` sao somente servidor. Nunca use prefixo `NEXT_PUBLIC_` nessas chaves.

O codigo tambem aceita os aliases antigos `STRIPE_PRICE_*_MONTHLY` e `STRIPE_COUPON_PRO_FIRST_MONTH`. Se voce preferir o nome sugerido `STRIPE_PRICE_PRO_FIRST_MONTH_29`, ele sera tratado como o ID do cupom de primeiro mes.

## Stripe

### Configuracao manual

1. Criar produtos no Dashboard da Stripe:
   - AtendeZap IA Starter
   - AtendeZap IA Pro
   - AtendeZap IA Premium
2. Criar Prices mensais recorrentes:
   - Starter: R$ 49/mes
   - Pro: R$ 97/mes
   - Premium: R$ 197/mes
3. Copiar os IDs para:
   - `STRIPE_PRICE_STARTER`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_PREMIUM`
4. Criar cupom do Pro:
   - duration: once
   - desconto suficiente para a primeira fatura do Pro virar R$ 29
   - salvar em `STRIPE_COUPON_PRO_FIRST_MONTH_29`
5. Ativar Customer Portal no Dashboard da Stripe.
6. Configurar webhook apontando para:

```text
https://SEU-DOMINIO/api/stripe/webhook
```

Eventos minimos:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Rotas

- `POST /api/stripe/create-checkout-session`: cria Customer quando necessario e inicia Stripe Checkout em `mode="subscription"`.
- `POST /api/stripe/create-portal-session`: cria sessao do Customer Portal para usuario autenticado.
- `POST /api/stripe/webhook`: valida assinatura, registra idempotencia e atualiza `subscriptions`.
- `POST /api/kiwify/webhook`: registra aquisicao/funil, sem liberar assinatura recorrente.

Se as variaveis da Stripe estiverem vazias, o build continua funcionando. O erro aparece apenas ao iniciar pagamento ou validar webhook.

## Supabase

Migration segura:

```text
supabase/migrations/0003_stripe_billing.sql
```

Ela adiciona campos em `subscriptions` sem apagar dados:

- `provider`
- `provider_customer_id`
- `provider_subscription_id`
- `provider_price_id`
- `provider_payment_id`
- `stripe_checkout_session_id`
- `stripe_event_id`
- `cancel_at_period_end`
- `first_month_price_applied`
- `promo_code`
- `acquisition_source`
- `funnel_source`
- `last_payment_status`
- `metadata`

Tambem cria `stripe_webhook_events` com `provider_event_id` unico para idempotencia.

## Teste local

1. Rodar a migration no Supabase.
2. Preencher `.env.local` com Stripe test mode.
3. Rodar `npm run dev`.
4. Criar/login de usuario.
5. Acessar `/precos`.
6. Clicar em um plano.
7. Confirmar redirecionamento para Stripe Checkout.
8. Pagar com cartao de teste da Stripe.
9. Confirmar no Supabase:
   - `subscriptions.provider = 'stripe'`
   - `subscriptions.provider_customer_id` preenchido
   - `subscriptions.provider_subscription_id` preenchido
   - `subscriptions.status = 'active'`
   - `subscriptions.monthly_limit` conforme plano

## Teste de webhook com Stripe CLI

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o `whsec_...` retornado para `STRIPE_WEBHOOK_SECRET`.

Depois, use Checkout real em modo teste ou dispare eventos:

```bash
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

Para validar o fluxo completo, prefira pagar uma Checkout Session criada pelo app, porque ela carrega `metadata.user_id` e `metadata.plan_id`.

## Kiwify

Mantenha Kiwify para:

- ebook gratuito ou baixo ticket;
- captura de lead;
- order bump;
- upsell/cross-sell para `/precos`;
- origem do funil.

Nao use Kiwify como fonte principal da assinatura recorrente do SaaS. A assinatura oficial usa `provider = "stripe"`.
