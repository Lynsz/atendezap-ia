# Processo de Release - AtendeZap IA

## Objetivo

Garantir que cada versao enviada para producao seja segura, validada e documentada.

## Antes da release

- revisar `docs/version-1.2-controlled-deploy.md` quando a release for a 1.2 ou posterior
- preencher validacao de staging antes de producao
- revisar `docs/release-candidate.md`
- preencher `docs/release-candidate-checklist.md`
- executar `docs/manual-qa-plan.md` em staging quando houver mudanca de fluxo principal
- classificar bugs em `docs/release-blockers.md`
- revisar backlog
- revisar bugs P0/P1
- revisar secrets
- rodar `npm run validate`
- testar em staging
- revisar checkout
- revisar geracao de IA
- revisar login
- revisar dashboard
- revisar logs
- atualizar documentacao

## Durante a release

- fazer deploy controlado
- acompanhar logs
- rodar smoke test
- testar fluxo principal
- validar health check
- nao ativar campanha antes de aprovar smoke pos-deploy

## Depois da release

- atualizar changelog
- atualizar `docs/final-qa-report.md`
- atualizar auditoria
- documentar incidentes, se houver
- revisar metricas
- monitorar suporte
- decidir proxima prioridade
- monitorar primeiras 24h e 72h conforme runbook da versao
- preencher relatorio pos-release antes de campanha

## Aprovacao pre-escala

Antes de aumentar campanhas, preencher `docs/pre-scale-approval-checklist.md`.

Para a campanha pos-1.2, preencher tambem `docs/post-1.2-campaign-approval-checklist.md`.

- P0 bloqueia release.
- P1 bloqueia campanha maior.
- P2 pode seguir para backlog se nao afetar seguranca, billing, privacidade ou fluxo principal.
