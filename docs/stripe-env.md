# Variaveis de ambiente Stripe

Este projeto deve receber chaves Stripe apenas por variaveis de ambiente. Nao coloque chaves reais no codigo, em documentacao versionada, no GitHub, em prompts publicos, issues ou logs.

## Localmente

1. Crie um arquivo `.env.local` na raiz do projeto.
2. Adicione a chave publicavel:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

3. Adicione a chave secreta somente para uso server-side:

```bash
STRIPE_SECRET_KEY=
```

4. Adicione a chave restrita apenas se o projeto passar a usar uma chave restrita no servidor:

```bash
STRIPE_RESTRICTED_KEY=
```

Hoje o fluxo principal usa `STRIPE_SECRET_KEY` em rotas server-side/API. `STRIPE_RESTRICTED_KEY` esta documentada para uso futuro ou configuracoes mais restritas, mas nao deve ser adicionada ao client.

5. Adicione o webhook secret depois de configurar Stripe CLI ou endpoint real:

```bash
STRIPE_WEBHOOK_SECRET=
```

6. Configure os prices e o cupom do Pro:

```bash
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRICE_PRO_FIRST_MONTH_29=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
```

7. Configure a URL publica usada nos redirects:

```bash
NEXT_PUBLIC_APP_URL=
```

Nunca envie `.env.local` para o GitHub.

## Na Vercel

1. Acesse o projeto na Vercel.
2. Abra `Project Settings`.
3. Abra `Environment Variables`.
4. Cadastre as mesmas variaveis usadas localmente.
5. Separe `Preview` e `Production` quando usar chaves de test mode e live mode.
6. Use chaves `pk_test_`/`sk_test_` em Preview ou staging.
7. Use chaves live apenas em Production, depois de validar o fluxo completo em test mode.

## Uso seguro no codigo

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` pode ser usada no client quando houver Stripe.js ou UI que precise da chave publicavel.
- `STRIPE_SECRET_KEY` deve ser usada apenas no servidor.
- `STRIPE_RESTRICTED_KEY`, se usada, tambem deve ficar apenas no servidor.
- `STRIPE_WEBHOOK_SECRET` deve ser usado apenas na rota `/api/stripe/webhook`.
- Prices e coupons devem ficar no servidor sempre que possivel.

## Falhas controladas

- Se `STRIPE_SECRET_KEY` faltar, checkout e portal retornam erro controlado de Stripe nao configurada.
- Se `STRIPE_WEBHOOK_SECRET` faltar, o webhook retorna erro controlado.
- Se `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` faltar, o build nao deve quebrar; a UI atual usa Checkout por rota server-side e nao precisa carregar Stripe.js no client.

## Seguranca

As chaves Stripe reais devem ser configuradas somente em `.env.local` ou na Vercel.

Nunca colocar chaves reais em:

- codigo fonte
- README
- documentacao versionada
- commits
- prompts publicos
- issues
- logs

Ao registrar erros, use mensagens genericas e nunca imprima chaves completas.
