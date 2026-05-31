# Changelog

## [Unreleased]

### Adicionado

- Release Candidate privada `1.1.0-rc.1` documentada para validacao antes de aumentar campanhas.
- Plano de QA manual ponta a ponta.
- Matriz de bugs bloqueadores P0/P1/P2.
- Checklist de aprovacao pre-escala.
- Relatorio final de QA.
- Go-live controlado pos-Release Candidate.
- Checklist de aprovacao do go-live.
- Plano de deploy do go-live.
- Monitoramento das primeiras 72 horas.
- Campanha pequena pos-go-live.
- Criterios de pausa imediata.
- Relatorio diario e decisao pos-go-live.
- Checklist de tracking seguro do go-live.
- Relatorio 72h pos-go-live.
- Diagnostico pos-go-live.
- Matriz de decisao pos-go-live.
- Plano de correcoes pos-go-live.
- Plano da proxima campanha pequena.
- Aprendizados pos-go-live.
- Campanha pequena otimizada `campanha_otimizada_01`.

### Melhorado

- Processo de release passa a exigir checklist de Release Candidate, QA manual e revisao pre-escala.
- Admin ganhou secao simples "Go-Live" com cards agregados para acompanhamento controlado.
- Tracking client-side passa a emitir eventos seguros da campanha otimizada quando a UTM oficial esta presente.

### Corrigido

-

### Seguranca

- Criterios de release reforcam repositorio privado, secrets server-side, logs seguros e tracking sem conteudo sensivel.
- Go-live reforca pausa imediata para falha de checkout, webhook, IA, login, admin, dados expostos, custo anormal ou tracking quebrado.

### Documentacao

- `docs/release-candidate.md`
- `docs/release-candidate-checklist.md`
- `docs/manual-qa-plan.md`
- `docs/release-blockers.md`
- `docs/final-qa-report.md`
- `docs/pre-scale-approval-checklist.md`
- `docs/controlled-go-live.md`
- `docs/go-live-approval-checklist.md`
- `docs/go-live-deploy-plan.md`
- `docs/first-72-hours-monitoring.md`
- `docs/post-go-live-small-campaign.md`
- `docs/emergency-pause-criteria.md`
- `docs/go-live-daily-report-template.md`
- `docs/post-go-live-decision.md`
- `docs/go-live-tracking-checklist.md`
- `docs/optimized-small-campaign-plan.md`
- `docs/optimized-campaign-utm-links.md`
- `docs/optimized-campaign-test-matrix.md`
- `docs/optimized-campaign-copy.md`
- `docs/optimized-campaign-video-scripts.md`
- `docs/optimized-campaign-launch-checklist.md`
- `docs/optimized-campaign-report.md`

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
