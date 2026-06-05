# Changelog

## [Unreleased]

### Adicionado

- Execucao da campanha pos-1.2 preparada com plano, acompanhamento diario, checklist de ativacao, checklist de pausa e template de analise.
- Eventos seguros `post_12_campaign_page_view` e `post_12_campaign_cta_click`.
- Bloco agregado "Analise campanha pos-1.2" no admin existente.
- Analise da campanha pos-1.2 criada.
- Diagnostico do funil pos-1.2 criado.
- Plano de ajustes pos-campanha criado.
- Proxima variacao pos-1.2 planejada.
- Decisao de escala pos-1.2 documentada.
- Plano inicial da versao 1.3 criado, sem marcar a 1.3 como iniciada.

### Status

- Campanha continua bloqueada ate validacao real de producao e aprovacao operacional.
- Nenhuma escala ou conclusao de desempenho foi registrada.

## [1.2.0] - 2026-06-04

### Adicionado

- Admin de ativacao com metricas agregadas e diagnostico simples.
- Admin de conversao com metricas agregadas e diagnostico deterministico.
- Bloco admin "Release 1.2" para acompanhar deploy controlado com dados agregados.
- Eventos seguros de ativacao e conversao para demo, ebook, pricing, paginas por nicho, primeira resposta e checkout.
- Plano, QA final, checklist de deploy, smoke test, release notes finais, relatorio final, deploy controlado, monitoramento pos-release e criterios de rollback da versao 1.2.
- Analise pos-deploy da 1.2, diagnostico de estabilidade, matriz de decisao da campanha, checklist final de campanha e operacao diaria da campanha pos-1.2.

### Melhorado

- Onboarding, dashboard inicial, primeira resposta, templates recomendados e respostas favoritas.
- Pricing com Plano Pro recomendado, primeiro mes por R$ 29 para novos usuarios e recorrencia normal depois.
- CTA pos-demo, CTA pos-primeira resposta, funil do ebook e paginas por nicho.
- Campanha pequena pos-1.2 preparada com UTMs, guardrails e criterios de pausa.
- Campanha pos-1.2 condicionada a aprovacao em producao, smoke test e 72h de dados antes de qualquer escala.
- Decisao da campanha pos-1.2 documentada como bloqueada ate validacao real, monitoramento inicial e ausencia de P0/P1.

### Corrigido

- Tracking seguro reforcado para remover e-mail em valores genericos, telefone e WhatsApp.
- Testes reforcados para limite mensal bloqueando IA, falha de IA sem consumo e health check sem dados sensiveis.
- Fluxos protegidos de admin, checkout e portal seguem exigindo autenticacao/autorizacao.

### Seguranca

- Repositorio permanece privado.
- Sem instrucao para tornar o repositorio publico.
- Sem secrets reais ou `.env.local` adicionados.
- OpenAI, Stripe, Supabase service role e Resend permanecem server-side.
- Logs e analytics continuam sem conteudo completo de perguntas, respostas, mensagens, e-mails ou dados de pagamento.

### Documentacao

- `docs/release-notes-1.2.md`
- `docs/version-1.2-final-report.md`
- `docs/version-1.2-final-qa-plan.md`
- `docs/version-1.2-final-qa-report.md`
- `docs/version-1.2-deploy-checklist.md`
- `docs/version-1.2-smoke-test.md`
- `docs/version-1.2-sprint-4-plan.md`
- `docs/version-1.2-controlled-deploy.md`
- `docs/version-1.2-staging-validation.md`
- `docs/version-1.2-production-validation.md`
- `docs/version-1.2-post-release-monitoring.md`
- `docs/version-1.2-post-release-report.md`
- `docs/version-1.2-rollback-criteria.md`
- `docs/post-1.2-campaign-approval-checklist.md`
- `docs/version-1.2-post-deploy-analysis.md`
- `docs/version-1.2-stability-diagnosis.md`
- `docs/post-1.2-campaign-decision-matrix.md`
- `docs/version-1.2-post-deploy-fix-plan.md`
- `docs/post-1.2-final-campaign-launch-checklist.md`
- `docs/post-1.2-campaign-operations.md`
- `docs/post-1.2-campaign-daily-report-template.md`

### Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile

## [1.1.0] - 2026-06-02

### Adicionado

- Plano de execucao da versao 1.1.
- Relatorio final da versao 1.1.
- QA final documentado da versao 1.1.
- Analise da escala cautelosa, diagnostico de saude, matriz de decisao pos-escala e plano de ajustes.
- Relatorio de estabilidade operacional e checklist de release 1.1.

