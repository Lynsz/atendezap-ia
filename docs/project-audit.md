# Auditoria do AtendeZap IA

## Sprint 3 da versao 1.2 executada - 2026-06-03

- Sprint 3 da versao 1.2 executada com foco em conversao, pricing, paginas por nicho, funis demo/ebook e campanha pequena pos-1.2.
- Pricing revisado com Pro recomendado, primeiro mes por R$ 29 para novos usuarios e recorrencia normal depois.
- CTA pos-demo, CTA pos-primeira resposta, funil do ebook e paginas por nicho reforcados sem prometer automacao do WhatsApp.
- Eventos seguros de conversao adicionados com propriedades limitadas a `plan`, `source`, `niche`, `cta`, `page` e `campaign`.
- Admin protegido recebeu bloco Conversao com metricas agregadas e diagnostico deterministico.
- Campanha pequena pos-Sprint 3 documentada; decisao inicial segue `Sem dados suficientes`.

## Sprint 2 da versao 1.2 executada - 2026-06-03

- Sprint 2 da versao 1.2 executada com foco em ativacao, retencao inicial, onboarding, primeira resposta, templates e admin agregado.
- Plano criado em `docs/version-1.2-sprint-2-plan.md`.
- Relatorio criado em `docs/version-1.2-sprint-2-report.md`.
- Onboarding revisado para reforcar que as informacoes ajudam a IA a gerar respostas melhores e podem ser ajustadas depois.
- Dashboard inicial melhorado com orientacao "Gere sua primeira resposta para cliente" e CTA pos-resposta para copiar ou salvar.
- Checklist de ativacao mantido/revisado com onboarding, primeira resposta, copia, salvamento, templates, favoritos e planos.
- Exemplos por nicho revisados em `src/lib/ai/business-templates.ts`.
- Templates recomendados e favoritas continuam no dashboard sem criar CRM, WhatsApp API ou automacao.
- Metricas de ativacao revisadas no admin protegido com cards agregados e diagnostico simples.
- E-mails de ativacao permanecem como templates/documentacao; nenhum envio automatico novo foi criado.
- Pendencias restantes: validar mobile, RLS, provedores reais, tracking, admin e ativacao em staging/producao.
- Nota estimada mantida: 98/100 para producao controlada documentada.
- Recomendacao: manter privado, avancar para Sprint 3, validar ativacao antes de nova campanha e nao escalar se usuarios nao geram primeira resposta.

## Sprint 1 da versao 1.2 executada - 2026-06-02

- Sprint 1 da versao 1.2 executada com foco em estabilidade, billing, IA, limites, tracking seguro, logs e health check.
- Plano criado em `docs/version-1.2-sprint-1-plan.md`.
- Relatorio criado em `docs/version-1.2-sprint-1-report.md`.
- Bugs P0/P1 revisados: nenhum P0 confirmado; nenhum P1 grave local encontrado.
- Billing revisado: checkout, portal Stripe, webhook, status de assinatura, pagamentos falhos e idempotencia continuam alinhados ao fluxo Stripe/Supabase.
- IA/limites revisados: sessao, assinatura/status e limite sao verificados antes da IA; limite excedido nao chama IA; falha da IA nao persiste uso.
- Tracking seguro revisado: eventos removem e-mail em valores genericos, telefone, WhatsApp, pergunta, resposta, token, secret e dados de pagamento.
- Logs revisados: logger e eventos internos seguem sanitizados; health check retorna dados simples e sem sensiveis.
- Testes ampliados: tracking seguro, health check e IA/limites.
- Pendencias restantes: validar Stripe, Supabase RLS, OpenAI, Resend, tracking, admin e health check em staging/producao; validar RLS com dois usuarios reais; smoke visual antes de campanha.
- Nota estimada mantida: 98/100 para producao controlada documentada.
- Recomendacao: manter privado, avancar para Sprint 2, corrigir pendencias antes de campanhas e nao escalar se houver bug P0/P1.

## Pos-release 1.1 e planejamento 1.2 - 2026-06-02

- Pos-release 1.1 analisado em `docs/post-1.1-release-report.md`.
- Diagnostico 1.1 criado em `docs/version-1.1-diagnosis.md`.
- Plano 1.2 criado em `docs/version-1.2-plan.md`.
- Roadmap 1.2 criado em `docs/version-1.2-roadmap.md`.
- Backlog 1.2 criado em `docs/version-1.2-backlog.md`.
- Metricas de sucesso 1.2 criadas em `docs/version-1.2-success-metrics.md`.
- Checklist de release 1.2 criado em `docs/version-1.2-release-checklist.md`.
- Release notes 1.2 draft criadas em `docs/release-notes-1.2-draft.md`.
- Plano de campanha pos-1.2 criado em `docs/post-1.2-campaign-plan.md`.
- Status atual: 1.1 estavel para operacao controlada; 1.2 planejada, nao entregue.
- Bugs P0/P1: nenhum P0 confirmado; P1 de suporte ja corrigido; validacoes reais seguem como prioridade operacional.
- Admin/relatorios: bloco "Planejamento 1.2" documentado como pendencia simples para avaliar sem criar dashboard paralelo.
- Nota estimada atualizada: 98/100 para producao controlada documentada, condicionada a dados reais, provedores validados e ausencia de P0/P1.
- Recomendacao: manter privado, planejar sprint 1 da versao 1.2, corrigir antes de nova campanha se aparecer P0/P1, rodar campanha pequena pos-1.2 e manter escala cautelosa.

## Versao 1.1 executada - 2026-06-02

- Status: aprovada com observacoes para operacao controlada.
- Bugs P0: nenhum confirmado na revisao local.
- Bugs P1: corrigida exposicao de notas internas de suporte (`admin_notes`) para usuario comum.
- Billing: Stripe Checkout, Customer Portal, webhook, status de assinatura, pagamentos falhos e cancelamento permanecem documentados; validacao real em staging/producao segue obrigatoria antes de nova escala.
- IA: geracao autenticada continua server-side, limite e status sao verificados antes da OpenAI, falhas antes de persistir nao contam como uso e demo publica segue com rate limit.
- Ativacao: checklist, onboarding, primeira resposta, copiar, salvar, templates, favoritos e planos seguem como fluxo leve, sem CRM.
- Campanhas: dados insuficientes para aumentar orcamento; manter campanha pequena e escala cautelosa.
- Suporte: usuario pode abrir e acompanhar solicitacoes sem ver notas internas; admin protegido mantem triagem.
- Pendencias restantes: validar Supabase RLS, Stripe, OpenAI, Resend, tracking, admin, health check e smoke visual no ambiente final.
- Nota estimada atualizada: 98/100 para producao controlada documentada, condicionada a validacao real dos provedores e ausencia de P0/P1 em producao.
- Recomendacao: manter privado, liberar versao 1.1 para operacao controlada, manter escala cautelosa, corrigir antes de novas campanhas se surgir P0/P1 e preparar versao 1.2 apenas com dados agregados reais.

## Nota geral

98/100

## Status versao 1.0

O AtendeZap IA esta consolidado como versao 1.0 documentalmente: o escopo do MVP, os fluxos prontos para operacao, os limites do produto e o roadmap pos-1.0 estao definidos em `docs/version-1.0.md`, `docs/roadmap-post-1.0.md`, `docs/stability-criteria.md`, `docs/weekly-maintenance-checklist.md` e `docs/README.md`.

A classificacao atual e: MVP validado, pronto para producao controlada, pronto para campanhas pequenas com baixo orcamento apos checklists reais, pronto apenas para escala cautelosa planejada e ainda nao pronto para escala ampla.

O escopo da 1.0 inclui landing, demo publica, ebook, captura de leads, envio de e-mail, auth, onboarding, geracao de respostas com IA, historico, limite mensal, planos Starter/Pro/Premium, Stripe Checkout, Stripe Customer Portal, webhook Stripe, assinatura, admin, metricas basicas, feedback, tracking e paginas legais.

Ficam fora da 1.0: envio automatico pelo WhatsApp, CRM completo, multiplos atendentes, automacoes avancadas, integracoes externas avancadas, testes A/B automaticos e nutricao avancada por e-mail.

Pendencias conhecidas seguem principalmente externas/operacionais: validacao manual com provedores reais, RLS real com dois usuarios, Stripe live/test mode de ponta a ponta, Resend real, tracking real, admin real e reducao futura de superficies legadas fora do fluxo vendavel.

Recomendacao atualizada: manter producao controlada e campanhas pequenas como rotina de validacao. Nao escalar investimento enquanto `docs/second-campaign-analysis.md` nao tiver dados reais suficientes, enquanto a matriz de decisao nao estiver verde e enquanto houver qualquer P0/P1 aberto.

## Analise da campanha pequena otimizada - 2026-06-01

- Campanha `campanha_otimizada_01` analisada com base nos documentos existentes.
- Status atual: Sem dados suficientes para declarar nicho, criativo, CTA, destino ou pricing vencedor.
- Gargalos identificados como pontos de observacao, nao como conclusoes reais: visitantes para clique, clique para lead, cadastro para onboarding, onboarding para primeira resposta e uso para checkout.
- Documentos criados: `docs/optimized-campaign-analysis.md`, `docs/optimized-campaign-funnel-diagnosis.md`, `docs/optimized-campaign-decision-matrix.md`, `docs/optimized-campaign-adjustment-plan.md`, `docs/next-campaign-variation-plan.md` e `docs/campaign-comparison-report.md`.
- `docs/ad-testing-matrix.md` criado para consolidar variacoes pequenas sem automacao ou integracao externa.
- Admin de campanhas revisado com bloco deterministico "Diagnostico da campanha", mantendo dados agregados e sem IA.
- Criterios de pausa e escala atualizados para bloquear escala com tracking quebrado, onboarding sem ativacao, checkout/webhook falho, custo de IA descontrolado ou ausencia de primeira resposta.
- Backlog atualizado com intake da campanha otimizada por area de impacto, sem criar tarefas conclusivas sem dados reais.
- Nota estimada mantida: 98/100 para producao controlada, condicionada a validacao real de campanha, tracking, checkout, webhook, IA, suporte e admin.
- Recomendacao: manter privado, nao escalar, corrigir antes de repetir se houver gargalo claro, testar nova variacao pequena e considerar escala cautelosa somente com dados agregados positivos.

## Escala cautelosa planejada - 2026-06-01

- Estrutura de escala cautelosa criada sem liberar aumento automatico de verba.
- Documentos criados: `docs/cautious-scale-execution-plan.md`, `docs/scale-control-matrix.md`, `docs/daily-scale-checklist.md`, `docs/cautious-scale-report.md`, `docs/ad-budget-guardrails.md`, `docs/scale-contingency-plan.md` e `docs/after-scale-next-step-criteria.md`.
- Guardrails de orcamento criados para impedir aumento com P0/P1, checkout/webhook instavel, usuarios sem primeira resposta, tracking quebrado ou custo de IA subindo sem ativacao.
- Controle diario criado para produto, billing, IA/custo, campanha e decisao operacional.
- Contingencia criada para custo de IA, checkout, baixa ativacao, suporte, tracking e P0/P1.
- Admin de campanhas revisado com visao agregada "Escala cautelosa" e decisao diaria nas observacoes de resultado, sem schema novo e sem integracao externa.
- Status atual: Sem dados suficientes para iniciar escala cautelosa; manter campanha pequena ate haver ativacao e sinais reais.
- Nota estimada mantida: 98/100 para producao controlada, condicionada a validacao real em staging/producao e a dados agregados suficientes.
- Recomendacao: manter privado, manter campanha pequena, nao escalar ainda, pausar para correcao diante de qualquer P0/P1 e iniciar escala cautelosa somente com produto, billing, IA, tracking, suporte e custos controlados.

## Analise pos-escala cautelosa e versao 1.1 - 2026-06-01

- Escala cautelosa analisada com base nos documentos atuais.
- Status atual: Sem dados suficientes para manter ou aumentar escala cautelosa.
- Diagnostico de saude criado em `docs/scale-health-diagnosis.md`.
- Decisao pos-escala documentada em `docs/post-scale-decision-matrix.md`.
- Plano de ajustes criado em `docs/post-scale-adjustment-plan.md`.
- Relatorio de estabilidade operacional criado em `docs/operational-stability-report.md`.
- Versao 1.1 planejada em `docs/version-1.1-plan.md`, `docs/version-1.1-release-checklist.md` e `docs/release-notes-1.1.md`.
- Admin de campanhas revisado com bloco agregado "Resumo pos-escala", sem dados sensiveis e com `Nao disponivel` para campos sem fonte persistida.
- Criterios de escala, pausa, backlog, roadmap e calendario operacional atualizados para exigir leitura pos-escala.
- Nota estimada mantida: 98/100 para producao controlada, condicionada a validacao real em staging/producao, provedores externos e dados agregados suficientes.
- Recomendacao: manter privado, nao escalar ainda, reduzir ou pausar se houver gasto ativo sem ativacao, corrigir antes de continuar diante de qualquer P0/P1 e preparar a versao 1.1 como consolidacao estavel.

## Registro interno de campanhas - 2026-05-31

