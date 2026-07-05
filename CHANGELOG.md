# Changelog

## [Unreleased]

## [Version 1.1 Sprint 3]

### Melhorado

- Resposta gerada no dashboard pode ser revisada e ajustada antes de copiar ou salvar.
- Templates recomendados agora podem ser usados como base editavel, sem envio automatico.
- Admin de qualidade da IA prioriza motivos negativos agregados em vez de comentario livre.

### Templates

- Templates por nicho revisados para evitar promessa automatica de horario, garantia, estoque, entrega, prazo, pagamento ou desconto.
- Testes reforcam nichos minimos, campos obrigatorios, IDs unicos, filtros e promessas proibidas obvias.

### Biblioteca

- Fluxos existentes de salvar, editar, copiar, favoritar e excluir foram preservados com tracking seguro atualizado.
- Eventos de biblioteca normalizados para `saved_response_created`, `saved_response_copied`, `saved_response_edited`, `saved_response_favorited` e `saved_response_deleted`.

### IA

- Prompt server-side reforcado para respostas curtas, naturais, em portugues do Brasil e sem informacoes comerciais inventadas.
- Orientacao tipada por nicho adicionada para delivery, restaurante, estetica, loja, assistencia tecnica, prestador de servico, autonomo e geral.
- Feedback negativo ganhou motivo categorizado.

### Seguranca

- Tracking da Sprint 3 aceita apenas metadata categorica e bloqueia pergunta completa, resposta completa, comentario livre, contato, tokens, secrets e dados de pagamento.
- OpenAI permanece server-side e `user_id` continua vindo da sessao nas rotas sensiveis.
- Migration adiciona `feedback_reason` e eventos seguros da Sprint 3 sem desativar RLS.

### Pendencias

- Smoke autenticado em Preview/Producao.
- Validacao de RLS real com dois usuarios.
- Aplicar migration da Sprint 3 no Supabase real.
- Consolidar metricas reais de qualidade da IA e uso de templates antes de novos ajustes.

## [Version 1.1 Sprint 2]

### Melhorado

- Cadastro, login, onboarding e dashboard inicial revisados para reduzir friccao de ativacao.
- Onboarding inicial simplificado para nome do negocio, tipo, descricao curta e tom.
- Campo de mensagem do cliente no dashboard com placeholder, contador e limite alinhado a API.
- Exemplos rapidos por nicho preenchem o campo sem gerar resposta automaticamente.
- Primeira resposta reforca revisar, ajustar, copiar e enviar manualmente pelo WhatsApp.

### Corrigido

- Eventos de ativacao da Sprint 2 adicionados a allowlist segura de analytics e migration do Supabase.
- Admin existente passou a contar eventos novos de ativacao nos agregados operacionais.

### Acessibilidade

- Cadastro usa `role="alert"` e `role="status"` para feedback.
- Campo de mensagem do cliente usa `aria-describedby` para ajuda e contador.

### Ativacao

- Checklist de primeiros passos extraido para componente dedicado.
- Eventos seguros adicionados: `activation_signup_completed`, `activation_onboarding_started`, `activation_onboarding_completed`, `activation_dashboard_viewed`, `activation_first_response_generated`, `activation_first_response_copied`, `activation_first_response_saved` e `activation_templates_viewed`.
- Eventos continuam sem pergunta completa, resposta completa, e-mail, telefone, tokens, secrets ou dados de pagamento.

### Pendencias

- Smoke autenticado em Preview/Producao.
- Validacao de RLS real com dois usuarios.
- Consolidacao de metricas reais de ativacao antes de novas melhorias.

## [Version 1.1 Planning]

### Adicionado

- Analise da operacao pos-MVP em `docs/post-mvp-operation-analysis.md`.
- Priorizacao, checklist, roadmap, criterios de saida e kickoff da versao 1.1.
- Secao de planejamento da versao 1.1 no README.

### Alterado

