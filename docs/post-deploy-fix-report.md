# Correcoes Pos-Deploy - AtendeZap IA

## Status

- parcialmente funcional

## Erros encontrados

- `/api/health` ainda retornava campos extras no codigo-fonte, apesar do contrato desta etapa pedir apenas `status` e `app`.
- Validacao real em Vercel ficou bloqueada nesta sessao por falta da URL de Preview/Production e credenciais de teste.
- Checkout Stripe teste, webhook Stripe real, OpenAI real e RLS com dois usuarios seguem dependentes do ambiente Vercel/Supabase configurado.

## Correcoes aplicadas

- Simplificado `GET /api/health` para retornar apenas `{ "status": "ok", "app": "AtendeZap IA" }`.
- Atualizado teste de `/api/health` para garantir que nenhum campo extra seja exposto.
- Atualizado `docs/production-smoke-test.md` com status por fluxo e evidencias do smoke local em modo producao.

## Fluxos validados

- Build local em modo producao.
- Health check local.
- Landing, precos, demo, suporte, termos e privacidade carregando localmente.
- Rotas privadas sem sessao redirecionando para login.
- APIs privadas de IA e checkout retornando 401 sem sessao.
- Testes automatizados de IA, limites, Stripe, biblioteca, auth e seguranca existentes.

## Fluxos pendentes

- Cadastro/login com Supabase real em Vercel.
- Onboarding com RLS real.
- Dashboard autenticado com dados reais.
- Geracao OpenAI com chave real.
- Biblioteca/templates com usuario real.
- Checkout Stripe teste autenticado.
- Webhook Stripe assinado no endpoint Vercel.
- Customer Portal com `stripe_customer_id` salvo.

## Variaveis que precisam estar na Vercel

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

## Proximo passo recomendado

- Informar a URL do Preview/Production e executar `docs/production-smoke-test.md` com um usuario real de teste, Supabase RLS ativo, OpenAI configurada e Stripe em modo teste.
