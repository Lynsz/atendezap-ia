# Processo de Release - AtendeZap IA

## Objetivo

Garantir que cada versão enviada para produção seja segura, validada e documentada.

## Antes da release

- revisar backlog
- revisar bugs P0/P1
- revisar secrets
- rodar npm run validate
- testar em staging
- revisar checkout
- revisar geração de IA
- revisar login
- revisar dashboard
- revisar logs
- atualizar documentação

## Durante a release

- fazer deploy controlado
- acompanhar logs
- rodar smoke test
- testar fluxo principal
- validar health check

## Depois da release

- atualizar changelog
- atualizar auditoria
- documentar incidentes, se houver
- revisar métricas
- monitorar suporte
- decidir próxima prioridade