- Plano da versao 1.1 atualizado para tratar a release como consolidacao operacional baseada em dados reais.
- Backlog pos-MVP classificado em P0, P1, P2, Futuro e Nao fazer agora.

### Decidido

- Nenhum P0 confirmado na analise documental.
- 1.1 deve priorizar validacao real, ativacao, billing, suporte, feedback, custo OpenAI e documentacao.
- Dados ausentes devem permanecer como `nao disponivel` ou `nao medido`.

### Fora do escopo

- WhatsApp API, envio automatico, CRM completo, app mobile, automacoes complexas, BI avancado, campanha grande e escala sem dados.

### Pendencias

- Rodar smoke autenticado em Preview/Producao.
- Validar Supabase RLS com dois usuarios reais.
- Validar Stripe Checkout, Customer Portal e webhook assinado.
- Confirmar OpenAI, Resend, GitHub Actions e metricas reais no ambiente final.

## [Post-MVP Controlled Operation]

### Adicionado

- Plano de operacao controlada pos-MVP, checklist diario, template semanal, matriz de incidentes, monitoramento de custo OpenAI, playbook de suporte, backlog pos-MVP e criterios de entrada da versao 1.1.
- Eventos seguros `post_mvp_*` para cadastro, onboarding, primeira resposta, copia, salvamento, templates, pricing, checkout, feedback, suporte, limite atingido e erro operacional.
- Migration para permitir eventos `post_mvp_*` em `app_events`.

### Corrigido

- Nenhum P0/P1 confirmado nos documentos finais foi encontrado para correcao imediata.

### Segurança

- Eventos pos-MVP usam a mesma sanitizacao de metadata segura, bloqueando pergunta completa, resposta completa, e-mail, telefone, tokens, secrets e dados de pagamento.
- Admin continua protegido por `requireAdmin`; usuario comum permanece bloqueado.

### Operacao

- Admin passa a considerar eventos pos-MVP nas metricas de pricing, checkout, primeira resposta e respostas salvas.
- README documenta operacao controlada, sem campanha grande, sem integracao com WhatsApp e sem CRM completo.

### Pendencias

- Rodar smoke autenticado em Preview/Producao.
- Validar RLS no Supabase real com dois usuarios.
- Validar Stripe checkout teste, portal e webhook assinado no ambiente real.
- Confirmar CI verde no GitHub.

## [MVP Final]

### Adicionado

- Checklist final, smoke test final, relatorio final, decisao final e plano pos-MVP.

### Corrigido

- Pagina `/status` deixou de consultar e exibir estado de configuracao de Supabase, OpenAI e Stripe.

### Seguranca

- Auditoria final manteve secrets fora do client e reforcou teste para `/status` nao referenciar chaves sensiveis.
- Decisao final preserva repositorio privado, `.env.local` fora do Git e eventos sem pergunta/resposta completa.

### Operacao

- Fechamento final do MVP marcado como bloqueado ate smoke autenticado em Preview/Producao, RLS real com dois usuarios e Stripe teste/webhook assinado.

### Validacao

- Documentos finais consolidados a partir dos relatorios de CI, seguranca, OpenAI, Stripe, Supabase/RLS, beta fechado e lancamento pequeno.

### Pendencias conhecidas

- Confirmar GitHub Actions verde no GitHub.
- Rodar smoke autenticado em Preview/Producao.
- Validar Supabase/RLS no banco real com dois usuarios.
- Validar Stripe checkout teste, portal e webhook assinado no ambiente real.

## [Small Launch Analysis]

### Corrigido

- Copy de configuracoes ajustada para evitar expectativa de automacao do produto.

### Melhorado

- Analise pos-lancamento pequeno, diagnostico do funil, priorizacao de bugs, decisao pos-lancamento, plano de correcao e plano da proxima rodada criados.
- Acompanhamento do lancamento pequeno atualizado para explicitar metricas nao medidas ou nao disponiveis.

### Seguranca

- Decisao manteve o repositorio privado, sem secrets versionados e sem dados sensiveis em eventos.
- Nenhuma mudanca expôs OpenAI, Stripe ou Supabase service role no client.

