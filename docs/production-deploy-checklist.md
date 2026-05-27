# Checklist de Deploy em Producao - AtendeZap IA

## Pre-requisitos

- staging validado
- `npm run validate` passou
- GitHub Action passou
- sem bugs P0
- sem bugs P1 graves
- rollback documentado
- variaveis de producao configuradas na Vercel

## Variaveis

Confirmar na Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_APP_URL`

Nao colocar valores reais no documento.

## Stripe

- produtos/precos conferidos
- checkout testado
- portal testado
- webhook endpoint correto
- webhook secret correto
- eventos necessarios configurados

## Supabase

- migrations aplicadas
- RLS ativa
- policies revisadas
- service role apenas server-side
- admin protegido

## OpenAI

- API key server-side
- rate limit funcionando
- limites por plano funcionando
- custo monitorado

## Resend

- dominio/remetente configurado
- envio do ebook validado
- falhas tratadas

## Apos deploy

- abrir landing
- testar demo
- testar cadastro
- testar geracao
- testar checkout
- testar webhook
- revisar logs da Vercel
- revisar logs do Supabase
- revisar eventos Stripe
