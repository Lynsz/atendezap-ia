# Configuracao do Supabase

Project URL:

```text
https://cnxwomllglzifnewqslu.supabase.co
```

## Status Da Aplicacao

Schema aplicado no projeto Supabase `cnxwomllglzifnewqslu`.

Verificado no banco:

- tabelas principais criadas: `profiles`, `businesses`, `generated_responses`, `customers`, `subscriptions`, `plans`
- RLS ativo nas tabelas principais
- policies por usuario usando `auth.uid()`
- funcoes `public.set_updated_at()` e `public.handle_new_user()`
- trigger `on_auth_user_created` em `auth.users`
- triggers de `updated_at` em `profiles`, `businesses`, `customers` e `subscriptions`
- planos iniciais inseridos: `Inicial`, `Pro`, `Premium`

O advisor de seguranca do Supabase nao retornou lints depois da aplicacao. O advisor de performance pode listar indices como "unused" enquanto o banco estiver vazio ou com pouco uso; isso e esperado no inicio do MVP.

## Variaveis De Ambiente

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
2. Va em **SQL Editor**.
3. Abra o arquivo local `supabase/schema.sql`.
4. Cole todo o conteudo no SQL Editor.
5. Clique em **Run**.

Se preferir manter historico de migration, o mesmo SQL tambem fica em:

```text
supabase/migrations/0001_initial_schema.sql
```

## Tabelas Criadas

O schema cria as tabelas principais do MVP SaaS:

- `profiles`
- `businesses`
- `generated_responses`
- `customers`
- `subscriptions`
- `plans`

O schema tambem preserva tabelas backend-only usadas pelo fluxo Kiwify/kit:

- `purchasers`
- `orders`
- `kits`
- `support_requests`
- `events`

## Verificar Tabelas

No Supabase Dashboard:

1. Va em **Table Editor**.
2. Confirme que as tabelas acima aparecem no schema `public`.
3. Abra `plans` e confirme os planos `Inicial`, `Pro` e `Premium`.

## Verificar RLS

No Supabase Dashboard:

1. Va em **Authentication -> Policies**.
2. Confira que RLS esta ativo em:
   - `profiles`
   - `businesses`
   - `generated_responses`
   - `customers`
   - `subscriptions`
   - `plans`
3. Confira as policies por usuario usando `auth.uid()`.

As tabelas `purchasers`, `orders`, `kits`, `support_requests` e `events` ficam bloqueadas para `anon` e `authenticated`; elas sao usadas por rotas backend com service role.

## Auth URL Configuration

No Supabase Dashboard, va em **Authentication -> URL Configuration**.

Site URL local:

```text
http://localhost:3000
```

Redirect URLs locais:

```text
http://localhost:3000/**
```

Redirect URLs para producao futura:

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
   - se `hasAnonKey` esta `true`
   - se o tamanho da anon key parece completo
   - se `getSession` retorna `success`
4. Teste `/cadastro`, `/login` e `/dashboard`.
