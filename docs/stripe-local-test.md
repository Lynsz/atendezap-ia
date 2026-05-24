# Stripe local test mode

Use este roteiro para validar produtos, prices, cupom do Pro, checkout, webhook e sincronizacao da assinatura no Supabase usando Stripe test mode.

## 1. Configurar .env.local

Copie `.env.example` para `.env.local` e preencha os valores reais apenas localmente:

```bash
cp .env.example .env.local
```

Exemplo sem valores reais:

```text
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_STARTER_AMOUNT_CENTS=
STRIPE_PRO_AMOUNT_CENTS=
STRIPE_PREMIUM_AMOUNT_CENTS=
STRIPE_PRO_FIRST_MONTH_AMOUNT_CENTS=2900
STRIPE_CURRENCY=brl
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Valores padrao esperados em centavos:

- Starter: `4900`
- Pro: `9700`
- Premium: `19700`
- Pro primeiro mes: `2900`

Nunca commite `.env.local`.

## 2. Rodar script de produtos

O projeto usa o script Node atual, sem `tsx`:

```bash
npm run stripe:setup-products
```

O script usa `STRIPE_SECRET_KEY`, carrega `.env` e `.env.local`, cria ou reutiliza produtos/precos/cupom por metadata e nao imprime a chave secreta.

Produtos esperados:

- AtendeZap IA Starter
- AtendeZap IA Pro
- AtendeZap IA Premium

Prices esperados:

- `STRIPE_PRICE_STARTER`: price mensal recorrente do Starter
- `STRIPE_PRICE_PRO`: price mensal recorrente normal do Pro
- `STRIPE_PRICE_PREMIUM`: price mensal recorrente do Premium

Cupom esperado:

- `STRIPE_PRO_FIRST_MONTH_COUPON_ID`: cupom `duration=once` para deixar o primeiro mes do Pro por R$ 29

O script evita duplicacao quando encontra produtos, prices e cupom com metadata compativel. Se alterar valores de planos, revise o painel da Stripe antes de rodar de novo para nao criar configuracoes paralelas sem necessidade.

## 3. Copiar IDs gerados

Copie a saida para `.env.local`:

```text
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
```

`STRIPE_PRICE_PRO_FIRST_MONTH_29` e apenas compatibilidade para price promocional antigo. O checkout novo usa `STRIPE_PRICE_PRO` e aplica `STRIPE_PRO_FIRST_MONTH_COUPON_ID` quando o plano e `pro`.

## 4. Rodar webhook local

Em um terminal com Stripe CLI autenticado:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o `whsec_...` exibido pela CLI para:

```text
STRIPE_WEBHOOK_SECRET=
```

Reinicie o `npm run dev` depois de alterar `.env.local`.

## 5. Testar checkout

1. Rode o app:

```bash
npm run dev
```

2. Crie uma conta ou faca login.
3. Acesse `/assinatura`.
4. Assine Starter e confirme que o checkout usa `STRIPE_PRICE_STARTER`.
5. Assine Pro e confirme que o checkout usa `STRIPE_PRICE_PRO` com o cupom `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.
6. Assine Premium e confirme que o checkout usa `STRIPE_PRICE_PREMIUM`.
7. Use cartoes de teste da Stripe.
8. Confirme no terminal do Stripe CLI que chegaram eventos como:

```text
checkout.session.completed
customer.subscription.created
customer.subscription.updated
invoice.payment_succeeded
```

## 6. Confirmar Supabase e telas

No Supabase, confira a linha do usuario em `subscriptions`:

- `user_id`
- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_status`
- `plan`
- `current_period_start`
- `current_period_end`
- `monthly_limit`
- `updated_at`

Depois confira no app:

- `/assinatura` mostra plano ativo, status, limite mensal, uso mensal e botao do portal Stripe.
- `/dashboard` mostra plano, status, limite mensal e uso mensal vindos do Supabase.
- O portal Stripe abre pela rota server-side e retorna para `/assinatura`.

## 7. Cancelamento e falhas

Para validar cancelamento, cancele pelo portal Stripe ou painel em test mode e confira o webhook `customer.subscription.deleted`. A assinatura deve ficar com status `canceled`.

Para validar falha de pagamento, use os cartoes de teste da Stripe que simulam recusas e confira `invoice.payment_failed`.

## 8. Pendencias externas

Dependem do painel/CLI da Stripe:

- Conta Stripe em test mode.
- Stripe CLI autenticado para webhook local.
- Customer Portal configurado no painel se o portal exigir ativacao.
- Produtos/prices/cupom conferidos no painel antes de usar em preview/producao.