- Criadas tabelas `campaign_experiments` e `campaign_results` para registro manual, agregado e admin-only de campanhas, criativos, UTMs e resultados.
- RLS e grants foram definidos sem acesso direto para `anon` e `authenticated`; o acesso operacional fica nas APIs protegidas por `requireAdmin`.
- APIs admin criadas para listar/criar/editar/remover campanhas e listar/criar/editar resultados manuais.
- Admin ganhou seção "Campanhas" com criação, edição, status, decisão final, registro de resultados, resumo por campanha, diagnóstico simples, comparação por nicho e comparação por canal.
- Diagnóstico permanece determinístico e sem IA, cobrindo gargalos de visitantes para leads, leads para cadastros, cadastros para onboarding, onboarding para primeira resposta, primeira resposta para checkout e checkout para assinatura.
- Tracking/logs internos seguros adicionados: `admin_campaign_created`, `admin_campaign_updated`, `admin_campaign_result_recorded` e `admin_campaign_decision_updated`, sem observações completas, dados pessoais, dados de pagamento, respostas ou secrets.
- Documentação criada: `docs/campaign-results-workflow.md`, `docs/post-campaign-analysis-template.md`, `docs/campaign-decision-criteria.md` e `docs/monthly-campaign-report-template.md`.
- README e `docs/README.md` atualizados com os novos documentos.
- Pendências restantes: aplicar `supabase/migrations/0019_campaign_experiments.sql` em staging/producao, validar a seção admin com dados reais agregados e continuar usando plataformas externas para visitantes/custos detalhados.
- Nota estimada mantida: 97/100 para operação controlada, condicionada à validação real de Supabase/admin em staging/producao.

## Feedback, insights e backlog - 2026-05-31

- Fontes atuais auditadas: `user_feedback`, `ai_response_feedback`, `support_requests`, `cancellation_feedback`, campanhas, métricas admin, eventos internos, tracking e roadmap.
- Criada tabela `product_insights` para registrar bugs, melhorias, pedidos de funcionalidade, reclamações, dúvidas, churn, aprendizados de campanha e qualidade de IA.
- RLS e grants foram definidos sem acesso direto para `anon` e `authenticated`; o acesso operacional fica nas APIs protegidas por `requireAdmin`.
- APIs admin criadas para listar, criar, editar e remover insights, com filtros por tipo, severidade, status e área de impacto.
- Admin ganhou seção "Insights de Produto" com formulário manual, filtros, cards de agrupamento, diagnóstico simples e criação de rascunho a partir de suporte, feedback, IA negativa agregada e churn agregado.
- Diagnóstico permanece determinístico e sem IA, cobrindo sinais recorrentes de qualidade da IA, onboarding, WhatsApp automático, preço/churn e checkout/billing.
- Tracking/logs internos seguros adicionados: `product_insight_created`, `product_insight_updated`, `product_insight_status_changed` e `product_insight_deleted`, sem descrição completa, e-mail, resposta completa, pagamento ou secrets.
- Documentação criada: `docs/feedback-workflow.md`, `docs/product-prioritization.md`, `docs/product-backlog.md`, `docs/user-interview-script.md` e `docs/monthly-feedback-report-template.md`.
- README e `docs/README.md` atualizados com os novos documentos.
- Pendências restantes: aplicar `supabase/migrations/0020_product_insights.sql` em staging/producao, validar com admin real, revisar mensalmente o backlog e manter o registro apenas como triagem simples.
- Nota estimada mantida: 97/100 para operação controlada, condicionada à validação real de Supabase/admin em staging/producao.

## Sprints, releases e execução do roadmap - 2026-05-31

- Fluxo de sprint criado para organizar ciclos curtos de melhoria com foco em estabilidade, ativação, conversão e retenção.
- Templates criados para planejamento e revisão de sprint: `docs/sprint-planning-template.md` e `docs/sprint-review-template.md`.
- Processo de release criado em `docs/release-process.md`, com etapas antes, durante e depois do deploy.
- Template de release notes criado em `docs/release-notes-template.md`.
- Versionamento simples documentado em `docs/versioning.md`, inspirado em SemVer.
- Critérios de entrada na sprint criados em `docs/sprint-intake-criteria.md`.
- Checklist de prontidão para release criado em `docs/release-readiness-checklist.md`.
- Gestão simples de roadmap criada em `docs/roadmap-management.md`, reaproveitando `product_insights` no admin sem criar ferramenta complexa.
- Calendário operacional mensal criado em `docs/monthly-operating-calendar.md`.
- Admin de Insights ganhou visão "Roadmap" com itens planejados, em progresso, entregues e rejeitados, filtráveis pelos mesmos campos de insights.
- `CHANGELOG.md` ganhou seção `[Unreleased]` para versões futuras, sem remover histórico.
- Pendências restantes: preencher templates com dados reais de sprint/release, manter `CHANGELOG.md` atualizado por entrega e validar releases em staging antes de produção.
- Nota estimada mantida: 97/100 para operação controlada, condicionada à disciplina operacional e validação real em staging/producao.

## Relatorios internos de negocio - 2026-05-29

- Admin protegido ganhou visao interna de "Relatorios" para acompanhar aquisicao, ativacao, uso, receita, suporte e qualidade com dados agregados.
- Funil interno passou a mostrar etapas absolutas e taxas simples: leads, cadastros, onboarding concluido, primeira resposta, resposta salva/copiada, checkout iniciado e assinatura ativa.
- Diagnostico simples do funil permanece deterministico, sem IA, apontando gargalos em leads, cadastro, onboarding, primeira resposta, pricing/oferta ou checkout.
- Metricas indisponiveis por tabela ausente passam a ser tratadas como "Nao disponivel" no admin, sem quebrar a tela.
- Exportacao CSV simples foi adicionada para metricas internas agregadas e mantida para relatorio de campanha/leads; nao exporta conteudo completo de respostas, secrets ou dados de pagamento.
- Documentacao criada: `docs/internal-metrics.md`, `docs/weekly-business-review.md`, `docs/business-health-criteria.md` e `docs/monthly-business-report-template.md`.
- README e `docs/README.md` foram atualizados com os novos documentos.
- Testes revisados para admin metrics, bloqueio por `requireAdmin`, indisponibilidade de tabela opcional e diagnostico de gargalo com dados simulados.
- Pendencias restantes: validar os contadores com dados reais em staging/producao, conferir que todos os eventos internos desejados estao sendo persistidos e continuar usando GA4/Meta/Stripe para visitantes, custos e detalhes financeiros externos.
- Nota estimada atualizada: 97/100 para producao controlada, condicionada a validacao real do admin e dos provedores.

## Ciclo de assinatura e churn - 2026-05-29

- Billing auditado: Checkout, Customer Portal, webhook Stripe, `subscriptions`, limites por plano, `/assinatura`, admin e docs de Stripe.
- Webhook Stripe segue validando assinatura, registrando evento processado de forma idempotente por `provider_event_id` e tratando `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded` e `invoice.payment_failed`.
- Status local de assinatura preserva melhor os estados `active`, `trialing`, `past_due`, `unpaid`, `canceled`, `incomplete`, `incomplete_expired` e `paused`.
- `/assinatura` agora mostra mensagens claras para assinatura ativa, pagamento pendente/falho, cancelamento e cancelamento agendado, sem exibir cartão ou dados sensíveis de pagamento.
- Feedback de cancelamento criado com tabela `cancellation_feedback`, RLS por usuário, API autenticada e formulário opcional na página de assinatura.
- Admin ganhou agregados simples de churn/assinaturas: pagamentos com falha, `past_due`, novos assinantes, cancelamentos recentes e motivos de cancelamento agregados.
- Logs/eventos seguros revisados para webhook recebido/processado/falho, status de assinatura atualizado, pagamento falho recebido e portal criado, sem logar payload completo do Stripe.
- Documentação criada: `docs/subscription-lifecycle.md`, `docs/failed-payments.md` e `docs/churn-analysis.md`.
- Pendências restantes: aplicar `0018_cancellation_feedback.sql` em staging/produção, validar Customer Portal real, validar troca de plano real com Stripe e conferir dunning/retentativas conforme configuração da Stripe.
- Nota estimada atualizada: 97/100 para produção controlada, condicionada à validação real de Stripe/Supabase em staging/produção.

## Operacao 1.0

A operacao continua da versao 1.0 agora esta documentada em `docs/operations-1.0.md`, com rotinas diaria, semanal e mensal para logs, provedores, feedbacks, leads, usuarios, assinaturas, custos, bugs e campanhas.

O plano de incidentes foi criado em `docs/incident-response.md`, com severidades P0/P1/P2/P3, regra de pausa de anuncios, rollback e registro em `docs/incident-log.md`.

O monitoramento de custos foi criado em `docs/cost-monitoring.md`, cobrindo OpenAI, Stripe, Supabase, Vercel, Resend e custos externos de campanhas. O plano de retencao inicial esta em `docs/retention-plan.md`, e a melhoria de qualidade da IA esta em `docs/ai-response-quality-plan.md`.

O admin foi revisado para operacao e ja cobre leads recentes, usuarios cadastrados, assinaturas, status de assinatura, feedbacks, metricas de ativacao, uso de IA, origem por UTM e exportacao CSV agregada. Nao foi criado dashboard complexo novo.

Pendencias restantes: alertas automaticos ainda dependem de configuracao externa; custos de midia continuam fora do app; e retencao/churn mais avancados seguem como roadmap pos-1.0.

Nota estimada atualizada: 96/100. A nota permanece estavel porque a operacao foi organizada, mas ainda depende de validacao e monitoramento reais em producao.

O projeto esta em release candidate aprovado para producao controlada e preparado para 3 a 5 primeiros usuarios e uma campanha pequena de validacao: funil publico, pagina direta de campanha, auth, dashboard SaaS, IA server-side, Stripe, Supabase, Resend, tracking, admin, feedback, metricas internas, relatorio de campanha, docs, testes, staging e playbooks de operacao estao encaminhados. A validacao local passou em lint, typecheck, build, testes unitarios e e2e, sem bloqueador de codigo nas rotas principais revisadas. Ainda falta executar o deploy final/staging real, validar checkout com Stripe test/live mode, testar RLS contra Supabase real e confirmar Resend, OpenAI, tracking, dominio, admin, feedback e metricas no ambiente final.

O ciclo pos-campanha agora tambem esta definido: diagnostico, matriz de priorizacao, revisao semanal, backlog de crescimento, experimentos pequenos e bloco simples de gargalo no admin para orientar melhorias com dados reais.

## Backup, recuperacao e seguranca de dados - 2026-05-28

- Estrategia de backup criada em `docs/backup-strategy.md`, cobrindo dados criticos, dados que nao devem ir para o Git, Supabase, Stripe, Resend e OpenAI.
- Plano de recuperacao criado em `docs/disaster-recovery.md`, com cenarios de banco indisponivel, dados corrompidos, webhook Stripe falho, deploy quebrado e chave vazada.
- Checklist mensal criado em `docs/monthly-backup-checklist.md`, incluindo Supabase, Stripe, Vercel e seguranca.
- Migrations seguras documentadas em `docs/safe-migrations.md`, reforcando alteracoes incrementais, backup antes de producao, validacao de RLS e bloqueio de operacoes perigosas sem plano.
- Checklist de RLS criado em `docs/rls-review-checklist.md`, com tabelas criticas e testes esperados para isolamento entre usuarios.
- Reconciliacao Stripe/Supabase documentada em `docs/stripe-reconciliation.md`, mantendo Stripe como fonte de verdade financeira e Supabase como estado local da aplicacao.
- Retencao de dados documentada em `docs/data-retention.md`, com principios de minimizacao, ausencia de secrets e melhorias futuras.
- APIs criticas revisadas e registradas em `docs/critical-api-security-review.md`: IA, historico, respostas salvas, feedbacks, assinatura, checkout, portal Stripe, webhook Stripe, leads/ebook e admin.
- Teste estatico de RLS criado em `src/lib/supabase/rls-policies.test.ts`, cobrindo isolamento de historico, respostas salvas, feedbacks, assinatura somente leitura, leads/eventos sem acesso direto e admin protegido por `requireAdmin`.
- README e `docs/README.md` atualizados com os novos documentos operacionais.
- Repositorio permanece privado; nenhum dump, dado real de usuario, `.env.local` ou secret real foi adicionado.
- Pendencias restantes: validar backups reais conforme plano Supabase contratado, testar restauracao em ambiente seguro, executar teste real de RLS com dois usuarios em staging/producao e manter registro de incidentes quando houver reconciliacao manual.
- Nota estimada atualizada: 97/100 para operacao controlada, condicionada a validacao real de backup/restauracao, RLS e provedores em staging/producao.

## Privacidade, LGPD e controle de dados - 2026-05-28

