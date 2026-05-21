# Supabase staging

Use um projeto Supabase separado para staging. Nao aponte staging para o banco de producao.

## Aplicar schema e migrations

1. Crie ou selecione o projeto Supabase staging.
2. Aplique `supabase/sql-editor-apply.sql` pelo SQL Editor ou aplique as migrations em `supabase/migrations`.
3. Confirme que nao ha comando destrutivo inesperado antes de rodar SQL manualmente.
4. Confira tabelas:
   - `profiles`
   - `businesses`
   - `generated_responses`
   - `customers`
   - `subscriptions`
   - `plans`
   - `ebook_leads`
   - `lead_email_events`
   - `stripe_webhook_events`
5. Confirme planos `starter`, `pro` e `premium`.

## RLS e seguranca

1. Confirme RLS ativo nas tabelas de usuario.
2. Confirme policies com `auth.uid()` em:
   - `profiles`
   - `businesses`
   - `generated_responses`
   - `customers`
   - `subscriptions`
3. Confirme que tabelas backend-only nao liberam acesso anonimo.
4. Confirme que `SUPABASE_SERVICE_ROLE_KEY` existe apenas na Vercel e nunca no client.
5. Teste dois usuarios:
   - Usuario A cria negocio, cliente e resposta.
   - Usuario B nao deve ver dados do Usuario A.
   - Usuario A nao deve alterar assinatura do Usuario B.

## Auth URLs

No Supabase Dashboard, abra Authentication -> URL Configuration.

Site URL staging:

```text
https://SEU-STAGING.vercel.app
```

Redirect URLs staging:

```text
https://SEU-STAGING.vercel.app/**
```

Mantenha tambem URLs locais quando precisar testar localmente:

```text
http://localhost:3000
http://localhost:3000/**
```

Para producao, adicione somente quando for promover:

```text
https://SEU-DOMINIO.com/**
https://www.SEU-DOMINIO.com/**
```

## Variaveis na Vercel staging

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=
```

## Admin staging

1. Crie usuario admin no Supabase Auth ou use um usuario descartavel existente.
2. Configure `ADMIN_EMAILS` com esse e-mail.
3. Rode novo deploy.
4. Acesse `/admin` autenticado como admin.
5. Acesse `/admin` com usuario comum e confirme bloqueio.

## Checklist rapido

- [ ] Migrations aplicadas.
- [ ] RLS ativo.
- [ ] Auth Site URL aponta para staging.
- [ ] Redirect URLs incluem staging.
- [ ] Service role apenas em env server-side.
- [ ] Usuario comum nao acessa admin.
- [ ] Dois usuarios nao acessam dados um do outro.
