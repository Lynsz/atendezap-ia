# Relatorio Final do MVP Funcional - AtendeZap IA

## Status geral
- funcional

## Fluxos funcionando
- Landing publica, cadastro/login, onboarding, dashboard, IA, biblioteca, templates, favoritos e assinatura.
- Checkout Stripe funciona quando o ambiente local tem Stripe e Supabase configurados.

## Fluxos corrigidos
- Mensagem de limite mensal alinhada ao fluxo de upgrade.
- Checklist manual do MVP criado para QA final.

## Fluxos pendentes
- Smoke manual com conta real em Supabase local/staging antes do deploy.
- Checkout teste depende de chaves e Price IDs Stripe validos no ambiente.

## Bugs conhecidos
- `npm install` reporta 2 vulnerabilidades moderadas em dependencias, sem quebrar build/testes.

## Variaveis necessarias
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_PREMIUM`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Como testar localmente
- Rodar `npm install`.
- Rodar `npm run validate`.
- Subir `npm run dev` e seguir `docs/mvp-manual-test-checklist.md`.

## Proximo passo recomendado
- Executar o checklist manual em staging com Supabase, OpenAI e Stripe em modo teste.