- Inventario de dados criado em `docs/data-inventory.md`, cobrindo usuarios, onboarding, leads, assinaturas, IA, respostas salvas, feedbacks, eventos, logs, admin e integracoes externas.
- Politica de privacidade operacional criada em `docs/privacy-policy.md` e pagina publica `/privacidade` revisada para explicar Supabase, Stripe, OpenAI, Resend, analytics, exportacao, exclusao e uso manual das respostas.
- Termos de uso operacionais criados em `docs/terms-of-use.md` e pagina publica `/termos` revisada com uso permitido, limitacoes da IA, proibicoes, planos, Stripe, cancelamento, limites mensais e disponibilidade.
- Documentacao LGPD criada em `docs/lgpd-compliance.md`, incluindo principios, direitos do usuario e pendencias futuras.
- Solicitacoes de exportacao/exclusao criadas com tabela `data_requests`, migration `0016_data_requests.sql`, RLS por usuario, API autenticada `/api/data-requests` e pagina protegida `/dashboard/privacidade`.
- Admin protegido ganhou secao "Solicitacoes de dados" via `/api/admin/data-requests`, com e-mail mascarado, status, nota interna e acoes simples para `processing`, `completed` e `rejected`.
- Processos manuais documentados em `docs/data-export-process.md` e `docs/data-deletion-process.md`.
- Tracking revisado: `src/lib/tracking.ts` agora remove tambem propriedades de e-mail antes de enviar eventos, alem de perguntas, respostas, mensagens, tokens, secrets e dados de pagamento.
- Logs revisados e `docs/safe-logging.md` atualizado para reforcar analytics seguro e notas internas sem dados sensiveis.
- Testes adicionados para solicitacoes de usuario, admin protegido, status invalido, RLS estatica e sanitizacao de analytics.
- Pendencias restantes: aplicar `0016_data_requests.sql` no Supabase real/staging, validar solicitacoes com dois usuarios, definir e revisar juridicamente politicas finais, automatizar exportacao/exclusao apenas quando houver processo seguro e revisar periodicamente eventos/analytics.
- Nota estimada mantida: 97/100 para operacao controlada, agora com base inicial LGPD/privacidade, condicionada a validacao real de RLS e processo operacional em staging/producao.

## Seguranca do repositorio privado - 2026-05-27

- Decisao registrada: o repositorio do AtendeZap IA deve permanecer privado no GitHub neste momento.
- `.gitignore` revisado para cobrir arquivos `.env`, `.env.local`, `.env.production`, `.env.development`, `.env.development.local`, `.env.test.local`, `.env*.local`, `.vercel`, certificados/chaves locais, outputs de build, coverage, `.next`, `dist`, `build` e `node_modules`.
- `git ls-files` foi revisado para arquivos de ambiente; apenas `.env.example` esta versionado, e `.env.local` permanece ignorado/local.
- `.env.example` foi revisado para manter somente nomes de variaveis e placeholders vazios, sem chaves reais.
- Script `scripts/check-secrets.js` criado e conectado a `npm run check:secrets` para procurar padroes comuns de Stripe, OpenAI, Supabase, Resend e chaves privadas em arquivos versionados.
- Documentacao criada: `docs/private-repo-security-checklist.md`, `docs/private-deploy.md` e `docs/repository-visibility.md`.
- README atualizado com secao de seguranca do repositorio privado.
- Fronteira client/server revisada por busca: `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` e `RESEND_API_KEY` seguem em codigo server-side, rotas API, libs de servidor, testes ou documentacao, sem uso em Client Components.
- Se uma chave real ja tiver sido exposta fora desta auditoria, a recomendacao operacional e revogar/rotacionar no painel do servico, atualizar `.env.local` e Vercel, e revisar historico Git conforme necessidade.
- Pendencias restantes: ativar secret scanning no GitHub se disponivel, revisar permissoes de colaboradores e executar auditoria de historico antes de qualquer decisao futura de publicidade.

## Esteira de validacao privada - 2026-05-27

- Scripts do `package.json` revisados: `lint`, `typecheck`, `build`, `test` e `check:secrets` existem e continuam usando npm.
- Script local `validate` criado para rodar `check:secrets`, `lint`, `typecheck`, `build` e `test` em sequencia.
- GitHub Action criada em `.github/workflows/validate.yml`, rodando em pull requests e pushes para `main`.
- A action usa `npm ci`, nao usa secrets reais, nao le `.env.local` e define apenas placeholders publicos seguros para build.
- Documentacao criada: `docs/validation-workflow.md`, `docs/pre-push-checklist.md`, `docs/pre-deploy-checklist.md` e `docs/env-safety.md`.
- README atualizado com a rotina `npm run validate` antes de push/deploy.
- `scripts/check-secrets.js` revisado para ignorar `.git`, `node_modules`, `.next`, `.vercel`, `dist`, `build` e `coverage`, retornar exit code 1 em achados e nao imprimir valores completos.
- Pendencias restantes: ativar branch protection no GitHub privado para exigir a action verde antes de merge em `main`, se a rotina operacional permitir.

## Fluxo staging para producao privado - 2026-05-27

- Repositorio permanece privado; nenhuma instrucao foi adicionada para torna-lo publico.
- Documentacao de ambientes criada em `docs/environments.md`, separando Local, Preview/Staging e Producao.
- Checklist de staging criado em `docs/staging-checklist.md`, cobrindo paginas publicas, auth, onboarding, IA, Stripe, Resend e seguranca.
- Checklist de producao criado em `docs/production-deploy-checklist.md`, com pre-requisitos, variaveis na Vercel, Stripe, Supabase, OpenAI, Resend e verificacoes apos deploy.
- Plano de rollback revisado em `docs/rollback-plan.md`, com criterios de rollback, passos na Vercel e rotina apos rollback.
- Smoke test pos-deploy criado em `docs/post-deploy-smoke-test.md`.
- Health check revisado em `/api/health` para retornar `status`, `environment`, `version` e `timestamp`, sem secrets, dados de usuario ou chamadas externas.
- Documentacao do health check criada em `docs/health-check.md`.
- Variaveis da Vercel documentadas em `docs/vercel-env-vars.md`, separando variaveis publicas `NEXT_PUBLIC_*` e privadas server-side.
- README e `docs/README.md` atualizados com o fluxo privado de deploy, staging, producao, rollback e health check.
- Pendencias restantes: executar os checklists no ambiente real de Preview/Staging e Producao, configurar branch protection se desejado e validar provedores reais antes de promover para producao.

## Biblioteca de respostas salvas - 2026-05-26

- Estrutura criada: tabela `saved_responses`, migration `0012_saved_responses.sql`, RLS por `user_id`, indices por usuario, data e categoria, e indice unico parcial para evitar duplicar a mesma resposta gerada na biblioteca do usuario.
- APIs criadas: `GET /api/saved-responses`, `POST /api/saved-responses`, `PATCH /api/saved-responses/[id]` e `DELETE /api/saved-responses/[id]`, todas autenticadas, sem aceitar `user_id` do client e filtrando pelo usuario da sessao.
- Dashboard revisado: resposta gerada e historico ganharam acao "Salvar resposta"; biblioteca simples foi adicionada com busca client-side, categorias opcionais, copiar, editar titulo/categoria/conteudo e remover.
- Copia revisada: respostas geradas, historico e biblioteca usam feedback visual e erro amigavel quando a area de transferencia nao esta disponivel.
- Tracking adicionado sem conteudo sensivel: `saved_response_create`, `saved_response_copy`, `saved_response_delete`, `saved_response_edit` e `saved_responses_view`.
- Admin/metricas: agregados simples adicionados para total de respostas salvas, respostas salvas no periodo e usuarios com biblioteca, sem exibir conteudo das respostas.
- Documentacao criada: `docs/saved-responses.md`; roadmap atualizado para marcar biblioteca/favoritos como implementado e registrar melhorias futuras como tags, pastas, busca avancada e compartilhamento por equipe.
- Seguranca revisada: usuario so acessa as proprias respostas salvas por API e RLS; salvar a partir do historico valida que `response_id` pertence ao usuario autenticado; conteudo completo nao vai para analytics.
- Pendencias restantes: aplicar a migration `0012_saved_responses.sql` no Supabase real/staging e validar manualmente isolamento com dois usuarios.
- Nota estimada atualizada: 97/100 para a etapa pos-1.0 de biblioteca, condicionada a migration aplicada e validacao real de RLS em staging/producao.

## Templates prontos para WhatsApp - 2026-05-26

- Catalogo estatico criado em `src/lib/templates/whatsapp-templates.ts`, cobrindo Autonomo, Prestador de servico, Loja, Delivery, Estetica, Restaurante, Assistencia tecnica e Outro, com pelo menos 5 templates por nicho.
- Templates seguem regras do produto: nao inventam preco, nao prometem prazo exato, nao confirmam agenda automaticamente e usam campos editaveis como `[valor]`, `[horario]`, `[bairro]` e `[servico]`.
- Dashboard recebeu aba/rota protegida `/dashboard/templates` com filtros por nicho, categoria, busca simples, copiar e salvar na biblioteca.
- Dashboard principal mostra recomendacoes "Comece com templates prontos" para usuarios no inicio, usando o `business_type` do onboarding quando disponivel.
- Integracao com biblioteca: `saved_responses` recebeu `source_template_id` para evitar duplicar o mesmo template salvo pelo usuario; as APIs continuam autenticadas e sem aceitar `user_id` do client.
- Tracking adicionado sem conteudo sensivel: `templates_view`, `template_copy`, `template_save`, `template_filter_change` e `template_search`.
- Admin/metricas ganhou agregados simples de templates salvos e categorias mais salvas; copias ainda dependem de analytics client-side, sem novo dashboard complexo.
- Documentacao criada: `docs/whatsapp-templates.md`; `docs/saved-responses.md`, `docs/roadmap-post-1.0.md`, `docs/project-audit.md` e `docs/final-readiness-report.md` foram atualizados.
- Pendencias restantes: aplicar `0013_saved_response_templates.sql` no Supabase real/staging, validar `/dashboard/templates` no deploy e, se necessario no futuro, persistir eventos internos de copia de template.
- Nota estimada atualizada: 97/100 para a etapa pos-1.0 de templates prontos, condicionada a migrations aplicadas e validacao real de RLS em staging/producao.

## Personalizacao da biblioteca - 2026-05-26

- Biblioteca editavel revisada: o usuario pode criar resposta manual, editar titulo/conteudo/categoria, duplicar, copiar, filtrar e excluir respostas salvas.
- Schema/migration: `saved_responses` recebeu `source` com valores `ai_generated`, `template` e `manual`, backfill seguro e indice por origem via `0014_saved_responses_source.sql`.
- API adicionada: `POST /api/saved-responses/[id]/duplicate`, autenticada, sem aceitar `user_id` do client e filtrando por `id` + `user_id`.
- UX revisada: biblioteca ganhou CTA "Nova resposta", filtros por categoria e origem, busca simples, confirmacao antes de excluir e estado vazio atualizado.
- Integracao com templates: templates salvos podem ser personalizados ou duplicados dentro da biblioteca privada do usuario, sem alterar o catalogo estatico.
- Tracking adicionado sem conteudo das respostas: `saved_response_create_manual`, `saved_response_duplicate`, `saved_response_filter` e `saved_response_search`, alem dos eventos existentes de copia/edicao/exclusao.
- Seguranca revisada: RLS segue por `auth.uid()`, APIs usam usuario autenticado, duplicacao nao preserva `source_template_id` para evitar colisao do indice unico e nao duplica dados para outro usuario.
- Pendencias restantes: aplicar `0014_saved_responses_source.sql` no Supabase real/staging e validar manualmente criacao, edicao, duplicacao e exclusao com dois usuarios.
- Nota estimada atualizada: 97/100 para a etapa pos-1.0 de biblioteca editavel, condicionada a migrations aplicadas e validacao real de RLS em staging/producao.

## Organizacao da biblioteca com favoritos - 2026-05-27

- Campo `is_favorite` criado em `saved_responses` com default `false`, sem remover dados e mantendo RLS por `user_id`.
- Campos `copy_count` e `last_copied_at` criados para registrar copias de respostas salvas sem afetar cobranca ou limite mensal.
- Migration incremental criada: `supabase/migrations/0015_saved_response_favorites_and_copy_count.sql`, com indices por `user_id + is_favorite` e por ultima copia.
- API de respostas salvas revisada: `PATCH /api/saved-responses/[id]` agora permite favoritar/desfavoritar e registrar copia, sempre filtrando por `id` + `user_id` autenticado.
- Biblioteca revisada: filtro rapido Todos/Favoritos, filtros combinados por categoria/origem/busca, ordenacao simples e cards com titulo, categoria, origem, favorito, data, contador de copias e acoes.
- Dashboard revisado: bloco "Respostas favoritas" mostra ate 3 favoritas do usuario com botao copiar e estado vazio quando nao ha favoritas.
- Tracking adicionado sem conteudo sensivel: `saved_response_favorite`, `saved_response_unfavorite`, `saved_response_filter_favorites`, `saved_response_sort_change`, `saved_response_copy` e `saved_response_search` usam apenas categoria, origem, favorito e acao.
- Testes revisados para filtro de favoritas, busca combinada, ordenacao, favoritar propria resposta, bloquear favorita de outro usuario e registrar copia.
- Pendencias restantes: aplicar `0015_saved_response_favorites_and_copy_count.sql` no Supabase real/staging e validar manualmente com dois usuarios.
- Nota estimada atualizada: 97/100 para a etapa pos-1.0 de organizacao da biblioteca, condicionada a migration aplicada e validacao real de RLS em staging/producao.

