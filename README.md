# AtendeZap IA

MVP SaaS para pessoas autonomas, prestadores de servico, pequenos negocios e qualquer pessoa que usa WhatsApp para atender, vender ou responder clientes.

O produto permite criar conta, cadastrar negocio, servico ou atividade, gerar respostas com IA, salvar historico no Supabase, organizar clientes/leads e vender planos mensais com Stripe Billing.

## Status Comercial

Funil principal:

```text
Ebook gratuito -> pagina de obrigado -> oferta Pro -> Stripe Checkout -> dashboard
```

Oferta permanente do Plano Pro:

```text
Plano Pro por R$ 29 no primeiro mes. Depois, R$ 97/mes.
```

Essa oferta vale para novos usuarios, nao e temporaria e nao usa urgencia artificial.

Stripe e o billing principal do SaaS. Kiwify fica apenas como canal opcional de aquisicao para ebook, captura de lead, order bump e redirecionamento.

## Stack

- Next.js com App Router
- React e TypeScript
- Tailwind CSS
- Supabase Auth e Database
- Stripe Billing, Stripe Checkout, Stripe Webhooks e Customer Portal
- OpenAI SDK em rota server-side
- Resend para e-mails do fluxo de kit
- `@react-pdf/renderer`
- Vitest
- Deploy compativel com Vercel

## Rotas Principais

- `/`: landing page.
- `/ebook`: captura do guia gratuito.
- `/ebook/obrigado`: pagina de obrigado e oferta do Pro.
- `/precos` e `/plans`: pagina de planos.
- `/cadastro` e `/login`: autenticacao.
- `/dashboard`: area logada do SaaS.
- `/api/stripe/create-checkout-session`: inicia Stripe Checkout.
- `/api/stripe/create-portal-session`: abre Customer Portal.
- `/api/stripe/webhook`: atualiza assinaturas no Supabase.
- `/api/kiwify/webhook`: registra aquisicao/funil.

## Planos

Fonte unica: `src/config/plans.ts`.

- Starter: R$ 49/mes, 150 respostas com IA por mes.
- Pro: R$ 29 no primeiro mes para novos usuarios, depois R$ 97/mes, 600 respostas com IA por mes.
- Premium: R$ 197/mes, 2.000 respostas com IA por mes.

O Pro e o plano recomendado.

## Variaveis De Ambiente

Copie `.env.example` para `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_COUPON_PRO_FIRST_MONTH_29=

NEXT_PUBLIC_KIWIFY_EBOOK_URL=
NEXT_PUBLIC_KIWIFY_PRO_ORDER_BUMP_URL=
NEXT_PUBLIC_KIWIFY_STARTER_URL=
NEXT_PUBLIC_KIWIFY_PREMIUM_URL=
KIWIFY_WEBHOOK_SECRET=

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
RESEND_API_KEY=
EMAIL_FROM=
SUPPORT_EMAIL=
```

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY` e `KIWIFY_WEBHOOK_SECRET` sao somente servidor.

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` e `NEXT_PUBLIC_KIWIFY_*` podem ser publicas.

## Supabase

Schema principal:

```text
supabase/schema.sql
```

Migrations:

```text
supabase/migrations/0001_initial_schema.sql
supabase/migrations/0002_funnel_pricing_ebook.sql
supabase/migrations/0003_stripe_billing.sql
```

`subscriptions` e a fonte final de verdade para plano, status, limite mensal, periodo e provider. O client pode ler a propria assinatura, mas atualizacoes de plano/status devem vir de backend seguro ou webhook validado.

## Stripe

Configure no Dashboard da Stripe:

1. Produtos Starter, Pro e Premium.
2. Prices mensais:
   - Starter: R$ 49
   - Pro: R$ 97
   - Premium: R$ 197
3. Cupom do primeiro mes do Pro com `duration=once`, reduzindo a primeira fatura para R$ 29.
4. Customer Portal.
5. Webhook para `/api/stripe/webhook`.

Eventos usados:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Kiwify

Kiwify nao e billing principal do SaaS. Use apenas para:

- ebook gratuito ou baixo ticket;
- captura de lead;
- order bump;
- upsell/cross-sell apontando para `/precos`;
- registro de `acquisition_source = "kiwify"` e `funnel_source = "ebook"`.

## Desenvolvimento

```bash
npm install
npm run dev
```

Antes de finalizar qualquer alteracao:

```bash
npm run lint
npm run typecheck
npm run build
```

Quando a mudanca tocar webhook, checkout, assinatura, plano, limite ou IA:

```bash
npm run test
```

## Testar Stripe Localmente

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o `whsec_...` para `STRIPE_WEBHOOK_SECRET`, rode `npm run dev`, crie/login de usuario, abra `/precos`, escolha um plano e pague em modo teste.

Confirme no Supabase:

- `subscriptions.provider = 'stripe'`
- `subscriptions.provider_customer_id` preenchido
- `subscriptions.provider_subscription_id` preenchido
- `subscriptions.status = 'active'`
- `subscriptions.monthly_limit` conforme plano

## Documentacao

- `docs/billing.md`: arquitetura Kiwify + Stripe.
- `docs/kiwify-setup.md`: funil de aquisicao.
- `docs/smoke-test.md`: checklist manual.
- `docs/troubleshooting.md`: erros comuns.
