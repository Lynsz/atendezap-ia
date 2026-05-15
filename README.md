# AtendeZap IA

MVP SaaS para pequenos negocios que atendem pelo WhatsApp Business.

O produto permite criar conta, cadastrar o negocio, gerar respostas com IA para perguntas de clientes, salvar historico no Supabase, organizar clientes/leads e vender planos mensais via checkout Kiwify.

## Stack

- Next.js com App Router
- React e TypeScript
- Tailwind CSS
- Supabase Auth e Database
- OpenAI SDK em rota serverless segura
- Resend para emails do fluxo de compra
- `@react-pdf/renderer` para PDF do kit
- Vitest
- Deploy compativel com Vercel

## Supabase

Project URL:

```bash
https://cnxwomllglzifnewqslu.supabase.co
```

O schema principal esta em:

```bash
supabase/schema.sql
```

Ele cria as tabelas `profiles`, `businesses`, `generated_responses`, `customers`, `subscriptions`, `plans`, alem das tabelas server-side do fluxo Kiwify/kit: `purchasers`, `orders`, `kits`, `support_requests` e `events`.

As tabelas usadas pelo app logado tem RLS ativa por `auth.uid()`. As tabelas do fluxo Kiwify/kit ficam sem acesso para `anon` e `authenticated`, sendo usadas apenas por rotas backend com service role.

## Variaveis De Ambiente

Copie `.env.example` para `.env.local`:

```bash
VITE_SUPABASE_URL=https://cnxwomllglzifnewqslu.supabase.co
VITE_SUPABASE_ANON_KEY=
VITE_KIWI_INITIAL_CHECKOUT_URL=
VITE_KIWI_PRO_CHECKOUT_URL=

OPENAI_API_KEY=

SUPABASE_SERVICE_ROLE_KEY=
OPENAI_MODEL=gpt-4o-mini
RESEND_API_KEY=
EMAIL_FROM=
KIWIFY_WEBHOOK_SECRET=
SUPPORT_EMAIL=
```

`VITE_SUPABASE_ANON_KEY` deve ser a anon public key do Supabase, encontrada em Project Settings -> API Keys. Ela pode ser usada no navegador junto com RLS.

`OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` e `KIWIFY_WEBHOOK_SECRET` nunca devem ficar no front-end. A service role nunca deve ser usada no React.

Este projeto usa Next.js, mas as variaveis publicas foram mantidas como `VITE_*` conforme a configuracao atual solicitada. `next.config.mjs` expoe esses aliases para o bundle do navegador.

## Aplicar Schema

1. Abra o Supabase Dashboard do projeto.
2. Va em SQL Editor.
3. Cole o conteudo de `supabase/schema.sql`.
4. Execute o SQL.
5. Verifique se RLS esta ativa nas tabelas principais.

Se o projeto ja tiver tabelas antigas de teste, revise antes de executar porque `customers` agora e a tabela de leads do usuario logado, e compradores Kiwify ficam em `purchasers`.

## Auth URLs

No Supabase, configure Authentication -> URL Configuration:

Site URL local:

```bash
http://localhost:5173
```

Redirect URLs:

```bash
http://localhost:5173/**
https://SEU-PROJETO.vercel.app/**
https://atendezapia.com.br/**
https://www.atendezapia.com.br/**
```

Para desenvolvimento Next.js local, o app roda por padrao em `http://localhost:3000`; adicione tambem `http://localhost:3000/**` se usar esse host nos testes.

## Rodar Localmente

```bash
npm install
npm run dev
```

Acesse:

```bash
http://localhost:3000
```

## Build E Qualidade

```bash
npm run lint
npm run typecheck
npm run build
```

Quando tocar validacao, webhook, prompt, geracao de kit ou logica critica:

```bash
npm run test
```

## Fluxo Conectado

- `/cadastro`: cria usuario no Supabase Auth e profile.
- `/login`: autentica com Supabase Auth.
- `/dashboard`: rota protegida.
- Aba "Meu negocio": salva/edita `businesses`.
- Aba "Gerar resposta": chama `/api/generate-response`, nunca OpenAI direto do React.
- Aba "Historico": lista e exclui `generated_responses`.
- Aba "Clientes": CRUD basico em `customers`.
- `/precos`: usa `VITE_KIWI_INITIAL_CHECKOUT_URL` e `VITE_KIWI_PRO_CHECKOUT_URL`.

## Placeholders

- Se `OPENAI_API_KEY` nao estiver configurada, `/api/generate-response` salva uma resposta placeholder segura baseada nos dados do negocio.
- Plano Premium continua como "Em breve".
- Modulos antigos de demo ainda podem usar `localStorage` para simulacoes, mas o fluxo SaaS principal usa Supabase.
- WhatsApp conectado, dashboard administrativo complexo e automacoes reais ficam fora do escopo do MVP atual.

## Proximos Passos

- Aplicar o schema no Supabase real.
- Configurar Auth URLs no Supabase.
- Colocar a anon public key no `.env.local`.
- Configurar `OPENAI_API_KEY` no ambiente serverless.
- Adicionar limites de uso por plano.
- Evoluir Kiwify para atualizar assinaturas reais em `subscriptions`.
