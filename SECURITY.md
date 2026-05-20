# Segurança e Monitoramento

Este arquivo resume as protecoes basicas do AtendeZap IA antes de receber trafego real.

## Rate limit

As APIs sensiveis usam `src/lib/rate-limit.ts`.

Rotas protegidas:

- `/api/ai/generate-response`
- `/api/generate-response`
- `/api/ebook-lead`
- `/api/stripe/create-checkout-session`
- `/api/stripe/create-portal-session`
- `/api/stripe/webhook`
- `/api/admin/overview`
- `/api/generate-kit`
- `/api/download/[kitId]`
- `/api/support`
- `/api/kiwify/webhook`

O identificador usa IP quando nao ha usuario autenticado e `user_id` quando a rota ja validou a sessao. As janelas sao diferentes por rota: IA e kit sao mais restritos; checkout, portal, lead e admin usam limites intermediarios.

## Upstash Redis opcional

Configure na Vercel se quiser rate limit compartilhado entre instancias:

```text
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Se essas variaveis nao existirem, o app usa fallback em memoria. Esse fallback funciona localmente e em preview, mas em producao serverless cada instancia pode ter seu proprio contador. Para trafego pago, use Upstash.

## Sentry opcional

Configure:

```text
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

`NEXT_PUBLIC_SENTRY_DSN` nao e segredo e habilita captura basica no client e no servidor. `SENTRY_AUTH_TOKEN` deve ficar apenas na Vercel/build e nao e usado no navegador.

## Logs internos

`src/lib/logger.ts` gera logs JSON com:

- `event`
- `route`
- `user_id`, quando existir
- `status`
- `timestamp`
- erro resumido

Nunca logue senhas, tokens, cookies, service role, chaves secretas, cartao ou payload completo do usuario. O logger mascara nomes de campos sensiveis e corta strings longas.

## Protecao admin

O admin depende de duas camadas:

1. A interface `/admin` exige login no client.
2. A API `/api/admin/overview` valida token Supabase, consulta o usuario e bloqueia quem nao estiver em `ADMIN_EMAILS`.

`ADMIN_EMAILS` aceita multiplos e-mails separados por virgula. Usuario comum nao deve receber leads, assinaturas ou metricas.

## Supabase

- `SUPABASE_SERVICE_ROLE_KEY` deve existir apenas no servidor.
- Client Components usam apenas `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Tabelas de usuario devem manter RLS ativo.
- Rotas administrativas usam service role apenas depois de `requireAdmin`.
- Rotas de usuario autenticado filtram por `user_id`.

## Stripe

- `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` ficam somente no servidor.
- O webhook Stripe valida assinatura antes de processar eventos.
- Checkout rejeita plano invalido e usa price IDs do servidor.
- Nao logue payload completo de webhook, dados de cartao ou headers sensiveis.

## Validacao de payloads

Entradas publicas e autenticadas usam Zod ou validacao explicita:

- lead do ebook valida nome, e-mail, WhatsApp, origem e UTMs;
- IA limita pergunta e dados do negocio;
- checkout limita plano e metadados de campanha;
- admin valida filtros de busca;
- kit e suporte limitam tamanho e campos obrigatorios.

Payloads grandes sao rejeitados antes de parsear JSON nas rotas sensiveis.

## O que nunca deve ir para o front-end

- `OPENAI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_AUTH_TOKEN`
- tokens de usuario, cookies ou secrets de webhook

## Como reportar erro interno

Ao investigar um erro em producao:

1. Anote rota, horario aproximado e e-mail do usuario, se houver.
2. Confira logs da Vercel pelo `event` e `route`.
3. Se Sentry estiver ativo, confira o erro pelo horario e digest.
4. Nao solicite senha, token ou dados sensiveis do usuario.