## Mapa tecnico

- Framework: Next.js 16 com App Router em `src/app`.
- Pages Router: nao identificado.
- Middleware: `middleware.ts` classifica rotas publicas, privadas e admin e bloqueia acesso sem hint de sessao.
- Server actions: nao identificadas; o backend usa route handlers em `src/app/api`.
- Supabase: client browser canonico em `src/lib/supabase/browser.ts`, compatibilidade em `src/lib/supabase.ts`, service role em `src/lib/supabase/server.ts` e auth server helper em `src/lib/auth/server.ts`.
- Stripe: checkout, portal e webhook em `src/app/api/stripe/*`, helpers em `src/services/stripe.ts`.
- OpenAI: respostas do SaaS em `src/lib/ai-response.ts` e demo publica em `src/app/api/demo/generate-response/route.ts`; chave fica no servidor.
- Resend: entrega do ebook em `src/lib/email.ts` e e-mails legados de kit em `src/lib/resend.ts`.
- Tracking: camada client-safe em `src/lib/tracking.ts`, provider global em `src/components/tracking`.
- Admin: `/admin` e `/api/admin/overview`, protegido por Supabase Auth + `ADMIN_EMAILS`.
- Documentacao: `README.md`, `SECURITY.md`, `POST_DEPLOY_CHECKLIST.md`, `docs/*`, `supabase/schema.sql` e migrations.

## Rotas atuais

### Publicas principais

- `/`: landing page.
- `/atendimento-whatsapp-ia`: pagina direta para campanha pequena de validacao com trafego pago.
- `/ebook`: captura de lead do guia.
- `/ebook/obrigado`: obrigado e ponte para demo/pricing/cadastro.
- `/ebook/guia`: guia gratuito em HTML.
- `/demo`: demo publica com geracao limitada.
- `/precos`: pricing principal.
- `/plans`: alias de pricing com `robots: noindex`.
- `/termos`: termos.
- `/privacidade`: politica de privacidade.
- `not-found.tsx`: pagina 404.
- `/suporte`: suporte.
- `/feedback`: feedback publico/controlado para primeiros usuarios.

### Protegidas ou semi-protegidas

- `/dashboard`: dashboard SaaS real, protegido no componente e usando Supabase.
- `/admin`: protegido no servidor via API por token + `ADMIN_EMAILS`.
- `/assinatura`: protegido e corrigido para usar assinatura real em Supabase/Stripe.
- `/onboarding`: mantem a rota existente, mas redireciona para `/dashboard`, onde fica o onboarding real em Supabase.
- `/app`, `/app/[...slug]`, `/atendezap`, `/leads`, `/scripts`, `/automacoes`, `/base-conhecimento`, `/configuracoes`, `/integracoes/*`, `/sistema/backend`: superficies legadas/demo ainda existentes.

### APIs

- `/api/health`
- `/api/ai/generate-response`
- `/api/generate-response`
- `/api/demo/generate-response`
- `/api/ebook-lead`
- `/api/stripe/create-checkout-session`
- `/api/stripe/create-portal-session`
- `/api/stripe/webhook`
- `/api/admin/overview`
- `/api/admin/metrics`
- `/api/admin/campaign-report`
- `/api/support`
- `/api/feedback`
- `/api/kiwify/webhook`
- `/api/generate-kit`
- `/api/download/[kitId]`

## Pronto

- Landing, ebook, obrigado, guia, demo, pricing, termos, privacidade e 404 existem e carregam sem erro no smoke test local.
- Home e pricing foram melhorados com CTAs, comparacao, FAQ, objecoes e eventos de conversao.
- Demo publica valida payload com Zod, limita tamanho, aplica rate limit e tem fallback sem `OPENAI_API_KEY`.
- Captura do ebook valida nome/e-mail/WhatsApp/tipo de atuacao, salva UTMs, faz upsert por e-mail e redireciona para obrigado.
- Falha de envio do ebook por Resend nao quebra o cadastro do lead; status e registrado em `lead_email_events` quando Supabase esta configurado.
- Dashboard SaaS le usuario, negocio, historico, clientes, assinatura, uso mensal e planos via Supabase.
- Geracao de resposta exige auth, valida entrada, usa contexto do negocio, salva historico e bloqueia pelo limite mensal.
- Stripe checkout exige auth, valida plano, usa price IDs/cupom via env, envia metadata com `user_id`, `plan` e UTMs e retorna para `/assinatura`.
- Stripe checkout envia `user_id`, `plan`, `price_id` e UTMs na metadata, cria/reutiliza customer e grava assinatura pendente no Supabase.
- Stripe portal exige auth, busca customer no Supabase e retorna erro controlado quando o usuario ainda nao tem customer.
- Stripe webhook valida assinatura, registra idempotencia e trata `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded` e `invoice.payment_failed`.
- Stripe webhook resolve usuario por metadata, `client_reference_id`, subscription salva ou customer Stripe, e mapeia `STRIPE_PRICE_PRO_FIRST_MONTH_29` como plano Pro para compatibilidade.
- Supabase agora tem migration segura para `stripe_customer_id`, `stripe_subscription_id`, `subscription_status` e `usage_count`, com backfill a partir de `provider_*`/`status`.
- Admin server-side exige usuario autenticado e e-mail listado em `ADMIN_EMAILS`.
- Feedback de primeiros usuarios foi adicionado em `/feedback`, com API server-side, validacao, rate limit, associacao opcional a usuario autenticado, tabela `user_feedback` e listagem simples no admin.
- Metricas internas foram adicionadas em `/api/admin/metrics` e no admin: funil, ativacao, uso inicial, feedback e assinaturas em formato agregado.
- Relatorio de campanha foi adicionado em `/api/admin/campaign-report` e no admin: filtros por periodo, `utm_source` e `utm_campaign`, leads por UTM, cadastros, onboardings, ativacao, demo, primeira resposta, checkout, assinaturas, feedbacks, taxas de conversao, interpretacao simples e exportacao CSV agregada.
- Admin agora mostra "Possivel gargalo atual" com regra deterministica baseada em lead, cadastro, onboarding, primeira resposta, checkout e assinatura.
- Feedback agora registra contexto/origem/campanha opcionais para identificar se a dificuldade veio de cadastro, onboarding, demo, ebook, dashboard ou assinatura.
- Preparacao para anuncios pequenos adicionada: pagina `/atendimento-whatsapp-ia`, CTAs revisados na landing/demo/ebook/obrigado, FAQ comercial ampliada, evento `campaign_view`, evento `plan_click`, evento `first_response_generated` e metricas por UTM/campanha no admin.
- `docs/ads-validation-plan.md` e `docs/pre-ads-checklist.md` documentam objetivo, rotas, eventos, metricas, criterio de pausa e checklist antes de ligar anuncios.
- Schema Supabase tem tabelas esperadas, RLS e policies por `auth.uid()` para dados de usuario.
- `.env`, `.env.local`, `.next`, `node_modules` e tsbuildinfo estao ignorados no Git.
- `docs/deploy-vercel.md`, `docs/production-checklist.md`, `docs/tracking.md`, `docs/billing.md`, `docs/emails.md`, `docs/admin.md` e checklists existem.
- `/api/health` retorna `200`.
- Middleware preserva rotas publicas e webhooks, protege rotas privadas antes do render e redireciona para `/login?redirectTo=...`.
- `ADMIN_EMAILS` foi isolado em helper testavel com normalizacao de espacos e caixa baixa.
- `SECURITY.md` documenta rotas publicas, privadas, admin, padrao Supabase e limite do cookie `atendezap_auth_hint`.
- `docs/e2e-plan.md` documenta fluxos principal, admin e seguranca para a proxima etapa.
- Playwright foi adicionado com `npm run test:e2e` para validar paginas publicas, `/api/health`, funil do ebook com UTMs, demo publica e bloqueio de rotas/APIs privadas sem login.
- Testes Vitest cobrem normalizacao/autorizacao admin, payloads invalidos de lead/demo/IA, isolamento por `user_id` na API/telas SaaS e webhook Stripe para assinatura invalida, evento sem `user_id`, Pro promocional, cancelamento e pagamento falho.
- `docs/testing.md` documenta como rodar unitarios/e2e, como testar sem Stripe/OpenAI/Resend reais e como validar webhook com Stripe CLI.
- `docs/staging-deploy.md` documenta o deploy staging na Vercel, separando local, staging e producao.
- `docs/post-deploy-checklist.md` cobre validacao manual pos-deploy para publico, auth, dashboard, Stripe, admin, tracking e mobile.
- `docs/stripe-staging.md`, `docs/supabase-staging.md`, `docs/resend-staging.md` e `docs/openai-staging.md` detalham configuracao real das integracoes em staging.
- `.env.example` lista as variaveis esperadas sem segredos reais, incluindo `NEXT_PUBLIC_APP_ENV`, Supabase, Stripe, OpenAI, Resend, tracking, Upstash, Sentry e admin.
- Login sanitiza `redirectTo` e so redireciona para caminhos internos, evitando URL externa em ambiente staging/producao.
- `docs/release-candidate.md` resume status, bloqueadores, pendencias externas e criterios para publicar.
- `docs/controlled-launch-checklist.md` define o roteiro para liberar para poucos usuarios antes de anuncios.
- Dashboard reforcado: exclusao de historico, exclusao de clientes e edicao de clientes agora filtram por `user_id` autenticado alem de depender da RLS.
- `docs/production-launch-checklist.md` cobre a validacao final antes do deploy real.
- `docs/controlled-launch-plan.md` define fases de teste interno, primeiros usuarios, ajustes e anuncios pequenos.
- `docs/monitoring.md` documenta onde acompanhar Vercel, Supabase, Stripe, Resend, OpenAI, GA4 e Meta Pixel.
- `docs/support.md` documenta respostas para suporte minimo de conta, pagamento, cancelamento, ebook e IA.
- `docs/first-users-feedback.md`, `docs/bug-triage.md` e `docs/support-messages.md` documentam roteiro com primeiros usuarios, classificacao rapida de bugs e respostas prontas de suporte.
- `docs/product-metrics.md` documenta calculo, interpretacao e limitacoes das metricas internas.
- `docs/rollback-plan.md` documenta reversao para falhas de deploy, Stripe, Supabase, OpenAI e anuncios.
- `docs/first-7-days-checklist.md` documenta a rotina diaria inicial.

## Parcial

- Auth: cadastro, login e logout existem; fluxo precisa de teste real em Supabase com confirmacao de e-mail ligada/desligada.
- Middleware: melhora o bloqueio de paginas antes do render, mas ainda usa cookie nao sensivel de hint porque a sessao atual do Supabase fica no browser/localStorage.
- Dashboard: a superficie principal funciona, mas concentra muita regra em um componente grande e ainda convive com modulos legados.
- Onboarding: o onboarding real do SaaS fica no dashboard e salva em `businesses`; `/onboarding` agora redireciona para essa superficie.
- Assinatura: dashboard e `/assinatura` refletem Supabase/Stripe, com testes automatizados de checkout/portal/webhook; ainda falta teste ponta a ponta real com Stripe em modo test.
- Supabase: RLS esta documentado/aplicado no SQL e ha testes de regressao para filtros por `user_id`; ainda falta teste contra Supabase real com dois usuarios.
- Feedback: implementado para producao controlada, mas depende da migration `0008_user_feedback.sql` aplicada no Supabase real antes de convidar usuarios.
- Tracking: eventos principais existem e no-op sem GA4/Meta Pixel, mas falta validacao com ferramentas reais em producao.
- Metricas: admin mostra agregados internos confiaveis para primeiros usuarios; visitantes anonimos ainda dependem de GA4/Meta Pixel.
- Admin: metricas, filtros, relatorio de campanha e CSV existem; helpers e bloqueio sem sessao tem testes, mas nao ha endpoint dedicado de exportacao server-side nem teste e2e com sessao admin real.
- SEO: metadados basicos existem; falta imagem OG padrao configurada se o ativo final existir.
- Resend: entrega do ebook esta pronta, mas sequencia de nutricao e descadastro ainda nao estao implementados.
- Release candidate: pronto para staging avancado e producao controlada com poucos usuarios; liberacao depende da execucao do checklist real com integracoes externas.
- Monitoramento: playbook manual criado; alertas automaticos ainda dependem de Sentry/Vercel/Stripe/GA4/Meta configurados.

## Quebrado ou ausente

