# Roadmap Pos-1.0

Este roadmap registra evolucoes depois da versao 1.0. Ele nao altera o escopo do MVP atual.

## Prioridade alta

- Melhorar ativacao. Implementado na 1.1 como fluxo leve e checklist, com monitoramento pendente em dados reais.
- Melhorar qualidade das respostas. Implementado na 1.1 com templates, feedback agregado e controle de limites.
- Melhorar onboarding. Implementado na 1.1 como orientacao inicial; acompanhar dados reais antes de nova mudanca.
- Melhorar relatorios admin. Implementado na 1.1 com relatorios agregados, campanhas, suporte, insights e saude operacional.
- Corrigir bugs P0/P1. P1 de suporte corrigido na 1.1; nenhum P0 confirmado na revisao local.
- Melhorar mobile. Revisado documentalmente; validacao visual real segue pendente.
- Consolidar versao 1.1 com analise pos-escala, estabilidade operacional e criterios de release. Implementado.

## Prioridade media

- Templates por nicho. Implementado.
- Biblioteca de templates prontos. Implementado nesta etapa.
- Biblioteca de respostas. Implementado nesta etapa.
- Respostas favoritas/salvas. Implementado nesta etapa.
- Respostas salvas editaveis. Implementado.
- Criacao manual de respostas. Implementado.
- Duplicacao de respostas/templates salvos. Implementado.
- Favoritos na biblioteca. Implementado nesta etapa.
- Filtros avancados simples por categoria, origem, favoritos e busca. Implementado nesta etapa.
- Acesso rapido a respostas favoritas no dashboard. Implementado nesta etapa.
- Sequencia de e-mails.
- Exportacao de historico.
- Tags/categorias avancadas de respostas.

## Futuro

- Integracao direta com WhatsApp.
- CRM.
- Multiplos atendentes.
- Automacoes.
- Webhooks externos.
- App mobile.
- Planos anuais.

## Melhorias operacionais

- Monitoramento avancado.
- Alertas automaticos.
- Dashboard financeiro.
- Relatorio de churn.
- Relatorio de retencao.

## Melhorias de produto

- Respostas favoritas. Implementado como biblioteca simples de respostas salvas.
- Biblioteca de respostas. Implementado.
- Templates prontos por nicho. Implementado.
- Personalizacao da biblioteca: criar, editar, duplicar, excluir, copiar e filtrar respostas salvas. Implementado.
- Organizacao da biblioteca com favoritos, ordenacao simples e acesso rapido no dashboard. Implementado.
- Avaliacao da resposta.
- Sequencia de e-mails.

## Melhorias futuras de IA

- Templates avancados por nicho.
- Templates favoritos.
- Templates por campanha.
- Templates por objecao.
- Templates com variaveis automaticas.
- Tags avancadas para respostas salvas.
- Pastas para biblioteca.
- Respostas mais usadas com base em `copy_count`.
- Sugestoes automaticas de favoritos.
- Templates por equipe, se um dia houver equipes.
- Busca avancada em respostas salvas.
- Respostas compartilhadas, se um dia houver equipes.
- Ajuste de tom por resposta.
- Avaliacao com estrelas.
- Sugestoes de melhoria automatica.
- Respostas salvas por categoria avancada.

## Melhorias comerciais

- Planos anuais.
- Campanhas segmentadas.
- Pagina por nicho.
- Prova social real.
- Estudos de caso.
- Novos criativos e novos nichos somente depois de dados agregados suficientes da escala cautelosa.

## Versao 1.1 estavel

- Status: entregue em 2026-06-02 com observacoes.
- Correcao P1 entregue: notas internas de suporte nao aparecem para usuario comum.
- Ativacao, onboarding, copy, billing, IA, suporte, campanhas e admin revisados sem ampliar escopo.
- Relatorios internos mantidos simples, agregados e sem BI avancado.
- Fechamento registrado em `docs/version-1.1-execution-plan.md`, `docs/version-1.1-final-report.md`, `docs/version-1.1-qa-report.md` e `docs/version-1.1-release-checklist.md`.

## Pendencias para 1.2 ou operacao

- P0: nenhum item aberto confirmado.
- P1: validar Stripe, Supabase RLS, OpenAI, Resend, tracking, admin e health check em staging/producao antes de nova escala.
- P2: validar visualmente paginas publicas, dashboard, assinatura, suporte e admin em mobile/tablet/desktop.
- P3: avaliar alertas automaticos, custo interno de IA e novos nichos apenas com volume real.
- Fora do escopo atual: WhatsApp API, CRM completo, automacoes avancadas, multiplos atendentes, app mobile e BI avancado.

## Versao 1.2 planejada

- Status: planejada, nao entregue.
- Objetivo: crescimento controlado, retencao, conversao e operacao com base nos aprendizados da 1.1.
- Sprint 1: estabilidade, billing, IA, suporte, tracking, RLS e provedores reais.
- Sprint 2: ativacao, primeira resposta, templates recomendados, dashboard inicial e retencao 7 dias.
- Sprint 3: conversao, paginas por nicho, pricing, CTA pos-demo e campanha pequena.
- Sprint 4: operacao, auditoria, QA, release notes e checklist de release.
- Documentos de referencia: `docs/version-1.2-plan.md`, `docs/version-1.2-roadmap.md`, `docs/version-1.2-backlog.md`, `docs/version-1.2-success-metrics.md` e `docs/version-1.2-release-checklist.md`.
- Admin/relatorios: bloco "Planejamento 1.2" fica documentado como pendencia simples; implementar apenas se couber no admin atual sem criar painel paralelo.

## Sprint 1 da versao 1.2

- Status: concluida com pendencias externas.
- Entregue: auditoria local de billing, webhook, assinatura, IA/limites, tracking, logs, health check e admin.
- Entregue: hardening de tracking seguro para remover e-mail em valores genericos, telefone e WhatsApp.
- Entregue: testes adicionais de tracking, IA/limites e health check.
- Proxima etapa: Sprint 2 para ativacao e retencao, condicionada a manter validacoes verdes.

## Regra de priorizacao

Antes de adicionar funcionalidade grande, validar se ela resolve um gargalo real visto em suporte, admin, feedbacks, campanhas ou uso dos primeiros clientes.
