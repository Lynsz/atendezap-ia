# AtendeZap IA

MVP SaaS para pequenos negocios que atendem pelo WhatsApp Business.

O produto permite criar conta, cadastrar o negocio, gerar respostas com IA para perguntas de clientes, salvar historico no Supabase, organizar clientes/leads e vender planos mensais via checkout Kiwify.

## Status Comercial Do MVP

O MVP ja tem landing page comercial, pagina de planos, cadastro/login, cadastro do negocio, geracao de respostas com IA por rota segura, historico e clientes/leads conectados ao Supabase.

O checkout depende das URLs publicas da Kiwify:

```bash
NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL=
NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL=
```

Quando essas URLs estiverem vazias, os botoes de plano mostram checkout em configuracao. A automacao direta com WhatsApp ainda nao faz parte desta versao; nesta etapa o usuario cola a pergunta, gera a resposta e copia para enviar manualmente.

## Status atual do MVP

- `/dashboard` é a rota oficial da área logada do SaaS.
- `/app/*` não é mais usado como área do produto; acessos legados redirecionam para `/dashboard`.
- Componentes reutilizáveis saíram de `src/pages` para evitar rotas públicas antigas como `/LoginPage`, `/SignupPage`, `/DashboardPage`, `/SaasDashboardPage` e `/AppDashboardPage`.
- A geração de resposta é feita server-side por `/api/ai/generate-response`.
- O limite mensal é aplicado no servidor antes de chamar a OpenAI e antes de salvar em `generated_responses`.
- `subscriptions` é leitura para o client; plano, status e período devem ser atualizados por trigger, webhook validado ou operação backend segura.
- Upgrade pago por enquanto é manual via Supabase/Kiwify.
- Webhook Kiwify automático para liberar plano é etapa futura.

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

## Configuracao do Supabase

Project URL:

```bash
https://cnxwomllglzifnewqslu.supabase.co
```

O schema principal esta em:

```bash
supabase/schema.sql
```

Ele cria as tabelas `profiles`, `businesses`, `generated_responses`, `customers`, `subscriptions`, `plans`, alem das tabelas server-side do fluxo Kiwify/kit: `purchasers`, `orders`, `kits`, `support_requests` e `events`.

As tabelas usadas pelo app logado tem RLS ativa por `auth.uid()`. `subscriptions` permite apenas leitura pelo usuario autenticado; criacao e alteracao de plano/status ficam restritas a trigger, SQL administrativo ou backend seguro. As tabelas do fluxo Kiwify/kit ficam sem acesso para `anon` e `authenticated`, sendo usadas apenas por rotas backend com service role.

Para configurar:

1. Preencha `.env.local` com `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e demais variaveis server-side quando necessario.
2. Aplique `supabase/schema.sql` no SQL Editor do Supabase.
3. Configure Authentication -> URL Configuration com `http://localhost:3000` e `http://localhost:3000/**`.
4. Reinicie `npm run dev` depois de alterar `.env.local`.
5. Abra `/debug/supabase` para verificar se o Next.js leu as variaveis e se `getSession` funciona.

Guia detalhado: `docs/supabase-setup.md`.

### Debug Supabase

Abra `http://localhost:3000/debug/supabase` durante o desenvolvimento.

A pagina mostra:

- se `NEXT_PUBLIC_SUPABASE_URL` foi lida
- se `NEXT_PUBLIC_SUPABASE_ANON_KEY` existe, sem revelar a chave
- tamanho da anon key
- resultado de `supabase.auth.getSession()`
- select publico em `plans`
- selects protegidos em `profiles`, `businesses`, `generated_responses`, `customers` e `subscriptions` quando houver usuario logado

Resultados em verde indicam conexao/RLS funcionando. Resultados em amarelo indicam testes pulados por falta de sessao. Resultados em vermelho mostram a mensagem retornada pelo Supabase.

## Variaveis De Ambiente

