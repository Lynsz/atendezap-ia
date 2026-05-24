# Supabase na Vercel

Use este guia para conectar Supabase ao deploy Vercel de staging ou producao controlada.

## Projeto por ambiente

- Local: pode usar projeto de desenvolvimento ou mocks/fallbacks.
- Staging: use projeto Supabase separado de producao.
- Producao: use projeto dedicado, com backups e RLS revisado.

Nao aponte staging para o banco de producao.

## Aplicar migrations

1. Revisar `supabase/migrations`.
2. Confirmar que nao ha `DROP TABLE`.
3. Aplicar as migrations em ordem no projeto Supabase do ambiente.
4. Confirmar tabelas principais:
   - `profiles`
   - `businesses`
   - `generated_responses`
   - `subscriptions`
   - `ebook_leads`
   - `lead_email_events`
   - `user_feedback`
   - `stripe_webhook_events`
5. Confirmar indices de `user_id`, Stripe IDs, leads e eventos de e-mail.

## Auth Site URL

No Supabase Dashboard, acesse Authentication -> URL Configuration.

Staging:

```text
https://SEU-STAGING.vercel.app
```

Producao:

```text
https://SEU-DOMINIO.com
```

## Redirect URLs

Staging:

```text
https://SEU-STAGING.vercel.app/**
```

Producao:

```text
https://SEU-DOMINIO.com/**
https://www.SEU-DOMINIO.com/**
```

Mantenha URLs locais apenas nos ambientes usados para desenvolvimento:

```text
http://localhost:3000
http://localhost:3000/**
```

## Variaveis na Vercel

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=
```

- `NEXT_PUBLIC_SUPABASE_URL`: publica.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: publica.
- `SUPABASE_SERVICE_ROLE_KEY`: servidor apenas.
- `ADMIN_EMAILS`: servidor apenas.

## RLS

Confirmar no painel:

- RLS ativo em tabelas sensiveis.
- Usuario comum le apenas linhas com o proprio `user_id`.
- `subscriptions` e somente leitura para usuario autenticado; webhooks/servidor atualizam.
- `ebook_leads`, `lead_email_events`, `stripe_webhook_events`, `events`, `orders` e `kits` nao ficam listaveis pelo client.
- Admin acessa dados por APIs protegidas, nao por politica aberta no client.

## Teste de isolamento

1. Criar usuario A.
2. Criar usuario B.
3. Concluir onboarding com A.
4. Gerar resposta com A.
5. Concluir onboarding com B.
6. Confirmar que A nao ve dados de B.
7. Confirmar que B nao ve dados de A.
8. Confirmar que usuario comum nao acessa `/admin`.
9. Confirmar que e-mail em `ADMIN_EMAILS` acessa `/admin`.

## Webhooks e service role

As rotas de webhook e admin usam service role server-side quando necessario. Nunca copie `SUPABASE_SERVICE_ROLE_KEY` para variaveis `NEXT_PUBLIC_*`, docs, logs ou client components.

## Checklist rapido

- [ ] Migrations aplicadas.
- [ ] RLS habilitado.
- [ ] Auth Site URL configurada.
- [ ] Redirect URLs configuradas.
- [ ] Env vars preenchidas na Vercel.
- [ ] Admin testado.
- [ ] Usuario A/B testado.
- [ ] Stripe webhook atualiza `subscriptions`.
- [ ] Ebook salva `ebook_leads`.
