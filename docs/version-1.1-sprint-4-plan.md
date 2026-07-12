# Sprint 4 - Billing, Admin e Operacao

## Objetivo

Melhorar billing, suporte, admin, metricas e operacao para deixar a versao 1.1 pronta para fechamento.

## Escopo

* pagina de assinatura
* planos e limites
* checkout Stripe
* portal Stripe
* webhook Stripe
* suporte
* feedback
* admin
* metricas operacionais
* monitoramento de custo OpenAI
* relatorios internos
* smoke test final da sprint

## Fora do escopo

* integracao com WhatsApp
* envio automatico
* CRM completo
* app mobile
* campanha grande
* redesign completo
* automacoes complexas

## Criterios de sucesso

* assinatura clara
* checkout seguro
* webhook validado
* limites por plano funcionando
* suporte funcional
* feedback funcional
* admin protegido
* metricas uteis e seguras
* custo OpenAI monitoravel
* CI verde
* build passando
* testes passando

## Evidencias lidas

* `docs/version-1.1-plan.md`
* `docs/version-1.1-roadmap.md`
* `docs/version-1.1-checklist.md`
* `docs/version-1.1-exit-criteria.md`
* `docs/version-1.1-sprint-2-report.md`
* `docs/version-1.1-sprint-3-report.md`
* `docs/version-1.1-sprint-3-smoke-test.md`
* `docs/stripe-billing-validation-report.md`
* `docs/openai-cost-monitoring.md`
* `docs/support-operations-playbook.md`
* `docs/post-mvp-operation-analysis.md`
* `docs/post-mvp-backlog.md`
* `docs/mvp-final-report.md`
* `README.md`
* `CHANGELOG.md`

## Observacoes da auditoria

* `docs/version-1.1-sprint-1-report.md` nao existe no repositorio.
* Billing local estava documentado como aprovado, sem pendencia bloqueante local.
* Checkout, portal e webhook ainda precisam de smoke no ambiente final.
* RLS com dois usuarios reais ainda precisa ser validado.
* Metricas reais de ativacao, suporte, billing, feedback e custo OpenAI seguem `nao medido` ou `nao disponivel`.
* A migration da Sprint 3 ainda precisa ser aplicada no Supabase real.
