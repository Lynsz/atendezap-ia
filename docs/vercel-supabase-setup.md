# Setup Supabase na Vercel

Use este checklist para conectar o AtendeZap IA ao Supabase em Preview e Production.

## Variaveis

Configure na Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no client. Ela deve existir apenas em rotas API, server actions ou libs server-side.

## Banco

- Aplicar o schema de `supabase/schema.sql` no projeto Supabase correto.
- Revisar RLS antes de abrir para usuarios reais.
- Confirmar que tabelas de assinatura, negocio, respostas, biblioteca, feedback e suporte existem.
- Criar usuarios de teste pelo fluxo real de cadastro.

## Validacao

- Login e cadastro funcionam.
- `/dashboard` carrega dados do usuario autenticado.
- Uma conta nao acessa dados de outra conta.
- Rotas privadas sem login redirecionam ou retornam erro amigavel.