- Rotas legadas fora do fluxo principal ainda usam localStorage e podem confundir o escopo de producao.
- Protecao de pagina ainda nao e autenticação server-side real por cookie Supabase SSR; o middleware atual e uma barreira de UX/compatibilidade e as APIs/RLS continuam autoritativas.
- Nao ha testes e2e autenticados para cadastro -> onboarding -> gerar resposta -> checkout -> webhook -> dashboard ativo.
- Nao ha teste automatizado de RLS contra Supabase real; a cobertura atual usa mocks e regressao de filtros por `user_id`.
- Nao ha teste automatizado de webhook Stripe com assinatura real gerada pela Stripe CLI; ha cobertura com mocks para assinatura invalida, atualizacao, cancelamento e pagamento falho.
- Fluxos legados/localStorage continuam acessiveis e podem confundir o escopo de producao.
- Nao ha evidencia ainda de validacao manual completa em Vercel staging com Supabase, Stripe, Resend, OpenAI, tracking e admin reais.
- Nao ha evidencia ainda de validacao manual do novo fluxo de feedback em Supabase staging/producao.
- Nao ha evidencia ainda de validacao manual das metricas internas contra dados reais de staging/producao.
- Nao ha evidencia ainda de validacao manual do relatorio de campanha contra dados reais de campanha.
- Pode rodar anuncios pequenos com orcamento baixo somente depois de validar no ambiente final: checkout real/test, webhook, pixels, e-mail, OpenAI, admin, UTMs e rotina operacional. Ainda nao esta pronto para escalar trafego pago.

## Prioridade maxima

- Fazer deploy staging na Vercel seguindo `docs/staging-deploy.md`.
- Rodar um teste ponta a ponta em Supabase/Stripe test mode: cadastro, onboarding, geracao, checkout, webhook e portal.
- Validar em staging que `NEXT_PUBLIC_APP_URL` monta redirects corretos de Stripe e links de e-mail.
- Executar `docs/production-launch-checklist.md` antes de liberar usuarios reais.

## Bugs criticos

- Nenhum erro de build, lint ou API publica basica foi encontrado no ambiente local.
- Risco critico de produto removido das rotas `/assinatura` e `/onboarding`; ainda existem superficies legadas fora do fluxo principal.
- Nenhum bug critico de Stripe ficou aberto no codigo revisado; o risco restante e externo: configurar produtos, prices, cupom, webhook secret e aplicar migrations no Supabase correto.
- Bloqueador corrigido nesta etapa: mutacoes de clientes/historico no dashboard agora incluem filtro explicito por `user_id`.
- Nenhum novo bloqueador de codigo foi identificado na revisao operacional; mensagens criticas usam erros controlados e devem ser validadas no fluxo real.

## Bugs medios

- Duplicacao de cliente Supabase browser.
- Rotas legadas visiveis no app ainda falam em localStorage/mock/Supabase planejado.
- Admin tem teste de normalizacao de `ADMIN_EMAILS`, mas ainda falta teste de rota completa com usuario comum e token real.
- Falta fluxo de recuperacao de senha.
- Falta teste automatizado de limite mensal concorrente; duas geracoes simultaneas podem passar pelo mesmo contador antes do insert.

## Para consolidar acima de 80/100

- Executar `docs/post-deploy-checklist.md` completo em staging.
- Evoluir a suite e2e curta para fluxos autenticados com Supabase test mode: cadastro, dashboard, assinatura e admin real.
- Planejar migracao para Supabase SSR cookies se for necessario validar paginas privadas diretamente no middleware com token real.
- Validar manualmente Stripe test mode com webhook local ou Vercel preview.
- Aplicar `supabase/migrations/0007_stripe_subscription_aliases.sql` no ambiente de teste.
- Aplicar `supabase/migrations/0008_user_feedback.sql` no ambiente de teste/producao controlada.
- Validar Resend com remetente real e confirmar `lead_email_events`.
- Marcar claramente ou esconder rotas legadas que nao fazem parte do SaaS vendavel.

## Para chegar em 90/100

- Deploy staging real na Vercel com `NEXT_PUBLIC_APP_URL` correto.
- Supabase staging validado com RLS e dois usuarios.
- Stripe test mode validado com checkout, webhook assinado, portal e cancelamento.
- Resend e OpenAI validados em staging.
- Admin validado com usuario admin e usuario comum.
- Mobile revisado manualmente no ambiente Vercel.
- Decisao de produto sobre esconder ou documentar rotas legadas autenticadas com demo/localStorage.

## Para chegar em 100/100

- Testes e2e completos multiusuario com RLS.
- Observabilidade de producao com Sentry configurado, alertas e dashboard de erros.
- Auditoria juridica real de Termos/Privacidade/LGPD.
- Webhook Stripe com testes de idempotencia, replay e eventos fora de ordem.
- Controle transacional/atomicidade melhor para uso mensal.
- Portal de assinatura integrado e unico, sem superficies simuladas.
- Admin com paginacao server-side, exportacao auditavel e mascaramento de dados sensiveis.
- Politica de retencao/exclusao de dados e descadastro de e-mails.
- Playbook de incidentes, backups Supabase e restore testado.
- Alertas automaticos para falhas de checkout, webhook, e-mail e IA.
- Alertas automaticos para novos feedbacks P0/P1.
- Views ou queries agregadas para metricas se o volume superar a fase de primeiros usuarios.

## Comandos executados

- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run test:e2e`
- Validacao automatizada da rota agregada `/api/admin/campaign-report`.
- Revisao operacional de mensagens de erro criticas, fallback de integracoes e admin inicial.
- `npm install --dry-run`
- Smoke test browser em `/`, `/ebook`, `/ebook/obrigado`, `/ebook/guia`, `/demo`, `/precos`, `/termos`, `/privacidade` e 404.
- Smoke mobile em `/`, `/ebook`, `/ebook/obrigado`, `/demo`, `/precos`, `/login`, `/cadastro`, `/dashboard`, `/onboarding`, `/assinatura`, `/admin`, `/termos`, `/privacidade`.
- Smoke API em `/api/health`, `/api/ai/generate-response`, `/api/stripe/create-checkout-session`, `/api/admin/overview`.
- Testes automatizados de Stripe para checkout sem login, plano invalido, Starter, Pro com cupom, Premium, portal, webhook invalido, mapeamento do Pro promocional, cancelamento e pagamento falho.
- Checklist e relatorio de validacao Stripe criados em `docs/stripe-validation-checklist.md` e `docs/stripe-validation-report.md`.
- Testes automatizados da API de feedback para payload invalido, feedback publico, feedback autenticado e atualizacao admin.
- Testes automatizados da API de metricas para agregados e bloqueio de usuario comum.

## Pendencias externas

- Vercel: criar projeto staging, preencher envs, definir `NEXT_PUBLIC_APP_URL`, rodar deploy e health check.
- Supabase: aplicar migrations no projeto staging, validar RLS, Auth URLs e isolamento com dois usuarios.
- Supabase: aplicar migration de feedback e validar criacao publica/autenticada e leitura no admin.
- Admin: validar `/api/admin/metrics` com usuario admin e usuario comum no ambiente real.
- Admin: validar `/api/admin/campaign-report` com usuario admin e usuario comum no ambiente real.
- Stripe: rodar `npm run stripe:setup-products`, copiar price IDs/cupom para `.env.local`/Vercel, configurar webhook e validar eventos em modo test seguindo `docs/stripe-local-test.md` e `docs/stripe-staging.md`.
- Resend: validar dominio/remetente e testar entrega real seguindo `docs/resend-staging.md`.
- OpenAI: configurar chave/modelo de staging, testar dashboard/demo e monitorar custos seguindo `docs/openai-staging.md`.
- GA4: configurar Measurement ID e validar eventos em staging.
- Meta Pixel: configurar Pixel ID e validar eventos em staging.
- Sentry: configurar DSN/token e revisar alertas.
- Operacao: executar monitoramento diario, suporte minimo e rotina dos primeiros 7 dias durante producao controlada.

## Proximos passos recomendados

1. Executar `docs/production-launch-checklist.md` no ambiente final.
2. Liberar producao controlada seguindo `docs/controlled-launch-plan.md`.
3. Monitorar diariamente com `docs/monitoring.md` e `docs/first-7-days-checklist.md`.
4. Manter `docs/rollback-plan.md` pronto antes de iniciar anuncios.

## Validacao final de prontidao - 2026-05-22

- Status final: pronto para producao controlada com primeiros usuarios, condicionado a smoke test no ambiente real com integracoes externas configuradas.
- Nota estimada nova: 93/100.
- Bloqueadores atuais: nenhum bloqueador de codigo identificado; a liberacao real depende de Supabase, Stripe, Resend, OpenAI, Vercel, dominio, GA4/Meta e admin validados no ambiente final.
- Pendencias nao bloqueantes: SSR cookies para auth de pagina, reducao de superficies legadas, recuperacao de senha, e2e autenticado real, webhook Stripe com assinatura real automatizada, atomicidade do limite mensal e alertas automaticos.
- Pode liberar primeiros usuarios: sim, em producao controlada, apos executar `docs/final-smoke-test.md` e `docs/post-deploy-checklist.md`.
- Pode iniciar anuncios pequenos: sim, com orcamento baixo, depois de executar `docs/pre-ads-checklist.md` e validar checkout, webhook, tracking, e-mail, OpenAI e suporte minimo no ambiente final.
- Proximo passo recomendado: fazer deploy staging/producao controlada na Vercel, preencher envs sem segredos no codigo, executar smoke final completo e liberar 3 a 5 usuarios por convite antes de anuncios.

## Preparacao para primeiros usuarios - 2026-05-22

- Estrutura criada: rota `/feedback`, API `/api/feedback`, migration `0008_user_feedback.sql`, eventos de tracking de feedback e listagem simples no admin.
- Suporte inicial: `docs/support-messages.md` com respostas prontas, `docs/first-users-feedback.md` com roteiro de entrevista e `docs/bug-triage.md` com classificacao P0/P1/P2/P3.
- UX revisada: dashboard explica que a IA gera sugestoes para copiar, ajustar e enviar manualmente pelo WhatsApp; estados vazios e mensagens de limite/assinatura orientam o proximo passo.
- Recomendacao atualizada: liberar 3 a 5 usuarios reais por convite apos aplicar migrations no Supabase real e validar o smoke test final.

## Metricas internas de produto - 2026-05-22

- Estrutura criada: rota protegida `/api/admin/metrics`, secao "Metricas do produto" no admin e documentacao `docs/product-metrics.md`.
- Metricas disponiveis: lead -> cadastro, cadastro -> onboarding, onboarding -> primeira resposta, cadastro -> assinatura ativa, usuarios ativados, uso por periodo, feedbacks por tipo/status e checkout iniciado aproximado.
- Limitacoes documentadas: lead -> cadastro por e-mail, checkout iniciado por dados de `subscriptions`, visitantes anonimos via GA4/Meta e calculo em memoria adequado apenas para fase inicial.
- Recomendacao atualizada: acompanhar metricas e feedback diariamente antes de investir em trafego pago maior.

## Preparacao para anuncios pequenos - 2026-05-22

- Pagina direta criada: `/atendimento-whatsapp-ia`, com promessa clara, dor principal, demo, ebook, CTA para planos e Plano Pro com primeiro mes por R$ 29 para novos usuarios.
- Landing revisada para trafego frio: primeira dobra agora destaca demo, ebook, planos e criacao de conta, sem restringir publico a empresas.
- CTAs revisados em landing, demo, ebook e obrigado para reduzir ambiguidades no funil.
- Tracking revisado: `campaign_view`, `plan_click` e `first_response_generated` adicionados, mantendo GA4/Meta opcionais.
- Admin/metricas revisado: `/api/admin/metrics` retorna leads por UTM source/campaign, cadastros aproximados por campanha, checkouts e assinaturas ativas por campanha quando houver metadata.
- Documentos criados: `docs/ads-validation-plan.md` e `docs/pre-ads-checklist.md`.
- Status para trafego pago: pronto para orcamento baixo com ressalvas externas; nao pronto para escala ate validar ambiente real e obter sinais de conversao/feedback.

## Relatorio de campanha e validacao comercial - 2026-05-23

- Estrutura criada: rota protegida `/api/admin/campaign-report`, secao "Relatorio de campanha" no admin, filtros por periodo/UTM, exportacao CSV agregada e interpretacao simples por regras.
- Metricas disponiveis: leads totais, leads por source/campaign, cadastros, onboardings, usuarios ativados, demo usada, primeira resposta, checkout iniciado, assinaturas ativas, feedbacks, dificuldade de uso e taxas principais do funil.
- Documentos criados: `docs/campaign-analysis.md` e `docs/campaign-daily-checklist.md`.
- Documentos atualizados: `docs/ads-validation-plan.md` e `docs/pre-ads-checklist.md`.
- Limitacoes restantes: visitantes e custo dependem de GA4/Meta/plataforma de anuncios; demo usada depende da tabela interna `events`; cadastro por campanha e aproximado por e-mail; checkout iniciado e aproximado por `subscriptions`.
- Recomendacao atualizada: pronto para campanha pequena somente apos validar ambiente real e usar o relatorio diariamente para decidir continuar, ajustar ou pausar. Nao pronto para escalar anuncios.
- Nota estimada nova: 94/100.

## Ciclo de melhoria pos-campanha - 2026-05-23

- Documentos criados: `docs/post-campaign-diagnosis.md`, `docs/improvement-prioritization.md`, `docs/weekly-growth-review.md`, `docs/product-growth-backlog.md` e `docs/growth-experiments.md`.
- Processo: revisar dados reais do funil, classificar gargalos por impacto/frequencia/esforco/risco, corrigir P0/P1 antes de aumentar anuncios e registrar a decisao semanalmente.
- Recomendacao de proximos ajustes: priorizar o gargalo que aparecer entre lead -> cadastro, cadastro -> onboarding, onboarding -> primeira resposta, primeira resposta -> checkout ou checkout -> assinatura.
- Nota estimada nova: 95/100.

## Stripe billing completo - 2026-05-23

- Estrategia Pro: `STRIPE_PRICE_PRO` recorrente + cupom `duration=once` em `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.
- `STRIPE_PRICE_PRO_FIRST_MONTH_29` nao e usado pelo checkout novo; fica como compatibilidade para mapear eventos antigos/promocionais para `plan = "pro"`.
- Checkout usa `/assinatura?checkout=success` e `/assinatura?checkout=cancel`.
- Customer Portal retorna para `/assinatura`.
- Documentacao criada: `docs/stripe-setup.md`.
- Status: pronto para teste real com Stripe test mode apos configurar products, prices, coupon, webhook, portal e envs no ambiente final.
- Nota estimada nova: 96/100.

