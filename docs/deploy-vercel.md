# Deploy na Vercel

Use este guia para publicar o MVP SaaS do AtendeZap IA em produção.

## Passo a passo

1. Rode a validação local:

```bash
npm run check
```

2. Faça commit:

```bash
git add .
git commit -m "chore: prepare production deploy"
```

3. Faça push:

```bash
git push
```

4. Entre na Vercel.
5. Importe o repositório.
6. Em Framework, selecione `Next.js`.
7. Em Build command, use:

```bash
npm run build
```

8. Configure as Environment Variables na Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL
NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL
OPENAI_API_KEY
```

9. Faça deploy.
10. Copie a URL gerada pela Vercel.
11. No Supabase, vá em `Authentication -> URL Configuration`.
12. Configure Site URL:

```text
https://URL-DA-VERCEL
```

13. Configure Redirect URLs:

```text
https://URL-DA-VERCEL/**
```

14. Faça redeploy na Vercel se alterar variáveis.
15. Teste em produção:

```text
/debug/supabase
/cadastro
/login
/dashboard
/plans
```

## Variáveis de ambiente

`NEXT_PUBLIC_SUPABASE_URL` pode ficar pública.

`NEXT_PUBLIC_SUPABASE_ANON_KEY` pode ficar pública com RLS ativo.

`NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL` e `NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL` são URLs públicas de checkout. Se ficarem vazias, `/plans` mostra fallback amigável.

`OPENAI_API_KEY` é somente servidor. Nunca use prefixo `NEXT_PUBLIC_` nesta chave.

`SUPABASE_SERVICE_ROLE_KEY`, se for usada em fluxos futuros, nunca deve ir para o front-end.

## Supabase Auth URLs

Local:

Site URL:

```text
http://localhost:3000
```

Redirect URLs:

```text
http://localhost:3000/**
http://localhost:3001/**
http://localhost:3002/**
http://localhost:3003/**
```

Produção:

Site URL:

```text
https://URL-DA-VERCEL
```

Redirect URLs:

```text
https://URL-DA-VERCEL/**
```

Domínio futuro:

```text
https://atendezapia.com.br/**
https://www.atendezapia.com.br/**
```

## Rotas para validar

- `/`
- `/debug/supabase`
- `/cadastro`
- `/login`
- `/dashboard`
- `/plans`

## Observações

- A Vercel injeta `VERCEL_URL`; links absolutos server-side usam essa URL quando `NEXT_PUBLIC_APP_URL` não existir.
- Checkouts Kiwify ficam em fallback se as URLs públicas estiverem vazias.
- O webhook Kiwify automático permanece como placeholder seguro até a validação real de autenticidade ser implementada.
