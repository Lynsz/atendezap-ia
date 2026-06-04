# Deploy Controlado - Versao 1.2 AtendeZap IA

## Objetivo

Publicar a versao 1.2 de forma controlada, com validacao em staging, smoke test em producao e monitoramento antes de ativar campanha.

## Status

- nao iniciado
- staging em validacao
- staging aprovado
- producao em deploy
- producao em validacao
- aprovado
- bloqueado
- rollback aplicado

## Status atual

- nao iniciado

## Pre-requisitos

- npm run validate passou
- check:secrets passou
- GitHub Action passou
- QA final aprovado
- sem bugs P0
- sem bugs P1 graves
- release notes finalizadas
- rollback disponivel
- variaveis da Vercel revisadas

## Decisao

- liberar staging
- bloquear staging
- liberar producao
- bloquear producao
- aplicar rollback
- liberar campanha pequena pos-1.2

## Riscos conhecidos

- Stripe, webhook, portal e dunning precisam de validacao real/test mode.
- Supabase RLS precisa ser validado com dois usuarios reais.
- OpenAI e Resend dependem das variaveis reais do ambiente.
- Tracking precisa ser conferido no dominio final.
- Campanha pos-1.2 continua bloqueada ate smoke pos-deploy aprovado.

## Analise pos-deploy

- Relatorio: `docs/version-1.2-post-deploy-analysis.md`.
- Diagnostico: `docs/version-1.2-stability-diagnosis.md`.
- Decisao de campanha: `docs/post-1.2-campaign-decision-matrix.md`.

Status atual: campanha pos-1.2 bloqueada ate validacao real de producao, monitoramento inicial e ausencia de P0/P1.

Proximos passos:

- preencher validacao de staging
- preencher validacao de producao
- revisar health check, logs, IA, billing, Resend, tracking, suporte e admin
- preencher relatorio pos-release
- aprovar ou bloquear campanha pequena com base nos dados reais