### Operacao

- Decisao registrada: repetir lancamento pequeno apos smoke autenticado em Preview/Producao.
- MVP final nao foi marcado como fechado por falta de metricas reais e validacao real de ambiente.

### Pendencias

- Rodar smoke autenticado em Preview/Producao.
- Validar Supabase/RLS com dois usuarios reais.
- Validar OpenAI, Stripe checkout, portal, webhook, suporte, feedback, admin e `/api/health` em ambiente real.

## [Small Launch Execution]

### Adicionado

- Checklist de ativacao, acompanhamento ao vivo, relatorio Dia 1, resposta rapida a incidentes e decisao de execucao do lancamento pequeno.
- Tracking server-side seguro para `small_launch_first_response_generated`, `small_launch_usage_limit_reached`, `small_launch_checkout_started` e `small_launch_support_request_created`.

### Corrigido

- Monitoramento de checkouts no admin agora considera tambem `small_launch_checkout_started`.

### Seguranca

- Eventos reforcados usam apenas metadados permitidos como plano, origem, pagina, categoria, tipo de negocio, faixa de tamanho e limites de uso.
- Nenhum secret, token, payload Stripe completo, pergunta completa ou resposta completa foi adicionado aos eventos.

### Operacao

- Decisao operacional registrada como `corrigir e continuar`, mantendo divulgacao bloqueada ate smoke test autenticado em Preview/Producao.
- Relatorios seguem sem inventar metricas: campos sem evidencia real foram marcados como `nao disponivel`.

### Pendencias

- Rodar smoke test autenticado em Preview/Producao com Supabase, OpenAI, Stripe, suporte, feedback, admin e `/api/health`.
- Confirmar RLS com dois usuarios reais e aplicar migrations no Supabase real antes de divulgar.

## [Small Controlled Launch Preparation]

### Adicionado

- Plano de lancamento pequeno controlado, checklist pre-lancamento, mensagens de convite, template de relatorio diario e criterios de decisao.
- Eventos seguros `small_launch_signup_completed`, `small_launch_onboarding_completed`, `small_launch_first_response_generated`, `small_launch_response_copied`, `small_launch_response_saved`, `small_launch_template_used`, `small_launch_pricing_viewed`, `small_launch_checkout_started`, `small_launch_feedback_submitted`, `small_launch_support_request_created` e `small_launch_usage_limit_reached`.
- Migration para permitir eventos `small_launch_*` em `app_events`.

### Corrigido

- Nenhum P0/P1 confirmado foi encontrado nos relatorios finais lidos para correcao imediata.

### Melhorado

- Tracking do lancamento pequeno conectado aos fluxos existentes de cadastro, onboarding, primeira resposta, copia, salvamento, templates, pricing, checkout, feedback, suporte e limite de uso.
- Admin passa a considerar eventos `small_launch_*` em metricas agregadas de pricing, primeira resposta e respostas salvas.

### Seguranca

- Eventos do lancamento pequeno usam a allowlist de metadados seguros e bloqueiam pergunta completa, resposta completa, e-mail, telefone, tokens, secrets e dados de pagamento.
- Escopo reforcado: sem envio automatico, sem integracao direta com WhatsApp, sem CRM completo e sem secrets no client.

### Operacao

- Decisao operacional preservada: lancamento pequeno segue condicionado a smoke test autenticado, CI verde, ambiente real validado e ausencia de P0/P1 critico.
- Relatorios indicam que `docs/post-deploy-smoke-test-report.md` e `docs/production-smoke-test-final.md` ainda nao existem com esses nomes.

### Pendencias

- Consolidar metricas reais do beta ou de nova rodada pequena.
- Aplicar migrations no Supabase real e validar RLS com dois usuarios.
- Rodar smoke test autenticado em Preview/Producao com Supabase, OpenAI, Stripe, suporte, feedback, admin e `/api/health`.

## [Closed Beta Analysis]

