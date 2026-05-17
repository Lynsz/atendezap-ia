# Troubleshooting

## O checkout nao abre ou retorna erro

O billing recorrente do SaaS usa Stripe. Confira:

```text
STRIPE_SECRET_KEY
STRIPE_PRICE_STARTER
STRIPE_PRICE_PRO
STRIPE_PRICE_PREMIUM
NEXT_PUBLIC_APP_URL
```

Se o erro acontecer antes de abrir o Checkout, verifique se o usuario esta autenticado e se o plano existe em `src/config/plans.ts`.

## O preco aparece errado

Os precos publicos devem seguir `src/config/plans.ts`:

```text
Starter: R$ 49/mes
Pro: R$ 29 no primeiro mes para novos usuarios; depois R$ 97/mes
Premium: R$ 197/mes
```

Se aparecer qualquer outro valor, atualize a fonte unica em `src/config/plans.ts`.

## Webhook Stripe retorna 400

Confira:

- `STRIPE_WEBHOOK_SECRET`
- header `stripe-signature`
- uso de raw body com `request.text()`
- se o webhook foi criado no mesmo ambiente da chave usada, teste ou producao

## Webhook Kiwify retorna 401

`KIWIFY_WEBHOOK_SECRET` esta configurado, mas o header nao foi enviado ou esta diferente.

Envie um dos headers:

- `x-kiwify-webhook-secret`
- `x-webhook-secret`
- `Authorization: Bearer`

## Evento duplicado

E esperado que webhooks repetidos retornem:

```json
{ "ok": true, "duplicate": true }
```

Isso evita processar o mesmo evento Stripe duas vezes.

## OpenAI falha

Confira `OPENAI_API_KEY`, `OPENAI_MODEL`, saldo/limites da conta e logs da Vercel.

Quando a IA falha, o token nao e marcado como usado. O cliente pode tentar novamente.

## Supabase bloqueia leitura/escrita

O schema habilita RLS e bloqueia acesso publico direto. As operacoes sensiveis devem passar pelas APIs do Next usando `SUPABASE_SERVICE_ROLE_KEY`.