## Stripe test mode local - 2026-05-24

- Script revisado: `scripts/setup-stripe-products.mjs` cria ou reutiliza produtos `AtendeZap IA Starter`, `AtendeZap IA Pro` e `AtendeZap IA Premium`, prices mensais recorrentes em BRL e cupom Pro `duration=once`.
- O script carrega `.env` e `.env.local`, usa `STRIPE_SECRET_KEY` somente em runtime local/servidor, imprime apenas `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_PREMIUM` e `STRIPE_PRO_FIRST_MONTH_COUPON_ID`, e nao imprime a secret key.
- Checkout revisado: Starter usa `STRIPE_PRICE_STARTER`, Pro usa `STRIPE_PRICE_PRO` com cupom `STRIPE_PRO_FIRST_MONTH_COUPON_ID` quando elegivel, Premium usa `STRIPE_PRICE_PREMIUM`, e a metadata preserva `user_id`, `plan`, `price_id` e UTMs.
- Webhook revisado: continua validando assinatura com raw body, trata checkout, subscription created/updated/deleted e invoices paid/failed, e atualiza campos de assinatura no Supabase incluindo `updated_at`.
- `/assinatura` reforca a oferta "Primeiro mês por R$ 29 para novos usuários", le assinatura real no Supabase, mostra status, limite, uso mensal e portal Stripe.
- Documentacao local criada: `docs/stripe-local-test.md`, com setup de `.env.local`, execucao do script, webhook CLI, checkout dos tres planos e conferencia no Supabase/dashboard.
- Testes revisados: cobertura de cupom apenas no Pro, mapeamento Pro com cupom como `plan = "pro"`, cancelamento e pagamento bem-sucedido/falho por webhook.
- Pendencias externas restantes: rodar o script com chave Stripe test real, copiar IDs para `.env.local`, executar `stripe listen`, fazer checkout real dos tres planos, confirmar webhook no Supabase e repetir em Vercel Preview/Staging.
- Nota estimada nova: 97/100.

## Validacao ponta a ponta Stripe - 2026-05-24

- Fluxo revisado: checkout, portal, webhook, mapeamento de planos, middleware, `/assinatura`, dashboard e migrations Supabase.
- Variaveis esperadas confirmadas em `.env.example`: App URL, Stripe publishable/secret/webhook, price IDs, cupom Pro, Supabase URL/anon/service role e OpenAI.
- Checkout segue protegido por auth: sem sessao retorna 401, plano invalido retorna 400, Starter/Pro/Premium usam price IDs server-side e Pro aplica cupom somente quando configurado.
- `StripeCheckoutButton` revisado: mostra loading, desabilita durante carregamento, ignora clique duplo, mostra erro amigavel, redireciona para Stripe Checkout e nao contem secret key nem price IDs.
- Webhook segue publico no middleware, usa raw body via `request.text()`, valida `STRIPE_WEBHOOK_SECRET`, rejeita assinatura invalida e trata checkout, subscription created/updated/deleted e invoices paid/failed.
- Supabase revisado: migrations/schema tem `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`, `plan`, `current_period_start`, `current_period_end`, `monthly_limit`, `usage_count` e `updated_at`.
- `/assinatura` e dashboard leem assinatura real de `subscriptions`, mostram status/limite/uso/periodo, tratam cancelada/inativa como sem plano ativo e abrem Customer Portal quando ha customer Stripe.
- Documentos criados: `docs/stripe-validation-checklist.md` e `docs/stripe-validation-report.md`.
- Testes automatizados reforcados: portal sem login retorna 401, portal sem customer retorna erro amigavel, Pro com cupom continua `plan = "pro"`, cancelamento fica `canceled` e invoice falha/sucesso atualizam status de pagamento.
- Status: pronto para executar validacao real com Stripe test mode, Stripe CLI e Supabase de teste; ainda nao validado de ponta a ponta com provedores reais neste ambiente.
- Nota estimada nova: 97/100.

## Supabase seguranca e isolamento - 2026-05-24

- Estrutura auditada: migrations, `supabase/schema.sql`, clientes Supabase, helpers de auth, APIs publicas/privadas, dashboard, `/assinatura`, admin, onboarding, historico, leads, feedbacks, subscriptions e uso mensal.
- Tabelas essenciais confirmadas com os nomes reais do projeto: `profiles`, `businesses`, `generated_responses`, `subscriptions`, `ebook_leads`, `lead_email_events` e `user_feedback`.
- RLS revisado: tabelas por usuario usam `auth.uid()`; `subscriptions` fica somente leitura para usuario autenticado; leads, eventos de e-mail, webhooks, pedidos, kits e eventos internos nao ficam listaveis pelo client.
- Isolamento multiusuario revisado: dashboard, geracao de IA, `/assinatura` e portal Stripe usam o usuario autenticado e filtros por `user_id`, sem confiar em `user_id` arbitrario vindo do client.
- Service role reforcada: `src/lib/supabase/server.ts` agora importa `server-only`; teste automatizado verifica que componentes client nao importam service role nem `SUPABASE_SERVICE_ROLE_KEY`.
- Migrations: nenhuma migration nova foi necessaria; o schema existente ja cobre campos, indices e policies esperados. Nao houve `DROP TABLE` nem alteracao destrutiva.
- Documentos criados: `docs/supabase-security.md` e `docs/supabase-production-checklist.md`.
- Pendencias externas restantes: aplicar migrations no Supabase real/staging, conferir policies/grants no painel, testar usuario A vs usuario B, validar admin comum/admin real e confirmar Auth URLs/Redirect URLs.
- Nota estimada mantida: 97/100; pode subir apos teste manual de RLS e isolamento no Supabase real.

## Resend e funil de e-mail do ebook - 2026-05-24

- Fluxo auditado: `/ebook`, `EbookLeadForm`, `/api/ebook-lead`, `src/lib/email.ts`, `src/lib/resend.ts`, `/ebook/obrigado`, `/ebook/guia`, admin overview, `ebook_leads` e `lead_email_events`.
- API de lead reforcada: o lead precisa ser salvo no Supabase antes da tentativa de envio; se o Supabase falhar, retorna erro amigavel e nao tenta enviar e-mail.
- Resend reforcado: `RESEND_API_KEY` e `EMAIL_FROM` sao validados no servidor; quando faltam, o lead continua salvo e o evento usa `status = skipped_not_configured`.
- Template do ebook revisado: assunto `Seu guia gratuito do AtendeZap IA esta aqui`, CTA principal para `/ebook/guia`, CTA secundario para `/demo`, links absolutos com `NEXT_PUBLIC_APP_URL` e aviso de solicitacao do guia.
- Admin revisado: lista de leads mostra status do envio, data/evento e erro resumido; metricas agora separam enviados, falhas e Resend nao configurado.
- Schema/migrations: `lead_email_events` recebeu indice seguro por `status` via `0010_lead_email_events_status_index.sql`; nenhuma tabela foi removida ou duplicada.
- Documentos criados/atualizados: `docs/resend-setup.md`, `docs/email-funnel-checklist.md` e `docs/emails.md`.
- Testes adicionados/reforcados: validacao de lead, UTMs, Resend ausente, falha/sucesso de envio, falha ao salvar lead, template de e-mail e CTAs de obrigado/guia.
- Pendencias externas restantes: configurar dominio/remetente no Resend, preencher envs em staging/Vercel, enviar lead real e confirmar `lead_email_events` no Supabase.
- Nota estimada mantida: 97/100; pode subir apos teste real de entrega Resend em staging.

## Deploy Vercel staging/producao controlada - 2026-05-24

- Configuracao auditada: `package.json`, `next.config.mjs`, middleware, rotas API, `/api/health`, `.env.example`, Supabase clients, Stripe redirects/webhook, Resend, OpenAI, tracking, Sentry opcional e documentacao existente.
- Health check revisado: `/api/health` retorna `status`, `environment` e `timestamp`, sem expor chaves, banco ou configuracoes sensiveis.
- `NEXT_PUBLIC_APP_URL` revisado: usado para Stripe Checkout, Customer Portal, e-mails do ebook e metadados; fallback `localhost` aparece apenas em desenvolvimento local/documentacao.
- Middleware revisado: `/api/stripe/webhook` segue publico e nao depende de login; APIs privadas e admin continuam protegidas.
- Variaveis de Vercel revisadas em `.env.example`: App, Supabase, OpenAI, Stripe, Resend, Tracking, Admin, Upstash e Sentry sem valores reais.
- Documentos criados: `docs/vercel-deploy.md`, `docs/supabase-vercel.md`, `docs/staging-vercel-checklist.md` e `docs/deploy-troubleshooting.md`.
- Pendencias externas restantes: criar projeto Vercel, preencher envs por ambiente, aplicar migrations Supabase, configurar webhook Stripe, validar Resend/OpenAI/tracking/admin em staging e depois repetir no dominio final.
- Status: pronto para deploy staging; producao controlada somente apos checklist staging verde.
- Nota estimada mantida: 97/100 ate validacao real na Vercel.

## Validacao pos-deploy staging - 2026-05-24

- Relatorio criado: `docs/staging-validation-report.md`.
- Status real desta etapa: nao validado em staging publicado, porque a URL/projeto Vercel do AtendeZap IA nao foi encontrado no repositorio nem entre os projetos disponiveis pelo conector da Vercel nesta sessao.
- Bugs reais de staging encontrados: nenhum confirmado sem acesso a URL/logs do deploy.
- Bugs corrigidos: nenhuma correcao de runtime remoto aplicada; a revisao ficou limitada a documentacao, descoberta de projeto/URL e validacoes locais.
- Pendencias externas restantes: informar URL staging, confirmar envs da Vercel, aplicar migrations Supabase staging, configurar Auth URLs, configurar webhook Stripe staging, validar Resend/OpenAI/tracking/admin e executar o checklist completo.
- Recomendacao: ainda nao liberar primeiros usuarios. Liberar apenas para staging avancado quando a URL for fornecida e o checklist pos-deploy for executado de ponta a ponta.
- Nota operacional estimada: 96/100 ate validar o ambiente Vercel real com provedores configurados.

## Producao controlada - 2026-05-24

- Documentacao criada: `docs/production-readiness.md`, `docs/domain-checklist.md`, `docs/stripe-production.md`, `docs/supabase-production.md`, `docs/resend-production.md`, `docs/openai-production.md`, `docs/tracking-production.md`, `docs/go-live-checklist.md` e `docs/first-users-launch.md`.
- URLs revisadas: codigo usa `NEXT_PUBLIC_APP_URL`/`VERCEL_URL` para links absolutos, Stripe, e-mails e metadados; `localhost` aparece apenas como fallback local controlado, testes ou documentacao.
- Seguranca revisada: `.gitignore` ignora arquivos `.env`, `.env.example` segue sem valores reais, service role/OpenAI/Resend/Stripe secrets aparecem apenas em codigo server-side ou testes.
- Copy publica revisada por busca: nao ha dominio fixo de staging no codigo; textos de mock/simulacao permanecem em superficies legadas fora do fluxo SaaS principal e devem ser avaliados antes de escalar trafego.
- Status de producao controlada: pronto documentalmente para go-live controlado com 3 a 5 usuarios, condicionado a validacao real no dominio final.
- Pendencias externas: dominio final, Vercel Production envs, Supabase producao/RLS/Auth URLs, Stripe live/webhook, Resend dominio/remetente, OpenAI custo/modelo, tracking GA4/Meta e admin real.
- Riscos restantes: auth de pagina ainda usa cookie de hint, superficies legadas ainda existem, nao ha e2e autenticado real contra provedores e staging publicado ainda precisa ser confirmado.
- Recomendacao final: nao escalar anuncios. Liberar primeiros usuarios somente depois de `docs/go-live-checklist.md` verde no dominio final.
- Nota operacional estimada mantida: 96/100 ate validar dominio final e provedores de producao.

## Go-live controlado com primeiros usuarios - 2026-05-24

