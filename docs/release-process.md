# Processo de Release - AtendeZap IA

## Objetivo

Garantir que cada versao enviada para producao seja segura, validada e documentada.

## Antes da release

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

## Depois da release

- atualizar changelog
- atualizar `docs/final-qa-report.md`
- atualizar auditoria
- documentar incidentes, se houver
- revisar metricas
- monitorar suporte
- decidir proxima prioridade

## Aprovacao pre-escala

Antes de aumentar campanhas, preencher `docs/pre-scale-approval-checklist.md`.

- P0 bloqueia release.
- P1 bloqueia campanha maior.
- P2 pode seguir para backlog se nao afetar seguranca, billing, privacidade ou fluxo principal.
