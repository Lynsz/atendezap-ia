# Deploy Readiness Report

Data: 2026-06-11

## Escopo revisado

- `package.json` e scripts de validacao.
- `next.config.mjs`.
- `.env.example` e `.gitignore`.
- `/api/health`.
- Rotas de IA, Stripe checkout, Stripe portal, Stripe webhook, biblioteca de respostas, feedback de resposta, privacidade, cancelamento e suporte.
- Clientes Supabase server-side, Supabase autenticado, OpenAI e Stripe.
- README e docs de setup Vercel.

## Ajustes feitos

- Criado `src/lib/server/env.ts` para validar envs server-side apenas em runtime.
- Padronizadas mensagens amigaveis para Supabase, OpenAI e Stripe ausentes.
- `/api/health` agora retorna `status: "ok"` e `app: "AtendeZap IA"` sem consultar servicos externos.
- `.gitignore` recebeu o padrao literal `.env.*.local`.
- Documentacao de deploy Vercel, Supabase, Stripe, OpenAI, checklist e smoke test adicionada.

## Resultado

O projeto esta preparado para deploy controlado na Vercel, condicionado ao preenchimento correto das variaveis reais no painel da Vercel e a validacao manual do ambiente Preview/Production.

## Pendencias operacionais

- Validar Supabase RLS com dois usuarios reais.
- Validar webhook Stripe com evento real do ambiente configurado.
- Validar geracao OpenAI com chave real e limite de uso.
- Validar Customer Portal em conta com `stripe_customer_id` salvo.