Copie `.env.example` para `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cnxwomllglzifnewqslu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL=
NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL=

OPENAI_API_KEY=

SUPABASE_SERVICE_ROLE_KEY=
OPENAI_MODEL=gpt-4o-mini
RESEND_API_KEY=
EMAIL_FROM=
KIWIFY_WEBHOOK_SECRET=
SUPPORT_EMAIL=
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` deve ser a anon public key do Supabase, encontrada em Project Settings -> API Keys. Ela pode ser usada no navegador junto com RLS.

`OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` e `KIWIFY_WEBHOOK_SECRET` nunca devem ficar no front-end. A service role nunca deve ser usada no React.

Este projeto usa Next.js. Variaveis que precisam chegar ao navegador devem usar o prefixo `NEXT_PUBLIC_`.

Depois de alterar `.env.local`, pare e reinicie `npm run dev`. O Next.js injeta variaveis publicas no bundle durante a inicializacao do servidor de desenvolvimento.

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
http://localhost:3000
```

Redirect URLs:

```bash
http://localhost:3000/**
https://SEU-PROJETO.vercel.app/**
https://atendezapia.com.br/**
https://www.atendezapia.com.br/**
```

Para Vercel e dominio proprio, mantenha tambem as URLs de producao listadas abaixo.

Teste rapido de conectividade do projeto Supabase:

```bash
https://cnxwomllglzifnewqslu.supabase.co/auth/v1/health
```

Uma resposta HTTP do Supabase confirma que o host esta acessivel; se o navegador bloquear essa URL, o cadastro/login tambem podem falhar com erro de rede.

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
- `/dashboard`: rota oficial protegida do SaaS.
- Aba "Meu negocio": salva/edita `businesses`.
- Aba "Gerar resposta": chama `/api/ai/generate-response`, nunca OpenAI direto do React.
- Aba "Historico": lista e exclui `generated_responses`.
- Aba "Clientes": CRUD basico em `customers`.
- `/plans` e `/precos`: carregam `plans` do Supabase e usam `NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL` e `NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL` para checkouts.

Para testar cadastro/login:

1. Confirme a anon public key completa em `.env.local`.
2. Reinicie `npm run dev`.
3. Abra `/debug/supabase` e confirme `plans select limit 1` em verde.
4. Crie conta em `/cadastro`.
5. Entre em `/login`.
6. Abra `/dashboard` e salve os dados do negocio.

## Geracao De Respostas Com IA

A geracao de respostas usa a rota interna:

```bash
/api/ai/generate-response
```

O front-end chama essa rota por `src/services/ai.ts`; ele nunca chama OpenAI diretamente.

Para usar IA real, configure no ambiente local ou no servidor:

```bash
OPENAI_API_KEY=
```

`OPENAI_API_KEY` deve ficar apenas no servidor ou `.env.local`; nunca use prefixo `NEXT_PUBLIC_` para essa chave.

Se `OPENAI_API_KEY` nao estiver configurada, a rota retorna um fallback util usando a pergunta do cliente e os dados cadastrados do negocio, sem inventar informacoes. Antes de gerar, a rota autentica o usuario, le a assinatura, conta as respostas do mes atual e bloqueia o uso acima do limite do plano. Depois de gerada, a resposta e salva em `generated_responses` no Supabase com `user_id`, `business_id`, pergunta, resposta, tipo e data.

## Placeholders

- Se `OPENAI_API_KEY` nao estiver configurada, `/api/ai/generate-response` salva uma resposta placeholder segura baseada nos dados do negocio.
- Plano Premium continua como "Em breve".
- Modulos antigos de demo ainda podem usar `localStorage` para simulacoes, mas o fluxo SaaS principal usa Supabase.
- WhatsApp conectado, dashboard administrativo complexo e automacoes reais ficam fora do escopo do MVP atual.

## Proximos Passos

- Aplicar o schema no Supabase real.
- Configurar Auth URLs no Supabase.
- Colocar a anon public key no `.env.local`.
- Configurar `OPENAI_API_KEY` no ambiente serverless.
- Evoluir Kiwify para atualizar assinaturas reais em `subscriptions` somente apos validar autenticidade do webhook.
