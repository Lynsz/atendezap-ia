# Deploy Controlado - Versao 1.1 AtendeZap IA

## Objetivo

Publicar a versao 1.1 de forma controlada, validando ambiente, rotas criticas, integracoes e seguranca antes de qualquer divulgacao maior.

## Status real da versao 1.1

* Aprovada com observacoes para operacao controlada.
* Nenhum P0 confirmado na auditoria local e documental.
* Deploy real ainda depende de validacoes em Preview/Producao.
* GitHub Actions precisa de confirmacao visual no GitHub antes de promover para producao.

## Escopo

* validacao local
* validacao do CI
* deploy preview
* smoke test no preview
* promocao para producao, se aprovado
* smoke test em producao
* monitoramento das primeiras 72 horas
* criterios de rollback

## Fora do escopo

* campanha grande
* integracao com WhatsApp
* envio automatico
* CRM completo
* app mobile
* automacoes complexas
* novas features

## Criterios para iniciar deploy

* CI verde
* build passando
* testes passando
* check:secrets passando
* smoke test final da 1.1 aprovado
* nenhum P0 aberto
* variaveis da Vercel revisadas
* rollback documentado
* admin protegido

## Criterios para bloquear deploy

* P0 aberto
* falha no build
* falha em testes criticos
* secret exposto
* RLS com risco
* admin acessivel para usuario comum
* IA quebrada
* Stripe quebrado
* erro 500 recorrente em rota critica

## Bloqueadores finais

* Nenhum P0 local confirmado.
* Deploy de producao deve ficar bloqueado se o smoke de Preview falhar.
* Campanha externa deve ficar bloqueada ate smoke de Producao e monitoramento inicial.

## Pendencias aceitas antes do deploy

* Confirmar GitHub Actions verde no GitHub.
* Aplicar migrations no Supabase real.
* Validar RLS com dois usuarios reais.
* Validar Stripe Checkout, Customer Portal e webhook assinado no ambiente final.
* Validar OpenAI e Resend no ambiente final.
* Preencher URL e resultado dos smoke tests de Preview e Producao.

## Rotas criticas

* `/`
* `/cadastro`
* `/login`
* `/onboarding`
* `/dashboard`
* `/dashboard/biblioteca`
* `/dashboard/templates`
* `/assinatura`
* `/precos`
* `/suporte`
* `/admin`
* `/api/health`
* `/api/ai/generate-response`
* `/api/saved-responses`
* `/api/stripe/create-checkout-session`
* `/api/stripe/create-portal-session`
* `/api/stripe/webhook`
* `/api/support`
* `/api/feedback`
* `/api/admin/*`

## Variaveis de ambiente necessarias

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `OPENAI_API_KEY`
* `OPENAI_MODEL`
* `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
* `STRIPE_SECRET_KEY`
* `STRIPE_WEBHOOK_SECRET`
* `STRIPE_PRICE_STARTER`
* `STRIPE_PRICE_PRO`
* `STRIPE_PRICE_PREMIUM`
* `STRIPE_PRO_FIRST_MONTH_COUPON_ID`
* `NEXT_PUBLIC_APP_URL`
* `ADMIN_EMAILS`
* `RESEND_API_KEY`, se e-mail real estiver habilitado
* `EMAIL_FROM`, se e-mail real estiver habilitado

## Sequencia de deploy controlado

1. Confirmar `git status` sem arquivos sensiveis.
2. Rodar validacao local completa.
3. Confirmar GitHub Actions verde no GitHub.
4. Revisar variaveis do ambiente Preview na Vercel.
5. Aplicar migrations no Supabase usado pelo Preview.
6. Criar deploy Preview.
7. Rodar smoke test Preview.
8. Corrigir ou bloquear se houver P0/P1 critico.
9. Revisar variaveis de Production na Vercel.
10. Promover para Producao apenas se Preview estiver aprovado.
11. Rodar smoke test de Producao.
12. Iniciar monitoramento de 72 horas.

## Criterios de rollback

Usar `docs/version-1.1-rollback-criteria.md`. Rollback imediato se houver vazamento de secret, vazamento de dados, admin exposto, falha recorrente em rota critica, login/cadastro quebrado, dashboard quebrado, IA indisponivel para multiplos usuarios, checkout quebrado ou webhook quebrado.

