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

1. O middleware exige um cookie nao sensivel de sessao presente antes de liberar `/admin`.
2. A interface `/admin` exige login no client.
3. A API `/api/admin/overview` valida token Supabase, consulta o usuario e bloqueia quem nao estiver em `ADMIN_EMAILS`.

`ADMIN_EMAILS` aceita multiplos e-mails separados por virgula. Usuario comum nao deve receber leads, assinaturas ou metricas.

## Middleware e rotas

`middleware.ts` classifica rotas publicas, privadas e admin usando `src/lib/auth/routes.ts`.

Rotas publicas principais:

- `/`
- `/ebook`
- `/ebook/obrigado`
- `/demo`
- `/login`
- `/cadastro`
- `/termos`
- `/privacidade`
- `/api/health`
- `/api/stripe/webhook`

Rotas privadas principais:

- `/dashboard`
- `/assinatura`
- `/onboarding`
- `/api/ai/generate-response`
- `/api/generate-response`
- `/api/stripe/create-checkout-session`
- `/api/stripe/create-portal-session`

Rotas admin:

- `/admin`
- `/api/admin/*`

O projeto ainda usa Supabase Auth no browser para a sessao principal. Por isso o middleware usa apenas `atendezap_auth_hint`, um cookie nao sensivel escrito pelo client quando ha usuario logado. Esse cookie melhora o bloqueio antes do render, mas nao substitui autorizacao real. APIs privadas, APIs admin e RLS continuam sendo a protecao autoritativa.

## Supabase

- `SUPABASE_SERVICE_ROLE_KEY` deve existir apenas no servidor.
- Client Components usam apenas `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Client browser canonico: `src/lib/supabase/browser.ts`.
- Compatibilidade para imports antigos: `src/lib/supabase.ts` reexporta o client browser canonico.
- Service role/admin client: `src/lib/supabase/server.ts`, usado apenas por Server Components, route handlers e helpers server-only.
- Auth server helper: `src/lib/auth/server.ts`, para validar token Supabase recebido em `Authorization`.
- Tabelas de usuario devem manter RLS ativo.
- Rotas administrativas usam service role apenas depois de `requireAdmin`.
- Rotas de usuario autenticado filtram por `user_id`.

Para novas APIs privadas:

1. Exigir token Supabase com `requireUser` ou validação equivalente.
2. Usar `user.id` autenticado, nunca `user_id` vindo do payload.
3. Filtrar queries por `user_id`.
4. Retornar `401` sem sessao e `403` sem permissao.
5. Nao usar service role antes de validar permissao.

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

## Protecao de variaveis de ambiente

Arquivos `.env` com valores reais devem ficar fora do Git. O `.gitignore` cobre:

- `.env`
- `.env.local`
- `.env.production`
- `.env.development.local`
- `.env.test.local`
- `.env*.local`

Somente `.env.example` deve ser versionado, sempre sem valores reais de chaves.

Variaveis com prefixo `NEXT_PUBLIC_` entram no bundle do navegador. Use esse prefixo apenas para valores publicos, como `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID` e `NEXT_PUBLIC_SENTRY_DSN`.

Nunca use `NEXT_PUBLIC_` em:

- `OPENAI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_RESTRICTED_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_AUTH_TOKEN`
- `KIWIFY_WEBHOOK_SECRET`

Antes de commitar:

```bash
git status
npm run check:secrets
```

Se um arquivo `.env` estiver rastreado, remova apenas do controle do Git e mantenha o arquivo local:

```bash
git rm --cached .env.local
git rm --cached .env
git rm --cached .env.production
git rm --cached .env.development.local
git rm --cached .env.test.local
```

Rotacione uma chave sempre que ela tiver sido exposta em commit, chat, issue, log, print, documentacao publica ou qualquer ambiente fora do provedor original. Remover a chave do Git depois da exposicao nao e suficiente.

## Como reportar erro interno

Ao investigar um erro em producao:

1. Anote rota, horario aproximado e e-mail do usuario, se houver.
2. Confira logs da Vercel pelo `event` e `route`.
3. Se Sentry estiver ativo, confira o erro pelo horario e digest.
4. Nao solicite senha, token ou dados sensiveis do usuario.
