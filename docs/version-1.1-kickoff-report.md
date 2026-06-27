# Kickoff da Versao 1.1 - AtendeZap IA

## Status

- status: planejada
- recomendacao: iniciar apenas como consolidacao operacional
- P0 confirmado: nenhum
- P1 confirmado por dado real: nenhum
- pendencias operacionais: existem e devem abrir a primeira etapa da 1.1

## Contexto

A operacao pos-MVP esta documentada, mas os relatorios consultados ainda nao trazem metricas reais preenchidas. A 1.1 deve partir dessa lacuna: validar ambiente real, medir funil, categorizar suporte, acompanhar custo OpenAI e fazer melhorias pequenas com base em evidencia.

## Objetivo da 1.1

Consolidar o MVP para operacao controlada, mantendo o produto simples e vendavel, sem adicionar WhatsApp API, CRM, app mobile, automacao complexa ou campanha grande.

## Escopo aprovado

- Validacao real de ambiente.
- Medicao minima de ativacao.
- Monitoramento operacional de billing.
- Monitoramento de custo OpenAI.
- Categorizacao de suporte.
- Melhorias pequenas de onboarding, copy, prompt e templates quando houver evidencia.
- Documentacao operacional e relatorios internos simples.

## Fora do escopo

- Integracao direta com WhatsApp.
- Envio automatico de mensagens.
- CRM completo.
- Multiplos atendentes.
- App mobile.
- BI avancado.
- Automacoes avancadas.
- Escala ampla ou campanha grande.

## Entradas

- `docs/post-mvp-operation-analysis.md`
- `docs/version-1.1-prioritization.md`
- `docs/version-1.1-plan.md`
- `docs/version-1.1-checklist.md`
- `docs/version-1.1-roadmap.md`
- `docs/version-1.1-exit-criteria.md`
- `docs/post-mvp-backlog.md`

## Proxima acao recomendada

Executar a Fase 1 do roadmap: smoke autenticado, RLS real, Stripe real/test mode, OpenAI, Resend e GitHub Actions. Sem essa etapa, a 1.1 deve permanecer em planejamento/observacao.