- Documentacao criada: `docs/controlled-go-live-report.md`, `docs/first-users-validation-checklist.md`, `docs/first-users-interview.md`, `docs/launch-bugs.md` e `docs/launch-day-monitoring.md`.
- Suporte atualizado: `docs/support.md` e `docs/support-messages.md` agora cobrem como comecar, envio manual no WhatsApp, teste/pagamento, cancelamento, pagamento sem liberacao, ebook nao recebido, resposta ruim e limite mensal.
- Estados vazios revisados: dashboard, historico, clientes, assinatura, admin e feedback ja orientam proximo passo; foi corrigido texto visivel do formulario de feedback e de metricas de feedback no admin.
- Admin revisado para primeiros usuarios: ja mostra leads recentes, usuarios, assinaturas, feedbacks, uso/metricas agregadas, campanhas/UTMs e CSV de leads/campanha sem criar dashboard novo.
- Pendencias externas: executar o checklist em producao real, preencher URL/data no relatorio, registrar bugs reais e validar logs/provedores durante os testes.
- Riscos conhecidos: qualquer P0/P1 em cadastro, login, IA, checkout, webhook, dashboard, admin ou isolamento deve pausar novos convites.
- Recomendacao: liberar para 3 a 5 usuarios depois do go-live tecnico verde; anuncios pequenos somente depois de feedback positivo e ausencia de P0/P1.
- Nota operacional estimada mantida: 96/100 ate validar uso real com primeiros usuarios.

## Correcoes pos-go-live e preparacao pre-anuncios - 2026-05-24

- Relatorios revisados: `docs/controlled-go-live-report.md`, `docs/launch-bugs.md`, `docs/first-users-validation-checklist.md`, `docs/first-users-interview.md`, `docs/launch-day-monitoring.md`, `docs/final-readiness-report.md` e `docs/support.md`.
- Bugs P0/P1 encontrados: nenhum bug real registrado nos documentos atuais.
- Correcoes de experiencia: demo publica reforca que a IA gera sugestoes para copiar, ajustar e enviar manualmente; CTA pos-demo agora conecta melhor com criacao de conta e historico salvo.
- Correcoes de feedback: dashboard exibe CTA para feedback depois de resposta gerada, com evento `feedback_cta_click`.
- Documentos criados: `docs/post-go-live-fixes.md` e `docs/pre-ads-final-checklist.md`.
- Pendencias restantes: executar nova rodada com 3 a 5 usuarios, preencher URL/data reais do go-live, validar provedores no dominio final e corrigir qualquer P0/P1 antes de anuncios.
- Recomendacao: pronto para nova rodada controlada com usuarios; anuncios pequenos somente depois de checklist pre-anuncio verde e ausencia de P0/P1 aberto.
- Nota operacional estimada mantida: 96/100 ate haver validacao real pos-go-live.

## Primeira campanha paga pequena - 2026-05-24

- Documentos criados: `docs/first-paid-campaign-plan.md`, `docs/first-campaign-daily-checklist.md`, `docs/first-campaign-report.md`, `docs/campaign-utm-links.md`, `docs/ads-pause-criteria.md`, `docs/scale-ads-checklist.md` e `docs/tracking-setup.md`.
- Documentos atualizados: `docs/pre-ads-final-checklist.md`, `docs/tracking.md` e `docs/final-readiness-report.md`.
- Admin revisado: relatorio de campanha existente ja cobre leads, cadastros, onboarding, usuarios ativados, demo, primeira resposta, checkout, assinaturas, feedbacks, leads por `utm_source` e leads por `utm_campaign`.
- Ajuste pequeno no admin: bloco "Diagnostico do funil" com mensagens acionaveis para lead -> cadastro, cadastro -> onboarding, onboarding -> primeira resposta, primeira resposta -> checkout e checkout -> assinatura.
- Tracking revisado: eventos principais existem em `src/lib/tracking.ts` e chamadas foram confirmadas em landing, ebook, demo, cadastro, onboarding/dashboard, checkout, assinatura e feedback.
- UTMs revisadas: lead salva `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term`; checkout recebe UTMs em metadata; admin mostra e filtra UTMs dos leads.
- Riscos conhecidos: visitantes e custo por etapa dependem de GA4/Meta/plataforma externa; o app nao recebe gasto de midia automaticamente.
- Recomendacao: rodar campanha pequena somente com checklist final verde; acompanhar diariamente e pausar se houver P0, tracking quebrado, lead sem salvar, IA sem gerar, checkout quebrado ou webhook sem liberar plano.
- Nota operacional estimada mantida: 96/100 ate haver dados reais de campanha.

## Analise pos-primeira campanha e segunda rodada - 2026-05-24

- Status dos dados: sem numeros reais preenchidos nos relatorios atuais; a etapa ficou preparada para analise posterior e pequenas melhorias preventivas.
- Documentos criados: `docs/first-campaign-analysis.md`, `docs/funnel-diagnosis.md`, `docs/post-campaign-improvement-plan.md` e `docs/second-campaign-plan.md`.
- Documentos atualizados: `docs/first-campaign-report.md`, `docs/first-paid-campaign-plan.md`, `docs/ads-pause-criteria.md`, `docs/scale-ads-checklist.md`, `docs/tracking.md` e `docs/tracking-setup.md`.
- Melhorias aplicadas: CTA pos-demo mais claro, evento `demo_ebook_cta_click`, pagina de obrigado com CTAs separados para demo/cadastro/planos e diagnostico do admin para poucos leads.
- Admin revisado: metricas de campanha, filtros por UTM, subscriptions, feedbacks e diagnostico continuam simples e agregados; nao foi criado dashboard complexo.
- Pendencias restantes: preencher relatorio da primeira campanha com dados reais, identificar gargalo principal, corrigir qualquer P0/P1 real e validar a hipotese antes de aumentar orcamento.
- Recomendacao: rodar segunda campanha pequena somente com uma hipotese clara e tracking validado; nao aumentar orcamento sem dados suficientes.
- Nota operacional estimada mantida: 96/100 ate haver resultados reais e checklist de escala verde.

## Segunda campanha com variacoes controladas - 2026-05-24

- Estrutura criada: `docs/second-campaign-execution.md`, `docs/second-campaign-utm-links.md`, `docs/second-campaign-creatives.md`, `docs/second-campaign-report.md` e `docs/second-campaign-decision-criteria.md`.
- Pagina de campanha revisada: `/atendimento-whatsapp-ia` continua sendo a rota dedicada para trafego pago, sem criar rota paralela.
- Variações preparadas: entrada por demo, ebook, landing principal, pagina direta de campanha e destaque Pro R$ 29.
- Tracking revisado: CTAs da pagina de campanha usam eventos `campaign_demo_cta_click`, `campaign_ebook_cta_click`, `campaign_signup_cta_click`, `campaign_pricing_cta_click` e `campaign_pro_cta_click`.
- Admin revisado: relatorio de campanha agora inclui leads por `utm_content`, permitindo comparar criativo/variacao sem dashboard complexo.
- Documentos atualizados: `docs/tracking.md`, `docs/tracking-setup.md`, `docs/campaign-utm-links.md`, `docs/second-campaign-plan.md`, `docs/first-campaign-analysis.md`, `docs/post-campaign-improvement-plan.md` e `docs/scale-ads-checklist.md`.
- Pendencias externas: configurar links reais com dominio final, validar GA4/Meta Ads, preencher visitantes/custos fora do app e registrar resultados no relatorio.
- Recomendacao: rodar a segunda campanha com baixo orcamento e uma decisao por variacao; aumentar orcamento apenas com tracking confiavel, ativacao real e sem P0/P1.
- Nota operacional estimada mantida: 96/100 ate haver dados reais da segunda campanha.

## Analise da segunda campanha e escala cautelosa - 2026-05-24

- Status dos dados: sem resultados reais preenchidos para a segunda campanha; a decisao atual e nao escalar ainda.
- Documentos criados: `docs/second-campaign-analysis.md`, `docs/scale-decision-matrix.md`, `docs/cautious-scale-plan.md`, `docs/copy-iteration-notes.md` e `docs/third-campaign-prep-checklist.md`.
- Documentos atualizados: `docs/second-campaign-report.md` e `docs/scale-ads-checklist.md`.
- Admin revisado: ja permite comparar `utm_campaign`, `utm_content`, leads por variacao, checkouts aproximados e assinaturas agregadas; feedback por variacao depende de contexto/origem ou analise manual.
- Tracking revisado: eventos principais e eventos `campaign_*` existem no helper client-safe e nao devem quebrar sem GA4/Meta.
- Melhorias aplicadas: nenhuma mudanca de copy/produto aplicada, porque nao ha gargalo real comprovado nos dados atuais.
- Riscos conhecidos: visitantes, custos e parte da analise de criativos dependem de GA4/Meta Ads; o app nao recebe gasto de midia automaticamente.
- Decisao de escala: nao escalar ate preencher `docs/second-campaign-analysis.md` e passar pela matriz de decisao.
- Nota operacional estimada mantida: 96/100 ate haver dados reais, tracking validado e ausencia de P0/P1 em producao.

## Qualidade das respostas com IA - 2026-05-25

- Escopo: melhoria pequena e segura de qualidade da IA, sem WhatsApp direto, CRM, automacoes avancadas ou novas rotas comerciais.
- Geração auditada: `/api/ai/generate-response`, `src/lib/ai-response.ts`, dashboard, historico, demo publica, admin e testes existentes.
- Templates por nicho criados em `src/lib/ai/business-templates.ts`, cobrindo Autonomo, Prestador de servico, Loja, Delivery, Estetica, Restaurante, Assistencia tecnica e Outro.
- Prompt interno melhorado: agora inclui template do nicho, tipo de atuacao, tom de voz, contexto do negocio, perguntas comuns, informacoes importantes e regras explicitas contra inventar preco, prazo, disponibilidade ou confirmar agenda sem dados.
- Dashboard e demo publica: exemplos de perguntas agora seguem o tipo de atuacao selecionado.
- Avaliacao simples criada: usuario autenticado pode marcar resposta como util ou nao util e deixar comentario curto; feedback salvo em `ai_response_feedback` com RLS.
- Historico melhorado: respostas salvas passam a registrar tipo de atuacao, tom usado e exibem avaliacao quando existir.
- Admin: painel de metricas exibe qualidade agregada da IA com positivos, negativos, taxa util e comentarios recentes.
- Documentacao criada/atualizada: `docs/ai-business-templates.md`, `docs/ai-response-quality-plan.md`, `docs/roadmap-post-1.0.md` e `docs/README.md`.
- Pendencias restantes: aplicar migration `0011_ai_response_feedback.sql` no Supabase real, revisar feedbacks reais semanalmente e evoluir templates apenas com evidencia de uso.
- Nota operacional estimada atualizada: 97/100 para a etapa de qualidade da IA; escala ampla continua condicionada a dados reais, estabilidade e ausencia de P0/P1.

## Limites de uso, custo de IA e abuso - 2026-05-30

- Fonte de limites revisada: `src/config/plans.ts` continua como fonte dos planos Starter, Pro e Premium; `src/lib/plan-limits.ts` centraliza fallback free/trial e limite da demo.
- Geracao autenticada revisada em `/api/ai/generate-response`: assinatura/status e uso sao verificados antes da chamada OpenAI, com ciclo por assinatura quando houver `current_period_start/current_period_end` e fallback por mes calendario.
- Uso mensal continua derivado de `generated_responses`; respostas so contam depois de geracao e persistencia bem-sucedidas. Falhas antes da resposta nao incrementam uso.
- Demo publica preservada sem login e com rate limit por IP, mensagem amigavel e fallback local quando OpenAI nao estiver configurada.
- Rate limits revisados em geracao de IA, demo, leads, suporte, feedbacks, data requests, checkout e portal Stripe usando `src/lib/rate-limit.ts`.
- Admin recebeu metricas agregadas de usuarios perto do limite, usuarios no limite, maiores usuarios por volume e custo OpenAI indisponivel quando tokens nao sao salvos.
- Tracking seguro revisado com eventos de limite e abuso sem pergunta, resposta, e-mail ou dados sensiveis.
- Documentacao criada: `docs/ai-cost-control.md`, `docs/plan-limits.md` e `docs/rate-limits.md`.
- Pendencias restantes: persistir tokens/modelo por resposta se a estimativa de custo interna passar a ser necessaria; avaliar idempotencia por request se houver repeticao frequente; validar Upstash em producao para rate limit distribuido.
- Nota estimada mantida: 97/100 para operacao controlada, condicionada a validacao real em staging/producao.

## Paginas publicas por nicho - 2026-05-30

