# Documentacao AtendeZap IA

Este indice aponta os documentos principais para operar a versao 1.0. Documentos historicos de validacao e campanha devem ser preservados, mas os links abaixo sao o ponto de entrada recomendado.

## Operacao

- [operations-1.0](operations-1.0.md)
- [production-readiness](production-readiness.md)
- [go-live-checklist](go-live-checklist.md)
- [monitoring](monitoring.md)
- [support](support.md)
- [rollback-plan](rollback-plan.md)
- [weekly-maintenance-checklist](weekly-maintenance-checklist.md)
- [incident-response](incident-response.md)
- [incident-log](incident-log.md)
- [cost-monitoring](cost-monitoring.md)
- [internal-faq](internal-faq.md)

## Integracoes

- [stripe](stripe-setup.md)
- [supabase](supabase-setup.md)
- [openai](openai-production.md)
- [resend](resend-setup.md)
- [tracking](tracking.md)

## Produto

- [version-1.0](version-1.0.md)
- [roadmap-post-1.0](roadmap-post-1.0.md)
- [product-metrics](product-metrics.md)
- [feedback](first-users-feedback.md)
- [retention-plan](retention-plan.md)
- [ai-response-quality-plan](ai-response-quality-plan.md)
- [ai-business-templates](ai-business-templates.md)

## Campanhas

- [first-paid-campaign-plan](first-paid-campaign-plan.md)
- [second-campaign-analysis](second-campaign-analysis.md)
- [cautious-scale-plan](cautious-scale-plan.md)

## Seguranca e testes

- [security](security.md)
- [testing](testing.md)
- [stability-criteria](stability-criteria.md)

## Documentos principais por assunto

- Deploy: use `deploy-vercel.md` como guia principal. `vercel-deploy.md`, `staging-deploy.md`, `staging-vercel-checklist.md` e `deploy-troubleshooting.md` complementam cenarios especificos.
- Operacao 1.0: use `operations-1.0.md`, `weekly-maintenance-checklist.md`, `incident-response.md`, `incident-log.md` e `internal-faq.md`.
- Stripe: use `stripe-setup.md` para setup, `stripe-env.md` para variaveis e `stripe-validation-checklist.md` para validacao.
- Supabase: use `supabase-setup.md`, `supabase-security.md` e `supabase-production-checklist.md`.
- OpenAI: use `openai-production.md` para producao e custo.
- Resend: use `resend-setup.md`, `emails.md` e `email-funnel-checklist.md`.
- Tracking: use `tracking.md` como fonte principal; `tracking-setup.md` e `tracking-production.md` complementam validacao.
- Custos: use `cost-monitoring.md` junto com dashboards dos provedores.
- Retencao e qualidade: use `retention-plan.md`, `ai-response-quality-plan.md` e `ai-business-templates.md`.
- Seguranca: use `SECURITY.md` na raiz como fonte completa; `docs/security.md` e `docs/security-checklist.md` sao entradas auxiliares.
- Campanhas: use `first-paid-campaign-plan.md`, `second-campaign-analysis.md`, `scale-decision-matrix.md` e `cautious-scale-plan.md`.
- Suporte: use `support.md`, `support-messages.md` e `launch-bugs.md`.

## Observacao sobre documentos legados

Alguns documentos registram fases anteriores, staging, primeira campanha, segunda campanha e checklists intermediarios. Eles nao devem ser apagados automaticamente porque preservam contexto operacional. Quando houver duvida, priorize os documentos listados neste indice e use os demais como historico.
