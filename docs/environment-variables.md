# Variaveis de ambiente

Este projeto deve manter valores reais apenas em `.env.local` localmente ou nas Environment Variables da Vercel. O Git deve receber somente `.env.example`, sem chaves reais.

## Local

1. Copie `.env.example` para `.env.local`.
2. Preencha as variaveis reais apenas no `.env.local`.
3. Nunca commite `.env.local`.
4. Rode o projeto localmente.

```bash
cp .env.example .env.local
npm run dev
```

Antes de commitar, confirme que `.env.local` aparece como ignorado ou nem aparece no status normal:

```bash
git status
```

## GitHub

- Suba apenas `.env.example`.
- Nunca suba `.env`, `.env.local`, `.env.production`, `.env.development.local`, `.env.test.local` ou arquivos `.env*.local`.
- Confira `git status` antes de cada commit.
- Se `.env.local` aparecer como arquivo rastreado, remova do controle do Git sem apagar o arquivo local:

```bash
git rm --cached .env.local
```

Para outros arquivos de ambiente rastreados por engano:

```bash
git rm --cached .env
git rm --cached .env.production
git rm --cached .env.development.local
git rm --cached .env.test.local
```

## Vercel

1. Abra o projeto na Vercel.
2. Acesse `Project Settings`.
3. Abra `Environment Variables`.
4. Adicione as variaveis reais.
5. Separe `Production` e `Preview` quando usar chaves, URLs, webhooks ou contas diferentes.
6. Nao coloque valores reais dentro do codigo, README ou documentacao versionada.

## Stripe

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` e publica e pode ser usada no client.
- `STRIPE_SECRET_KEY` e secreta e deve ficar apenas no servidor.
- `STRIPE_RESTRICTED_KEY` e secreta e deve ficar apenas no servidor, se for usada.
- `STRIPE_WEBHOOK_SECRET` e secreta e deve ficar apenas na rota de webhook.
- Price IDs e coupon IDs nao sao tao sensiveis quanto chaves, mas devem ficar em env para separar test, preview e production.

## Variaveis publicas e privadas

Variaveis com prefixo `NEXT_PUBLIC_` podem ser embutidas no bundle do navegador. Use esse prefixo somente para valores publicos, como URL publica do app, anon key do Supabase, publishable key do Stripe, IDs de tracking e URLs publicas de checkout legado.

Nunca exponha no client:

- `OPENAI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_RESTRICTED_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_AUTH_TOKEN`
- `KIWIFY_WEBHOOK_SECRET`

## Verificacao

Rode a checagem local antes de commit quando alterar env, docs ou integracoes:

```bash
npm run check:secrets
```

Se uma chave secreta ja foi exposta em chat, commit, issue, log ou documentacao publica, ela deve ser revogada/rotacionada no provedor.
