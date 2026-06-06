# Gestão de Roadmap - AtendeZap IA

## Fontes do roadmap

- feedbacks
- suporte
- churn
- campanhas
- métricas
- bugs
- ideias internas

## Status possíveis

- new
- reviewing
- planned
- in_progress
- shipped
- rejected
- archived

## Como decidir prioridade

- impacto no usuário
- impacto na receita
- impacto na segurança
- impacto na ativação
- esforço estimado
- recorrência do problema

## O que não priorizar agora

- CRM completo
- integração direta com WhatsApp
- automações avançadas
- múltiplos atendentes
- app mobile

## Intake pos-escala

- Registrar pendencias apenas com evidencia agregada de `docs/cautious-scale-analysis.md` e `docs/operational-stability-report.md`.
- Priorizar P0/P1 antes de novo criativo, novo nicho ou aumento de orcamento.
- Planejar a versao 1.1 quando produto, billing, IA e suporte estiverem estaveis.
- Manter fora do roadmap imediato qualquer CRM, WhatsApp API, automacao complexa ou BI avancado.

## Fechamento da versao 1.1

- Status: 1.1 entregue em 2026-06-02 como release estavel com observacoes.
- Item shipped: correcao P1 para impedir exposicao de `admin_notes` no suporte do usuario.
- Item shipped: documentacao final da 1.1, incluindo plano de execucao, relatorio final e QA.
- P0 atual: nenhum confirmado.
- P1 operacional: validar provedores reais e RLS em staging/producao antes de nova escala.
- P2: smoke visual e mobile nas superficies publicas e privadas.
- Fora do escopo atual: WhatsApp API, CRM, automacao complexa, multiplos atendentes, app mobile e BI avancado.

## Planejamento da versao 1.2

- Status permitido: `planned` enquanto a 1.2 nao for executada.
- Entrada principal: `docs/version-1.2-intake-criteria.md`.
- Backlog filtrado: `docs/version-1.2-backlog.md`.
- Metricas: `docs/version-1.2-success-metrics.md`.
- Planejamento de campanha: `docs/post-1.2-campaign-plan.md`.
- Nao mover itens para `shipped` antes de QA, changelog e release notes finais.
- Itens sem dado agregado suficiente devem ficar como `reviewing` ou `planned`, nunca como conclusao de produto.

## Fechamento da versao 1.2

- Status permitido: `shipped` para itens entregues e validados localmente na 1.2.
- Status geral: aprovado com observacoes para deploy controlado.
- Manter como `planned` ou `reviewing` para 1.3: validacao real de Stripe, Supabase RLS, OpenAI, Resend, tracking e admin no ambiente final.
- Manter como `blocked` para escala: campanha maior sem smoke pos-deploy, primeiras 72h e dados agregados suficientes.
- Fora do roadmap imediato: WhatsApp API, CRM completo, automacao complexa, multiplos atendentes e app mobile.

## Planejamento da versao 1.3

- Status permitido: `planned` enquanto a 1.3 estiver apenas planejada.
- Entrada principal: `docs/version-1.3-intake-criteria.md`.
- Backlog filtrado: `docs/version-1.3-backlog.md`.
- Priorizacao: `docs/version-1.3-prioritization.md`.
- Metricas: `docs/version-1.3-success-metrics.md`.
- Roadmap: `docs/version-1.3-roadmap.md`.
- Planejamento de campanha: `docs/version-1.3-campaign-plan.md`.
- Release: `docs/version-1.3-release-checklist.md` e `docs/release-notes-1.3-draft.md`.
- Itens selecionados devem resolver validacao real, P0/P1, ativacao, retencao, conversao, IA/custo, billing, suporte, tracking ou campanha pequena.
- Itens sem dado agregado suficiente ficam como `reviewing`, nao como conclusao de produto.
- Itens fora do escopo permanecem `rejected` ou fora do ciclo: WhatsApp API, CRM completo, automacao complexa, multiplos atendentes, app mobile, marketplace de templates e BI avancado.
