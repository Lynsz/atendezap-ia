# AtendeZap IA

MVP SaaS para pequenos negócios que atendem pelo WhatsApp.

Promessa do MVP: **crie respostas profissionais com IA para atender melhor seus clientes no WhatsApp e vender mais.**

Nesta versão, o AtendeZap IA não conecta automaticamente ao WhatsApp. O usuário cadastra o negócio, cola a pergunta de um cliente, gera uma resposta com IA, copia e envia manualmente pelo WhatsApp.

## Funcionalidades Atuais

- Landing page focada em venda.
- Cadastro e login com Supabase Auth.
- Dashboard protegido.
- Cadastro e edição dos dados do negócio.
- Gerador de respostas com IA por rota serverless segura.
- Histórico de respostas salvo no Supabase.
- Cadastro simples de clientes/leads.
- Alteração de status e observações de clientes.
- Biblioteca de scripts prontos para WhatsApp.
- Página de planos com links configuráveis da Kiwify.
- Módulos demo/localStorage ainda preservados para exploração futura: automações, WhatsApp demo, Kiwify demo, backend status e base de conhecimento.

## Stack

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth e Database
- OpenAI SDK em rota serverless
- Deploy compatível com Vercel

## Rodar Localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run test
```

Antes de finalizar mudanças:

```bash
npm run lint
npm run typecheck
npm run build
```

## Variáveis De Ambiente

Copie `.env.example` para `.env.local`.

Para o app Next.js em produção, configure principalmente:

```bash
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL=
NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

Aliases `VITE_*` também foram adicionados ao `.env.example` porque a especificação original citava Vite. Como este repositório usa Next.js, prefira os aliases `NEXT_PUBLIC_*` para variáveis públicas do navegador.

Nunca exponha `OPENAI_API_KEY` no front-end. Ela deve existir apenas no ambiente serverless da Vercel ou no `.env.local` do servidor.

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Em Authentication, habilite login por e-mail/senha.
3. Copie a Project URL para `NEXT_PUBLIC_SUPABASE_URL`.
4. Copie a anon public key para `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Abra o SQL Editor.
6. Rode o arquivo:

```bash
supabase/mvp-saas-schema.sql
```

Esse schema cria:

- `profiles`
- `businesses`
- `generated_responses`
- `customers`
- `plans`
- `subscriptions`

As tabelas principais usam Row Level Security para que cada usuário acesse apenas os próprios dados.

## Fluxo Do MVP

1. Usuário cria conta em `/cadastro`.
2. Usuário entra em `/login`.
3. Dashboard protegido abre em `/dashboard`.
4. Usuário cadastra o negócio.
5. Usuário cola a pergunta do cliente.
6. `/api/generate-response` chama a OpenAI no servidor.
7. A resposta é salva em `generated_responses`.
8. Usuário copia a resposta e envia manualmente no WhatsApp.
9. Usuário cadastra e acompanha clientes em `customers`.

## Deploy Na Vercel

1. Conecte o repositório à Vercel.
2. Configure as variáveis de ambiente listadas acima.
3. Garanta que `OPENAI_API_KEY` fique apenas como server environment variable.
4. Rode o deploy.
5. Teste `/cadastro`, `/login`, `/dashboard`, `/precos` e `/scripts`.

## Planos

A página de planos usa:

- `NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL`
- `NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL`

Enquanto esses links não forem configurados, os botões podem aparecer indisponíveis.

## Rotas Principais

- `/` landing page
- `/precos` planos
- `/cadastro` criar conta
- `/login` entrar
- `/dashboard` MVP protegido
- `/scripts` biblioteca de scripts
- `/api/generate-response` geração segura com OpenAI

## Segurança

- OpenAI roda apenas no backend.
- Supabase anon key pode ir ao navegador; service role não deve ir ao navegador.
- Dados importantes do MVP ficam no Supabase, não no localStorage.
- RLS isola dados por usuário.
- A rota de IA exige JWT do usuário autenticado.

## Placeholders E Limitações

- Links Kiwify Inicial/Pro dependem das variáveis de ambiente.
- O plano Premium está marcado como “em breve”.
- WhatsApp automático ainda não existe.
- Não há QR Code de conexão WhatsApp.
- Não há disparo em massa.
- Relatórios avançados ficam para etapa futura.
- Alguns módulos antigos ainda usam localStorage como demonstração, mas o fluxo principal vendável usa Supabase.

## Próximos Passos

- Conectar Kiwify real ao cadastro/assinatura.
- Criar limites de uso por plano.
- Melhorar histórico com busca e filtros.
- Adicionar templates por nicho no Supabase.
- Implementar webhook de assinatura.
- Futuramente conectar WhatsApp Cloud API ou provedor aprovado.
