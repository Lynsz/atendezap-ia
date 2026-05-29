# Documentacao AtendeZap IA

Este indice aponta os documentos principais para operar a versao 1.0. Documentos historicos de validacao e campanha devem ser preservados, mas os links abaixo sao o ponto de entrada recomendado.

## Operacao

- [backup-strategy](backup-strategy.md)
- [disaster-recovery](disaster-recovery.md)
- [monthly-backup-checklist](monthly-backup-checklist.md)
- [safe-migrations](safe-migrations.md)
- [rls-review-checklist](rls-review-checklist.md)
- [stripe-reconciliation](stripe-reconciliation.md)
- [subscription-lifecycle](subscription-lifecycle.md)
- [failed-payments](failed-payments.md)
- [churn-analysis](churn-analysis.md)
- [data-retention](data-retention.md)
- [data-inventory](data-inventory.md)
- [privacy-policy](privacy-policy.md)
- [terms-of-use](terms-of-use.md)
- [lgpd-compliance](lgpd-compliance.md)
- [data-export-process](data-export-process.md)
- [data-deletion-process](data-deletion-process.md)
- [support-workflow](support-workflow.md)
- [product-faq](product-faq.md)
- [internal-support-playbook](internal-support-playbook.md)
- [user-activation](user-activation.md)
- [activation-emails](activation-emails.md)
- [internal-metrics](internal-metrics.md)
- [weekly-business-review](weekly-business-review.md)
- [business-health-criteria](business-health-criteria.md)
- [monthly-business-report-template](monthly-business-report-template.md)
- [critical-api-security-review](critical-api-security-review.md)
- [environments](environments.md)
- [operations-1.0](operations-1.0.md)
- [production-readiness](production-readiness.md)
- [staging-checklist](staging-checklist.md)
- [production-deploy-checklist](production-deploy-checklist.md)
- [post-deploy-smoke-test](post-deploy-smoke-test.md)
- [go-live-checklist](go-live-checklist.md)
- [monitoring](monitoring.md)
- [production-monitoring](production-monitoring.md)
- [daily-ops-checklist](daily-ops-checklist.md)
- [critical-failure-checklist](critical-failure-checklist.md)
- [safe-logging](safe-logging.md)
- [error-messages](error-messages.md)
- [support](support.md)
- [rollback-plan](rollback-plan.md)
- [health-check](health-check.md)
- [weekly-maintenance-checklist](weekly-maintenance-checklist.md)
- [incident-response](incident-response.md)
- [incident-log](incident-log.md)
- [cost-monitoring](cost-monitoring.md)
- [internal-faq](internal-faq.md)

## Integracoes

- [vercel-env-vars](vercel-env-vars.md)
- [stripe](stripe-setup.md)
- [supabase](supabase-setup.md)
- [openai](openai-production.md)
- [resend](resend-setup.md)
- [tracking](tracking.md)

## Produto

- [version-1.0](version-1.0.md)
- [roadmap-post-1.0](roadmap-post-1.0.md)
- [product-metrics](product-metrics.md)
- [internal-metrics](internal-metrics.md)
- [weekly-business-review](weekly-business-review.md)
- [business-health-criteria](business-health-criteria.md)
- [monthly-business-report-template](monthly-business-report-template.md)
- [feedback](first-users-feedback.md)
- [retention-plan](retention-plan.md)
- [ai-response-quality-plan](ai-response-quality-plan.md)
- [ai-business-templates](ai-business-templates.md)
- [saved-responses](saved-responses.md)
- [whatsapp-templates](whatsapp-templates.md)

## Campanhas

- [first-paid-campaign-plan](first-paid-campaign-plan.md)
- [second-campaign-analysis](second-campaign-analysis.md)
- [cautious-scale-plan](cautious-scale-plan.md)

## Seguranca e testes

- [security](security.md)
- [privacy-policy](privacy-policy.md)
- [terms-of-use](terms-of-use.md)
- [lgpd-compliance](lgpd-compliance.md)
- [data-inventory](data-inventory.md)
- [testing](testing.md)
- [stability-criteria](stability-criteria.md)

## Documentos principais por assunto

- Deploy: use `deploy-vercel.md` como guia principal. `vercel-deploy.md`, `staging-deploy.md`, `staging-vercel-checklist.md` e `deploy-troubleshooting.md` complementam cenarios especificos.
- Operacao 1.0: use `operations-1.0.md`, `weekly-maintenance-checklist.md`, `incident-response.md`, `incident-log.md` e `internal-faq.md`.
- Stripe: use `stripe-setup.md` para setup, `stripe-env.md` para variaveis e `stripe-validation-checklist.md` para validacao.
- Supabase: use `supabase-setup.md`, `supabase-security.md` e `supabase-production-checklist.md`.
- Backup e recuperacao: use `backup-strategy.md`, `disaster-recovery.md` e `monthly-backup-checklist.md`.
- Migrations e RLS: use `safe-migrations.md`, `rls-review-checklist.md` e `critical-api-security-review.md`.
- Stripe/Supabase: use `stripe-reconciliation.md` para reconciliar divergencias operacionais.
- Assinaturas e churn: use `subscription-lifecycle.md`, `failed-payments.md` e `churn-analysis.md`.
- Retencao: use `data-retention.md` para orientar limpeza futura e dados que nao devem ir para analytics/logs.
- Privacidade/LGPD: use `data-inventory.md`, `privacy-policy.md`, `terms-of-use.md`, `lgpd-compliance.md`, `data-export-process.md` e `data-deletion-process.md`.
- OpenAI: use `openai-production.md` para producao e custo.
- Resend: use `resend-setup.md`, `emails.md` e `email-funnel-checklist.md`.
- Tracking: use `tracking.md` como fonte principal; `tracking-setup.md` e `tracking-production.md` complementam validacao.
- Custos: use `cost-monitoring.md` junto com dashboards dos provedores.
- Retencao e qualidade: use `user-activation.md`, `activation-emails.md`, `retention-plan.md`, `ai-response-quality-plan.md`, `ai-business-templates.md`, `saved-responses.md` e `whatsapp-templates.md`.
- Relatorios internos: use `internal-metrics.md`, `weekly-business-review.md`, `business-health-criteria.md` e `monthly-business-report-template.md`.
- Seguranca: use `SECURITY.md` na raiz como fonte completa; `docs/security.md` e `docs/security-checklist.md` sao entradas auxiliares.
- Campanhas: use `first-paid-campaign-plan.md`, `second-campaign-analysis.md`, `scale-decision-matrix.md` e `cautious-scale-plan.md`.
- Suporte: use `support-workflow.md`, `product-faq.md`, `internal-support-playbook.md`, `support.md`, `support-messages.md` e `launch-bugs.md`.

## Observacao sobre documentos legados

Alguns documentos registram fases anteriores, staging, primeira campanha, segunda campanha e checklists intermediarios. Eles nao devem ser apagados automaticamente porque preservam contexto operacional. Quando houver duvida, priorize os documentos listados neste indice e use os demais como historico.
