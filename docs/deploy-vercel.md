# Deploy na Vercel

Use este guia para publicar o MVP SaaS do AtendeZap IA em producao.

## Passo a passo

1. Rode a validacao local:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

2. Faca commit:

```bash
git add .
git commit -m "chore: prepare production deploy"
```

3. Faca push:

```bash
git push
```

4. Entre na Vercel.
5. Importe o repositorio.
6. Em Framework, selecione `Next.js`.
7. Em Build command, use:

```bash
npm run build
```

8. Configure as Environment Variables na Vercel:

```text
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
ASAAS_API_KEY
ASAAS_ENVIRONMENT
ASAAS_WEBHOOK_TOKEN
KIWIFY_WEBHOOK_SECRET
NEXT_PUBLIC_KIWIFY_EBOOK_URL
NEXT_PUBLIC_KIWIFY_PRO_ORDER_BUMP_URL
```

9. Faca deploy.
10. Copie a URL gerada pela Vercel.
11. No Supabase, va em `Authentication -> URL Configuration`.
12. Configure Site URL:

```text
https://URL-DA-VERCEL
```

13. Configure Redirect URLs:

```text
https://URL-DA-VERCEL/**
```

14. Faca redeploy na Vercel se alterar variaveis.
15. Teste em producao:

```text
/debug/supabase
/cadastro
/login
/dashboard
/plans
/precos
```

## Variaveis de ambiente

`NEXT_PUBLIC_SUPABASE_URL` pode ficar publica.

`NEXT_PUBLIC_SUPABASE_ANON_KEY` pode ficar publica com RLS ativo.

`SUPABASE_SERVICE_ROLE_KEY` e somente servidor. Nunca use prefixo `NEXT_PUBLIC_`.

`OPENAI_API_KEY` e somente servidor. Nunca use prefixo `NEXT_PUBLIC_`.

As variaveis `ASAAS_*` controlam a cobranca recorrente do SaaS e ficam no servidor. Se `ASAAS_API_KEY` ficar vazia, o build continua funcionando e o erro aparece apenas no fluxo de pagamento.

As variaveis `NEXT_PUBLIC_KIWIFY_*` sao URLs publicas do funil de aquisicao, como ebook e order bump.

## Supabase Auth URLs

Local:

```text
http://localhost:3000
```

Redirect URLs locais:

```text
http://localhost:3000/**
http://localhost:3001/**
http://localhost:3002/**
http://localhost:3003/**
```

Producao:

```text
https://URL-DA-VERCEL
https://URL-DA-VERCEL/**
```
