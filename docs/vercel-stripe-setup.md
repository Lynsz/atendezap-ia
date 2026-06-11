# Setup Stripe na Vercel

Use Stripe em modo teste antes de producao.

## Variaveis

Configure na Vercel:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
```

`STRIPE_PRO_FIRST_MONTH_COUPON_ID` e opcional, usado apenas para a oferta do primeiro mes do Pro.

## Checkout e portal

- Criar produtos e prices recorrentes mensais para Starter, Pro e Premium.
- Garantir que `STRIPE_PRICE_PRO` aponta para o price recorrente normal.
- Configurar o Customer Portal no painel Stripe.
- Validar checkout autenticado em Preview antes de Production.

## Webhook

Endpoint:

```text
https://SEU_DOMINIO/api/stripe/webhook
```

Eventos minimos:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Copie o signing secret do endpoint para `STRIPE_WEBHOOK_SECRET`.
