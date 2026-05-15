# Deploy na Vercel

## 1. Criar projeto

1. Suba o repositório para o GitHub.
2. Acesse a Vercel.
3. Crie um novo projeto.
4. Conecte o repositório.

## 2. Configurar build

A Vercel detecta Next.js automaticamente.

Scripts:

```bash
npm install
npm run build
```

## 3. Configurar variáveis

Configure em Project Settings > Environment Variables:

```text
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
RESEND_API_KEY=
EMAIL_FROM=AtendeZap IA <noreply@seudominio.com>
KIWIFY_WEBHOOK_SECRET=
SUPPORT_EMAIL=suporte@seudominio.com
```

Não configure `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` ou `KIWIFY_WEBHOOK_SECRET` com prefixo `NEXT_PUBLIC`.

## 4. Primeiro deploy

1. Rode o deploy.
2. Confira se `npm run build` passa na Vercel.
3. Acesse `/`, `/precos`, `/suporte`, `/termos` e `/privacidade`.

## 5. Domínio

1. Configure o domínio em Domains.
2. Atualize `NEXT_PUBLIC_APP_URL`.
3. Redeploy se necessário.

## 6. Testar rotas principais

- `GET /`
- `GET /precos`
- `POST /api/kiwify/webhook`
- `GET /gerar/[token]`
- `POST /api/generate-kit`
- `GET /kit/[kitId]`
- `GET /api/download/[kitId]`

## 7. Logs

Use:

- Vercel Functions Logs para erros de API.
- Supabase tabela `events` para eventos de negócio.
- Resend logs para entrega de e-mails.

## 8. Compatibilidade

O MVP é compatível com Vercel porque:

- usa App Router;
- APIs rodam em runtime Node.js;
- PDF é gerado sob demanda sem filesystem persistente;
- segredos ficam apenas no backend;
- links absolutos usam `NEXT_PUBLIC_APP_URL`.