### Melhorado

- Criterios de escala cautelosa e pausa de campanhas.
- Processo de decisao pos-escala com foco em dados agregados.
- Documentacao de ativacao, billing, IA, suporte, campanhas, admin e prontidao.
- Roadmap e backlog para separar P0/P1/P2/P3 e fora do escopo atual.

### Corrigido

- A API e a tela de suporte do usuario nao retornam nem exibem mais notas internas de admin.

### Seguranca

- Repositorio permanece privado.
- Sem instrucao para tornar o repositorio publico.
- Sem secrets reais ou `.env.local` adicionados.
- Notas internas de suporte permanecem restritas ao admin protegido.
- Logs e tracking continuam sem conteudo completo de perguntas, respostas, mensagens, e-mails ou dados de pagamento.

### Documentacao

- `docs/version-1.1-execution-plan.md`
- `docs/version-1.1-final-report.md`
- `docs/version-1.1-qa-report.md`
- `docs/version-1.1-release-checklist.md`
- `docs/release-notes-1.1.md`
- `docs/project-audit.md`
- `docs/final-readiness-report.md`
- `docs/roadmap-post-1.0.md`
- `docs/roadmap-management.md`
- `docs/product-backlog.md`

## [1.1.0-rc.6] - em preparacao

### Inclui

- plano de escala cautelosa
- matriz de controle
- checklist diario
- relatorio de escala
- guardrails de orcamento
- plano de contingencia
- criterios da proxima etapa

### Status

- Release Candidate privada, ainda nao marcada como final.
- Decisao atual: manter campanha pequena e nao iniciar escala cautelosa ate produto, billing, IA, tracking, suporte e custos estarem controlados com dados agregados.

## [1.1.0-rc.5] - em preparacao

### Inclui

- analise da campanha pequena otimizada
- diagnostico do funil
- matriz de decisao
- plano de ajustes
- proxima variacao planejada
- comparativo de campanhas
- criterios de escala atualizados

### Status

- Release Candidate privada, ainda nao marcada como final.
- Decisao atual: Sem dados suficientes para escalar; ajustar e repetir pequena variacao apenas com tracking e funil validados.

## [1.1.0-rc.4] - em preparacao

### Inclui

- plano de campanha pequena otimizada
- links UTM para `campanha_otimizada_01`
- matriz de teste por nicho/criativo
- copies e roteiros de video sem promessa de automacao no WhatsApp
- checklist de lancamento e relatorio manual
- eventos `optimized_campaign_page_view` e `optimized_campaign_cta_click`

### Status

- Continua privado e sem escala.
- Campanha liberada apenas como teste pequeno, com `Sem dados suficientes` como conclusao inicial ate haver dados reais.

## [1.1.0-rc.3] - em preparacao

### Inclui

- relatorio 72h pos-go-live
- diagnostico pos-go-live
- matriz de decisao
- plano de correcoes
- plano da proxima campanha pequena
- aprendizados pos-go-live

### Status

- Release Candidate privada, ainda nao marcada como final.
- Exige dados reais agregados antes de decidir escala cautelosa.

## [1.1.0-rc.2] - em preparacao

### Inclui

- go-live controlado
- checklists de aprovacao
- monitoramento primeiras 72h
- campanha pequena pos-go-live
- criterios de pausa imediata
- relatorio diario
- decisao pos-go-live

### Status

- Release Candidate privada, ainda nao marcada como final.
- Exige staging verde, smoke test e monitoramento inicial antes de campanha pequena.

## [1.1.0-rc.1] - em preparacao

### Inclui

- melhorias de UX
- paginas por nicho
- controle de uso
- suporte
- privacidade
- relatorios
- campanhas internas
- seguranca
- documentacao

### Status

- Release Candidate privada, ainda nao marcada como final.
- Exige validacao em staging antes de liberar campanha maior.

## 1.0.0

### Adicionado

- Landing page.
- Funil do ebook.
- Demo publica.
- Dashboard.
- Onboarding.
- Geracao de respostas com IA.
- Historico.
- Stripe billing.
- Admin.
- Feedback.
- Tracking.
- Documentacao operacional.

### Seguranca

- Middleware/protecao de rotas.
- RLS/Supabase.
- Rate limit.
- Variaveis protegidas.
- Webhook Stripe validado.

### Documentacao

- Deploy.
- Stripe.
- Supabase.
- OpenAI.
- Resend.
- Tracking.
- Producao.
- Campanhas.
