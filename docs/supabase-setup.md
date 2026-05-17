# Configuração do Supabase

Project URL:

```text
https://cnxwomllglzifnewqslu.supabase.co
```

## Status Da Aplicação

Schema aplicado no projeto Supabase `cnxwomllglzifnewqslu`.

Verificado no banco:

- tabelas principais criadas: `profiles`, `businesses`, `generated_responses`, `customers`, `subscriptions`, `plans`
- RLS ativo nas tabelas principais
- policies por usuário usando `auth.uid()`
- funções `public.set_updated_at()` e `public.handle_new_user()`
- trigger `on_auth_user_created` em `auth.users`
- triggers de `updated_at` em `profiles`, `businesses`, `customers` e `subscriptions`
- planos inseridos: `starter`, `pro`, `premium`

O advisor de segurança pode avisar que a proteção contra senhas vazadas do Supabase Auth está desativada; isso é uma configuração do painel de Auth, não um erro de schema/RLS. O advisor de performance pode listar índices como "unused" enquanto o banco estiver vazio ou com pouco uso; isso é esperado no início do MVP.

## Variáveis De Ambiente

Crie ou atualize `.env.local` na raiz do projeto:

```text
NEXT_PUBLIC_SUPABASE_URL=https://cnxwomllglzifnewqslu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` apenas com a anon public key do Supabase. Nunca use `SUPABASE_SERVICE_ROLE_KEY` no React ou em Client Components.

Depois de alterar `.env.local`, reinicie `npm run dev`.

## Aplicar Schema

1. Abra o Supabase Dashboard do projeto.
2. Vá em **SQL Editor**.
3. Abra o arquivo local `supabase/schema.sql`.
4. Cole todo o conteúdo no SQL Editor.
5. Clique em **Run**.

Se preferir manter histórico de migration, o mesmo SQL também fica em:

```text
supabase/migrations/0001_initial_schema.sql
```

## Como aplicar o SQL atualizado

Use este fluxo quando o código já foi atualizado e você precisa alinhar o Supabase real sem apagar dados.

1. Abra o Supabase Dashboard.
2. Vá em **SQL Editor**.
3. Clique em **New query**.
4. Cole o conteúdo de `supabase/sql-editor-apply.sql`.
5. Confira que não há `DROP TABLE`, `TRUNCATE`, `DELETE FROM`, `DROP SCHEMA` ou `DROP DATABASE`.
6. Clique em **Run**.
7. Confira as tabelas no **Table Editor**.
8. Confira que RLS está ativo nas tabelas principais.
9. Teste `/debug/supabase` no app.

O arquivo `supabase/sql-editor-apply.sql` é idempotente: pode rodar mais de uma vez, recria policies/triggers com `DROP POLICY IF EXISTS` e `DROP TRIGGER IF EXISTS`, insere planos com `ON CONFLICT` e preenche subscriptions ausentes sem sobrescrever assinaturas existentes.

## Tabelas Criadas

O schema cria as tabelas principais do MVP SaaS:

- `profiles`
- `businesses`
- `generated_responses`
- `customers`
- `subscriptions`
- `plans`

O schema também preserva tabelas backend-only usadas pelo fluxo Kiwify/kit:

- `purchasers`
- `orders`
- `kits`
- `support_requests`
- `events`

## Verificar Tabelas

No Supabase Dashboard:

1. Vá em **Table Editor**.
2. Confirme que as tabelas acima aparecem no schema `public`.
3. Abra `plans` e confirme os planos `starter`, `pro` e `premium`.

## Verificar RLS

No Supabase Dashboard:

1. Vá em **Authentication -> Policies**.
2. Confira que RLS está ativo em:
   - `profiles`
   - `businesses`
   - `generated_responses`
   - `customers`
   - `subscriptions`
   - `plans`
3. Confira as policies por usuário usando `auth.uid()`.

As tabelas `purchasers`, `orders`, `kits`, `support_requests` e `events` ficam bloqueadas para `anon` e `authenticated`; elas são usadas por rotas backend com service role.

## Auth URL Configuration

No Supabase Dashboard, vá em **Authentication -> URL Configuration**.

Site URL local:

```text
http://localhost:3000
```

Redirect URLs locais:

```text
http://localhost:3000/**
```

Redirect URLs para produção futura:

```text
https://SEU-PROJETO.vercel.app/**
https://atendezapia.com.br/**
https://www.atendezapia.com.br/**
```

## Teste Local

1. Rode `npm run dev`.
2. Abra `http://localhost:3000/debug/supabase`.
3. Verifique:
   - se a URL aparece correta
   - se `hasAnonKey` está `true`
   - se o tamanho da anon key parece completo
   - se `getSession` retorna `success`
4. Teste `/cadastro`, `/login` e `/dashboard`.
