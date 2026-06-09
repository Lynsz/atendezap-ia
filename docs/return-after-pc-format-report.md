# Retorno ao Projeto Apos Formatacao — AtendeZap IA

## Status geral

- funcional

## O que foi verificado

- Projeto privado por configuracao do `package.json` (`private: true`) e sem acao para tornar o repositorio publico.
- Stack: Next.js App Router, TypeScript, Tailwind CSS, Supabase, OpenAI SDK, Stripe, Resend, Zod, Vitest, Playwright e `@react-pdf/renderer`.
- Next.js: `16.2.6`.
- Scripts disponiveis: `dev`, `start`, `build`, `lint`, `typecheck`, `test`, `test:e2e`, `test:all`, `check`, `check:secrets`, `validate` e `stripe:setup-products`.
- Rotas principais: landing `/`, demo `/demo`, cadastro `/cadastro`, login `/login`, dashboard `/dashboard`, onboarding `/onboarding`, precos `/precos`, assinatura `/assinatura`, Kiwify `/api/kiwify/webhook`, IA `/api/ai/generate-response`, Stripe `/api/stripe/*`, download de kit `/api/download/[kitId]`.
- `.env.example` existe, sem valores reais, com variaveis de Supabase, OpenAI, Stripe, Resend, tracking, admin, rate limit, Sentry e Kiwify legado.
- `.env.local` esta protegido no `.gitignore`.
- OpenAI e Stripe sao chamados por rotas/libs server-side.
- Dashboard protegido redireciona usuario sem sessao para `/login`.
- Cadastro, login e logout usam Supabase Auth.
- Dashboard permite cadastrar contexto do negocio, gerar resposta com IA, copiar resposta, salvar/listar/copiar/excluir respostas salvas e acompanhar assinatura/uso.
- Supabase possui tabelas principais: `profiles`, `businesses`, `generated_responses`, `customers`, `subscriptions`, `plans`, `saved_responses`, tabelas de webhook/feedback/suporte e fluxo legado de kit.
- RLS esta ativado nas tabelas principais e ha policies para usuario acessar os proprios dados.
- Nao foi encontrada tabela `ai_usage`; o uso mensal atual e calculado por contagem de `generated_responses` no periodo.

## O que foi corrigido

- Removido `next/font/google` do layout global para o build nao depender de baixar a fonte Inter do Google Fonts.
- Limpado o cache local `.next` depois de erro do `next dev` carregando hook antigo de instrumentation; em primeiro plano, o servidor chegou em `Ready`.
- Criado `docs/local-setup.md` com setup local curto para retomar o desenvolvimento.

## O que ainda precisa configurar manualmente

- Preencher `.env.local` com chaves reais ou de teste.
- Aplicar `supabase/schema.sql` ou migrations no projeto Supabase usado localmente.
- Configurar Auth do Supabase para e-mail/senha.
- Criar produtos/precos de teste na Stripe e preencher `STRIPE_PRICE_*`.
- Configurar webhook Stripe local, se for testar checkout completo.
- Preencher `OPENAI_API_KEY` para gerar respostas reais.
- Preencher `RESEND_API_KEY` e `EMAIL_FROM` para fluxos de e-mail.

## Variaveis necessarias

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_PREMIUM`
- `RESEND_API_KEY`
- `EMAIL_FROM`

## Como rodar localmente

```bash
npm install
npm run dev
```

No PowerShell, se `npm` for bloqueado pela politica de execucao:

```bash
npm.cmd install
npm.cmd run dev
```

Depois abra `http://localhost:3000`.

## Validacoes executadas

- `npm.cmd install`: passou; removeu 2 pacotes obsoletos e exibiu avisos de peer dependency em pacote wasm opcional.
- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run build`: passou.
- `npm.cmd test`: passou, 53 arquivos e 221 testes.
- `npm.cmd run validate`: passou, incluindo secret scan, lint, typecheck, build e testes.

## Proximo passo recomendado

- Configurar `.env.local` com Supabase, Stripe em teste, OpenAI e Resend; depois rodar `npm.cmd run dev` em um terminal aberto e testar manualmente cadastro, login, dashboard, geracao de resposta, copiar resposta, biblioteca e assinatura em modo teste.
