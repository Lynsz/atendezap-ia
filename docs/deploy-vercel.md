# Deploy na Vercel

## Passo a passo

1. Faça commit de todas as mudanças.
2. Faça push para o GitHub.
3. Entre na Vercel.
4. Importe o repositório.
5. Confirme o framework como `Next.js`.
6. Use build command `npm run build`.
7. Use o output padrão do Next.js.
8. Adicione as Environment Variables obrigatórias:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL=
NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL=
OPENAI_API_KEY=
```

9. Faça o deploy.
10. Copie a URL gerada pela Vercel.
11. Vá no Supabase em `Authentication -> URL Configuration`.
12. Configure:

Site URL:

```text
https://URL-DA-VERCEL
```

Redirect URLs:

```text
https://URL-DA-VERCEL/**
```

13. Faça redeploy na Vercel se alterar variáveis.
14. Abra `/debug/supabase` em produção.
15. Teste cadastro/login em produção.
16. Teste `/dashboard` em produção.
17. Teste geração de resposta.
18. Teste histórico.
19. Teste clientes.
20. Teste planos/checkout.

## Variáveis

`NEXT_PUBLIC_SUPABASE_URL` pode ir para o navegador.

`NEXT_PUBLIC_SUPABASE_ANON_KEY` pode ir para o navegador com RLS ativo.

`OPENAI_API_KEY` fica apenas no servidor e nunca deve usar prefixo `NEXT_PUBLIC`.

`SUPABASE_SERVICE_ROLE_KEY`, se usada em fluxos futuros, nunca deve ir para o front-end.

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
- `/cadastro`
- `/login`
- `/dashboard`
- `/plans`
- `/debug/supabase`
- `/api/ai/generate-response`

## Observações

- A Vercel injeta `VERCEL_URL`; links absolutos server-side usam essa URL quando `NEXT_PUBLIC_APP_URL` não existir.
- Checkouts Kiwify ficam em fallback se as URLs públicas estiverem vazias.
- O webhook Kiwify automático permanece como placeholder seguro até a validação real de autenticidade ser implementada.