### Corrigido

- Copy de telas legadas ajustada para nao sugerir integracao direta com WhatsApp, envio automatico ou CRM completo.
- Relatorio do beta fechado atualizado sem inventar metricas ausentes.

### Melhorado

- Analise pos-beta, priorizacao de bugs, decisao pos-beta e plano de correcao pos-beta adicionados.
- Checklist operacional do beta atualizado com itens validados, ausentes, corrigidos e que precisam repetir.

### Seguranca

- Escopo do MVP reforcado: sem WhatsApp automatico, sem integracao direta, sem CRM completo e sem secrets no client.
- Decisao pos-beta mantem lancamento pequeno bloqueado ate smoke test real e metricas de beta estarem comprovados.

### Operacao

- Decisao recomendada: repetir/completar beta com dados reais antes de lancamento pequeno controlado.
- P0/P1 confirmados: nenhum nos documentos lidos.

### Pendencias

- Consolidar metricas reais do beta.
- Aplicar migrations no Supabase real e validar RLS com dois usuarios.
- Rodar smoke test em Preview/Producao com Supabase, OpenAI, Stripe, suporte, feedback e admin.

## [Closed Beta Preparation]

### Adicionado

- Plano do beta fechado, roteiro de usuarios, checklist operacional, relatorio e template de analise pos-beta.
- Eventos seguros `beta_signup_completed`, `beta_onboarding_completed`, `beta_first_response_generated`, `beta_response_copied`, `beta_response_saved`, `beta_template_used`, `beta_pricing_viewed`, `beta_feedback_submitted` e `beta_support_request_created`.
- Migration para permitir eventos `beta_*` em `app_events`.

### Corrigido

- Tracking do beta conectado aos fluxos existentes de cadastro, onboarding, primeira resposta, copia, salvamento, templates, pricing, feedback e suporte.
- Admin passa a considerar eventos beta em metricas agregadas de pricing, primeira resposta e respostas salvas.

### Seguranca

- Eventos beta usam a mesma sanitizacao de metadados seguros, bloqueando mensagem completa, resposta completa, e-mail, telefone, tokens, secrets e dados de pagamento.
- Nenhuma integracao direta com WhatsApp, CRM novo ou automacao complexa foi adicionada.

### Operacao

- Preparacao documentada para testar com 3 a 10 usuarios reais sem campanha grande e sem escala.
- Relatorio de beta criado em status inicial de preparacao.

### Pendencias

- Rodar smoke test autenticado em Preview/Producao com Supabase, OpenAI e Stripe configurados.
- Confirmar migrations e RLS no Supabase real antes de convidar usuarios.
- Conferir visualmente o ultimo run do GitHub Actions antes de qualquer convite externo.

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

## [1.3.0] - planejado

### Planejado

- Plano detalhado da versao 1.3 criado com foco em retencao inicial, conversao, qualidade da IA, templates, onboarding, campanha por nicho, controle de custo da IA e UX mobile.
- Criterios de entrada da 1.3 definidos para aceitar apenas correcoes P0/P1, melhorias ligadas a ativacao, retencao, conversao, suporte, IA, billing, campanha e custo com metrica simples.
- Roadmap 1.3 organizado em quatro sprints: estabilidade pos-campanha, retencao/reutilizacao, conversao/nova variacao e QA/release/operacao.
- Backlog 1.3 criado por area: correcoes, ativacao, retencao, conversao, IA, templates, billing, suporte, campanhas, admin/relatorios, seguranca e documentacao.
- Metricas de sucesso 1.3 criadas para ativacao, retencao, conversao, IA, suporte, campanhas e prontidao operacional.
- Checklist de release 1.3 criado para codigo, seguranca, produto, billing, campanha, documentacao e decisao final.
- Release notes 1.3 draft, plano de campanha 1.3 e matriz de priorizacao 1.3 criados.
- Campanha 1.3 planejada como nova variacao pequena de delivery, sem escala antes de dados agregados reais.

### Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile

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
