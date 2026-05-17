# Deploy na Vercel

Use este guia para publicar o MVP SaaS do AtendeZap IA em producao.

## Passo a passo

1. Rode a validacao local:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

2. Faca commit e push.
3. Importe o repositorio na Vercel como `Next.js`.
4. Configure as Environment Variables:

```text
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_STARTER
STRIPE_PRICE_PRO
STRIPE_PRICE_PREMIUM
STRIPE_COUPON_PRO_FIRST_MONTH_29
KIWIFY_WEBHOOK_SECRET
NEXT_PUBLIC_KIWIFY_EBOOK_URL
NEXT_PUBLIC_KIWIFY_PRO_ORDER_BUMP_URL
```

5. Faca deploy.
6. Configure Supabase Auth URLs com o dominio da Vercel.
7. Configure webhook Stripe:

```text
https://URL-DA-VERCEL/api/stripe/webhook
```

8. Teste:

```text
/debug/supabase
/cadastro
/login
/dashboard
/plans
/precos
```

## Variaveis de ambiente

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` podem ficar publicas.

`SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` sao somente servidor.

As variaveis `NEXT_PUBLIC_KIWIFY_*` sao URLs publicas do funil de aquisicao.