- Criada configuracao central em `src/config/niches.ts` para delivery, estetica, assistencia tecnica, lojas, restaurantes, prestadores de servico e autonomos.
- Criada rota publica dinamica `/para/[slug]` com paginas segmentadas, metadados, canonical e 404 para nicho invalido.
- Criado componente reutilizavel `src/components/marketing/NicheLandingPage.tsx` com hero, dores, exemplos, resposta segura, como funciona, beneficios, templates recomendados, CTA e FAQ.
- Copy reforca que o AtendeZap IA gera respostas para copiar, ajustar e enviar; nao promete integracao direta, envio automatico pelo WhatsApp, CRM ou automacao complexa.
- Tracking seguro adicionado: `niche_page_view`, `niche_demo_cta_click`, `niche_signup_cta_click`, `niche_ebook_cta_click`, `niche_pricing_cta_click` e `niche_faq_opened`.
- Rodape recebeu links discretos para paginas por nicho em "Feito para quem atende pelo WhatsApp".
- Documentacao criada: `docs/niche-campaign-utm-links.md`, `docs/niche-copy-guide.md` e `docs/niche-campaign-plan.md`.
- Admin existente continua usando UTMs e campanhas; visitantes por nicho devem ser analisados em GA4/Meta Ads, enquanto leads/checkouts/assinaturas dependem das UTMs preservadas.
- Pendencias restantes: validar campanhas reais por nicho, comparar custo por lead/cadastro e ajustar copy apenas com evidencia.
- Nota estimada mantida: 97/100 para operacao controlada, condicionada a validacao real de campanhas.

## Monitoramento minimo de producao - 2026-05-27

- Monitoramento minimo criado em `docs/production-monitoring.md`, com rotina diaria, semanal e alertas criticos.
- Logs seguros revisados: `src/lib/logger.ts` agora mascara user id, e-mails, chaves e omite campos de conteudo/prompt/resposta/payload.
- Eventos internos seguros adicionados/reaproveitados via `src/lib/events.ts` e tabela `events`, mantendo metadata sanitizada e sem conteudo completo de IA.
- Pontos criticos com logs/eventos minimos: geracao de IA, checkout Stripe, webhook Stripe, lead/ebook, envio Resend e respostas salvas.
- Admin ganhou secao agregada "Saude do sistema" com respostas hoje, falhas de IA, leads, checkouts, webhooks, falhas de webhook, feedbacks negativos e assinaturas ativas.
- Health check revisado/documentado para continuar leve, sem secrets, sem dados de usuario e sem chamadas caras a provedores.
- Checklists criados: `docs/daily-ops-checklist.md` e `docs/critical-failure-checklist.md`.
- Mensagens de erro documentadas em `docs/error-messages.md`; rotas criticas mantem respostas amigaveis sem stack trace.
- Pendencias restantes: validar painel operacional em Vercel com dados reais, revisar logs de producao depois do primeiro deploy e configurar alertas externos se o volume justificar.
- Nota estimada mantida: 97/100 para operacao controlada; monitoramento automatico mais avancado fica como melhoria futura.

## Suporte simples e central de ajuda - 2026-05-28

- Fluxo de suporte criado em `docs/support-workflow.md`, com tipos de solicitacao, prioridades e processo interno.
- FAQ do produto criada em `docs/product-faq.md` e refletida na pagina protegida `/dashboard/ajuda`.
- Playbook interno criado em `docs/internal-support-playbook.md`.
- Tabela `support_requests` evoluida por migration incremental `supabase/migrations/0017_support_requests_workflow.sql`, com RLS por usuario autenticado, status controlados, prioridades e notas internas.
- APIs criadas: `/api/support` para criacao/listagem simples e `/api/admin/support/[id]` para atualizacao admin protegida.
- Pagina de ajuda no dashboard criada com formulario, FAQ, historico de solicitacoes e estados de loading, erro, sucesso e vazio.
- Pagina publica `/suporte` revisada com formulario simples, placeholder `SUPPORT_EMAIL`, links legais e aviso para nao enviar dados sensiveis.
- Admin de suporte criado como secao simples no painel protegido, com contato mascarado, categoria, assunto, status, prioridade e nota interna.
- Tracking seguro adicionado para suporte e FAQ sem enviar mensagem completa, e-mail ou dados sensiveis.
- Logs seguros adicionados para criacao/falha de suporte e atualizacao admin sem expor conteudo completo ou stack trace para usuario.
- README, `docs/README.md`, `docs/safe-logging.md`, `docs/critical-api-security-review.md` e `docs/rls-review-checklist.md` atualizados.
- Pendencias restantes: aplicar a migration em Supabase staging/producao, validar RLS usuario A vs usuario B, configurar `SUPPORT_EMAIL` se desejado e manter notas internas sem dados sensiveis.
- Nota estimada mantida: 97/100 para operacao controlada, condicionada a migration aplicada e validacao real de RLS/admin.

## Ativacao e retencao inicial - 2026-05-28

- Fluxo atual auditado: cadastro, onboarding no dashboard, primeira resposta, biblioteca, templates, favoritos, assinatura, tracking, admin, Resend e `docs/retention-plan.md`.
- Checklist de ativacao criado no dashboard principal com sete passos: concluir onboarding, gerar primeira resposta, copiar resposta, salvar resposta util, ver templates, favoritar resposta e conhecer planos.
- Estado de usuario novo revisado para orientar a primeira resposta com exemplos comuns: valor, atendimento hoje, entrega, formas de pagamento e agendamento.
- Recomendacoes pos-primeira resposta criadas para copiar, salvar, testar outro exemplo, ver templates, favoritar e conhecer planos sem forcar checkout.
- Eventos seguros `activation_onboarding_completed`, `activation_first_response_generated`, `activation_response_copied`, `activation_response_saved`, `activation_template_viewed`, `activation_template_saved`, `activation_favorite_created` e `activation_pricing_viewed` adicionados sem conteudo de pergunta/resposta/e-mail.
- Admin ganhou secao "Ativacao" com metricas agregadas de novos usuarios, onboardings, primeiras respostas, respostas salvas, copias, favoritos, usuarios ativos 7 dias, checkouts e assinaturas.
- Templates de e-mails de ativacao criados em `src/lib/email.ts`, apenas como templates/documentacao; nenhum envio automatico novo foi criado.
- Criados `docs/activation-emails.md` e `docs/user-activation.md`.
- `docs/retention-plan.md`, `docs/tracking.md`, README, `docs/README.md` e `docs/final-readiness-report.md` atualizados.
- Testes adicionados/revisados para checklist, eventos seguros, templates de e-mail e metricas agregadas do admin.
- Pendencias restantes: validar mobile e comportamento real em staging/producao, definir regra operacional antes de enviar e-mails automaticos e acompanhar abandono entre cadastro, onboarding e primeira resposta.
- Nota estimada mantida: 97/100 para operacao controlada, condicionada a validacao real de ativacao/retenção inicial.

## Polimento final de UX, acessibilidade e SEO - 2026-05-31

- Escopo auditado: landing, paginas por nicho, demo, ebook, obrigado, precos, cadastro/login, dashboard, onboarding, geracao, biblioteca, templates, assinatura, ajuda/suporte, privacidade e termos.
- SEO tecnico criado com `src/app/sitemap.ts` e `src/app/robots.ts`, listando apenas rotas publicas e bloqueando `/dashboard`, `/admin`, `/assinatura`, `/api` e aliases privados.
- Estados globais adicionados em `src/app/loading.tsx` e `src/app/error.tsx`, com mensagens amigaveis e sem stack trace para o usuario.
- Demo publica passou a tratar erro 500 com mensagem generica, mesmo se a API retornar detalhe interno.
- Biblioteca manteve estado vazio claro e estado de carregamento com `role="status"`/`aria-live`.
- Testes adicionados para sitemap, robots, exclusao de rotas privadas, erro da demo sem stack trace e estado vazio/carregamento da biblioteca.
- Documentacao criada: `docs/ux-polish-checklist.md`, `docs/ux-review.md` e `docs/technical-seo.md`.
- Pendencias restantes: validar visualmente no dominio real em mobile/tablet/desktop e conferir Search Console apos deploy.
- Nota estimada atualizada: 98/100 para producao controlada, condicionada a validacao real de staging/producao e logs limpos.

## Release Candidate privada e aprovacao pre-escala - 2026-05-31

- Release Candidate privada criada em `docs/release-candidate.md`, com status atual em preparacao para validacao privada.
- Checklist final criado em `docs/release-candidate-checklist.md`, cobrindo seguranca, produto, billing, operacao e campanhas.
- QA manual ponta a ponta documentado em `docs/manual-qa-plan.md`, cobrindo visitante frio, lead do ebook, usuario pagante, limite atingido, suporte e privacidade.
- Matriz de bloqueadores criada em `docs/release-blockers.md`, separando P0, P1 e P2.
- Relatorio final de QA criado em `docs/final-qa-report.md`, com validacao local automatizada aprovada com observacoes e staging/producao pendentes.
- Checklist pre-escala criado em `docs/pre-scale-approval-checklist.md`.
- Processo de release, readiness, staging, deploy de producao e smoke pos-deploy passaram a referenciar a Release Candidate.
- CHANGELOG recebeu `1.1.0-rc.1` como versao em preparacao, sem marcar release final.
- Decisao recomendada: manter privado, validar staging, liberar apenas campanha pequena depois de staging verde, nao escalar ainda e escalar com cautela apenas sem P0/P1 e com dados suficientes.
- Nota estimada mantida: 98/100 para producao controlada documentada; campanhas maiores continuam condicionadas a QA manual, integrações reais e ausencia de P0/P1.

## Go-live controlado pos-Release Candidate - 2026-05-31

- Go-live controlado criado em `docs/controlled-go-live.md`, com status, escopo e fora do escopo.
- Checklist de aprovacao criado em `docs/go-live-approval-checklist.md`, cobrindo codigo, seguranca, produto, billing, operacao e decisao.
- Plano de deploy criado em `docs/go-live-deploy-plan.md`.
- Monitoramento das primeiras 72 horas criado em `docs/first-72-hours-monitoring.md`.
- Plano de campanha pequena criado em `docs/post-go-live-small-campaign.md`.
- Criterios de pausa imediata criados em `docs/emergency-pause-criteria.md`.
- Relatorio diario criado em `docs/go-live-daily-report-template.md`.
- Decisao pos-go-live documentada em `docs/post-go-live-decision.md`.
- Checklist de tracking seguro criado em `docs/go-live-tracking-checklist.md`.
- Admin recebeu secao simples "Go-Live" com cards agregados e "Nao disponivel" quando a metrica ainda nao tem fonte persistida.
- Documentos de RC, deploy, smoke, incidentes, pre-escala e pausa de anuncios atualizados com referencia ao go-live controlado.
- Status atual: pronto documentalmente para go-live controlado, pendente de validacao real em staging/producao.
- Nota estimada mantida: 98/100 para producao controlada, sem liberar escala antes das primeiras 72 horas e sem ausencia comprovada de P0/P1.

## Analise das primeiras 72 horas pos-go-live - 2026-05-31

- Analise 72h pos-go-live criada em `docs/post-go-live-72h-report.md`.
- Diagnostico pos-go-live criado em `docs/post-go-live-diagnosis.md`.
- Decisao pos-go-live documentada em `docs/post-go-live-decision-matrix.md` e `docs/post-go-live-daily-decision.md`.
- Plano de correcoes criado em `docs/post-go-live-fix-plan.md`.
- Proxima campanha pequena planejada em `docs/next-small-campaign-plan.md`.
- Aprendizados pos-go-live documentados em `docs/post-go-live-learnings.md`.
- Admin Go-Live recebeu bloco "Resumo 72h" com metricas agregadas e placeholders "Nao disponivel" quando nao houver fonte persistida.
- Criterios de escala e pausa atualizados para reforcar: nao escalar sem ativacao, checkout/webhook estavel, custo de IA controlado, suporte sob controle e tracking confiavel.
- Backlog recebeu intake pos-go-live por area de impacto: activation, conversion, billing, ai_quality, support, campaign e usability.
- Status atual: Sem dados suficientes para concluir escala; manter privado e operar com campanha pequena somente apos dados reais agregados.
- Recomendacao: continuar operacao controlada se nao houver P0/P1, pausar campanha diante de falha critica, corrigir antes de nova campanha quando houver gargalo claro e liberar proxima campanha pequena apenas com tracking confiavel.
- Nota estimada mantida: 98/100 para producao controlada; escala cautelosa depende de evidencias reais das primeiras 72 horas.

## Campanha pequena otimizada - 2026-05-31

- Campanha `campanha_otimizada_01` preparada como teste pequeno, sem tratar nenhum nicho como vencedor antes de dados reais.
- Documentacao criada: `docs/optimized-small-campaign-plan.md`, `docs/optimized-campaign-utm-links.md`, `docs/optimized-campaign-test-matrix.md`, `docs/optimized-campaign-copy.md`, `docs/optimized-campaign-video-scripts.md`, `docs/optimized-campaign-launch-checklist.md` e `docs/optimized-campaign-report.md`.
- Tracking client-side adicionou `optimized_campaign_page_view` e `optimized_campaign_cta_click` quando a UTM oficial esta presente, preservando os eventos originais e sem enviar conteudo sensivel.
- Criterios de pausa, pre-escala e escala reforcados para bloquear aumento se tracking falhar, se custo de IA subir sem ativacao, se checkout/webhook falharem ou se a conclusao continuar `Sem dados suficientes`.
- Status atual: pronto para validacao manual e smoke test; nao aprovado para escala.
