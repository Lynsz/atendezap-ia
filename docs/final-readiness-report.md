# Relatorio Final de Prontidao - AtendeZap IA

## Nota atual estimada

97/100.

## Status

Pronto para producao controlada com primeiros usuarios.

## Status versao 1.0

O AtendeZap IA esta consolidado como versao 1.0 em termos de escopo, documentacao e operacao. A 1.0 representa o MVP validado para producao controlada e campanhas pequenas, com limites claros: a ferramenta gera respostas para revisar, copiar e enviar manualmente pelo WhatsApp; ela nao envia mensagens automaticamente, nao e CRM completo e nao inclui automacoes avancadas.

Documentos adicionados para a consolidacao:

- `docs/version-1.0.md`
- `CHANGELOG.md`
- `docs/roadmap-post-1.0.md`
- `docs/weekly-maintenance-checklist.md`
- `docs/stability-criteria.md`
- `docs/README.md`

Pendencias conhecidas ficam registradas como backlog ou validacao externa: provedores reais, e2e autenticado completo, RLS real com dois usuarios, tracking/custos em plataformas externas, alertas automaticos e reducao futura de superficies legadas.

Nota estimada atualizada: 96/100. A nota nao sobe nesta consolidacao porque a etapa organizou escopo e documentacao, mas nao substitui validacao real de producao, Stripe, Supabase, Resend, OpenAI, tracking e admin.

Recomendacao sobre escala cautelosa: manter a decisao de nao escalar ainda sem dados reais preenchidos em `docs/second-campaign-analysis.md`, matriz de escala verde e ausencia de bugs P0/P1. Campanhas pequenas continuam aceitaveis somente com monitoramento diario e baixo orcamento.

## Registro interno de campanhas

Status: registro manual de campanhas implementado no admin protegido, sem integração direta com Meta Ads, TikTok Ads ou Google Ads e sem BI complexo.

O que foi feito:

- Tabelas `campaign_experiments` e `campaign_results` criadas por migration para campanhas e resultados agregados.
- APIs admin criadas para campanhas e resultados, com `requireAdmin`, validação de status/decisão, rejeição de valores negativos e cálculo simples de custo por lead, cadastro e assinatura.
- Seção "Campanhas" adicionada ao admin para listar, criar, editar, alterar status, registrar resultados, adicionar decisão final e ver resumo por campanha.
- Diagnóstico simples por campanha adicionado sem IA.
- Comparações por nicho e por canal adicionadas com métricas agregadas.
- Eventos internos e logs mínimos adicionados sem payload completo, dados pessoais, dados de pagamento, respostas ou secrets.
- Criados `docs/campaign-results-workflow.md`, `docs/post-campaign-analysis-template.md`, `docs/campaign-decision-criteria.md` e `docs/monthly-campaign-report-template.md`.

Pendências:

- Aplicar `supabase/migrations/0019_campaign_experiments.sql` no Supabase real/staging.
- Validar o admin com usuário administrador real e dados manuais.
- Manter visitantes, custos detalhados e dados das plataformas nos painéis externos, registrando no app apenas números agregados necessários.

Nota estimada mantida: 97/100 para produção controlada, condicionada à validação real do admin e da migration.

## Feedback, insights e backlog

Status: fluxo interno simples implementado para transformar feedbacks, suporte, churn e aprendizados de campanha em prioridades de produto, sem CRM e sem automações complexas.

O que foi feito:

- Fontes existentes auditadas: feedback de IA, suporte, cancelamento, campanhas, eventos, tracking, métricas internas e roadmap.
- Tabela `product_insights` criada por migration para registrar insights internos com tipo, severidade, status e área de impacto.
- APIs admin criadas para listar, criar, editar e remover insights, com validação de enums, limite de payload, logs seguros e `requireAdmin`.
- Seção "Insights de Produto" adicionada ao admin com filtros, cards de agrupamento, diagnóstico simples e criação manual.
- Botões simples criam rascunhos de insight a partir de suporte, feedback, feedback negativo de IA agregado e churn agregado, sem copiar conteúdo completo.
- Criados `docs/feedback-workflow.md`, `docs/product-prioritization.md`, `docs/product-backlog.md`, `docs/user-interview-script.md` e `docs/monthly-feedback-report-template.md`.

Pendências:

- Aplicar `supabase/migrations/0020_product_insights.sql` no Supabase real/staging.
- Validar o admin com usuário administrador real.
- Preencher `docs/product-backlog.md` somente com aprendizados reais e manter itens fora de escopo fora da execução atual.

Nota estimada mantida: 97/100 para produção controlada, condicionada à validação real do admin e da migration.

## Sprints, releases e roadmap

Status: processo interno simples criado para planejar, executar, validar e lançar melhorias pós-1.0 sem ferramenta externa complexa.

O que foi feito:

- Criado `docs/sprint-workflow.md`.
- Criados `docs/sprint-planning-template.md` e `docs/sprint-review-template.md`.
- Criado `docs/release-process.md`.
- Criado `docs/release-notes-template.md`.
- Criado `docs/versioning.md`.
- Criado `docs/sprint-intake-criteria.md`.
- Criado `docs/release-readiness-checklist.md`.
- Criado `docs/roadmap-management.md`.
- Criado `docs/monthly-operating-calendar.md`.
- `CHANGELOG.md` passou a ter seção `[Unreleased]`.
- Admin de Insights ganhou visão simples de Roadmap baseada em `product_insights`, com planejados, em progresso, entregues e rejeitados.

Pendências:

- Preencher os templates com ciclos reais.
- Atualizar `CHANGELOG.md` a cada release.
- Validar staging, smoke test, health check e logs antes de produção.
- Não usar esse fluxo como substituto para incident response quando houver P0/P1.

Nota estimada mantida: 97/100 para produção controlada, condicionada à disciplina operacional e validação real em staging/producao.

## Relatorios internos de negocio

Status: relatorios internos simples implementados no admin protegido, sem BI complexo, sem expor conteudo completo de respostas e sem dados de pagamento.

O que foi feito:

- Secao "Relatorios" no admin para aquisicao, ativacao, uso, receita, suporte e qualidade.
- Funil com numeros absolutos e taxas simples para leads, cadastros, onboarding, primeira resposta, resposta salva/copiada, checkout e assinatura.
- Diagnostico deterministico do funil para apontar gargalos comuns sem usar IA.
- Filtro de periodo reaproveitado: hoje, ultimos 7 dias, ultimos 30 dias e todos.
- Tratamento de metricas indisponiveis quando tabela opcional ainda nao existe.
- Exportacao CSV agregada para metricas internas, alem dos CSVs existentes de campanha/leads.
- Documentos criados: `docs/internal-metrics.md`, `docs/weekly-business-review.md`, `docs/business-health-criteria.md` e `docs/monthly-business-report-template.md`.

Pendencias:

- Validar os contadores com dados reais em staging/producao.
- Conferir persistencia real de eventos internos para checkout, falhas e uso.
- Manter visitantes, gasto de midia e analise financeira detalhada fora do app, nos provedores correspondentes.

Nota estimada mantida: 97/100 para producao controlada, condicionada a validacao real do admin e dos provedores.

## Ciclo de assinatura e churn

Status: ciclo de assinatura revisado para tratar melhor status Stripe/Supabase, pagamentos falhos, cancelamento e feedback de churn sem criar cobrança fora da Stripe.

O que foi feito:

- Webhook Stripe revisado para manter os eventos essenciais: checkout concluído, assinatura criada/atualizada/deletada, pagamento bem-sucedido e pagamento falho.
- Status local agora diferencia `active`, `trialing`, `past_due`, `unpaid`, `canceled`, `incomplete`, `incomplete_expired` e `paused`.
- `/assinatura` mostra plano, status, limite mensal, uso, renovação, portal Stripe, avisos de pagamento falho e aviso de cancelamento.
- Feedback opcional de cancelamento criado com tabela `cancellation_feedback`, API autenticada e RLS por usuário.
- Admin passou a expor agregados de assinaturas e churn: ativas, canceladas, `past_due`, pagamentos com falha, novos assinantes, cancelamentos recentes e motivos agregados.
- Criados `docs/subscription-lifecycle.md`, `docs/failed-payments.md` e `docs/churn-analysis.md`.

Pendências:

- Aplicar `supabase/migrations/0018_cancellation_feedback.sql` no Supabase real/staging.
- Validar no Stripe test mode a troca de plano, cancelamento pelo portal, dunning e `invoice.payment_failed`.
- Confirmar que o Customer Portal está configurado no Stripe para atualização de método de pagamento, troca/cancelamento conforme regra do produto.

Nota estimada mantida: 97/100 para produção controlada.

## Operacao continua 1.0

A operacao 1.0 esta documentada para manter o produto estavel apos o lancamento:

- `docs/operations-1.0.md`: rotina diaria, semanal e mensal.
- `docs/incident-response.md`: resposta a incidentes P0/P1/P2/P3.
- `docs/incident-log.md`: modelo para registrar incidentes.
- `docs/cost-monitoring.md`: custos de OpenAI, Stripe, Supabase, Vercel, Resend e campanhas.
- `docs/retention-plan.md`: sinais iniciais de retencao e abandono.
- `docs/ai-response-quality-plan.md`: criterios de qualidade das respostas e melhorias futuras.
- `docs/internal-faq.md`: respostas operacionais internas.

O admin foi revisado e continua suficiente para a fase atual: leads, usuarios, assinaturas, status, feedbacks, metricas de ativacao, uso de IA, UTMs e CSV. A visibilidade de suporte foi reforcada no dashboard, assinatura, feedback, FAQ e pagina de suporte, sem criar chat ou fluxo novo.

Pendencias restantes: alertas automaticos, dashboard financeiro, relatorios de churn/retencao e monitoramento avancado seguem no roadmap pos-1.0. Ferramentas externas como Vercel, Supabase, Stripe, Resend, OpenAI, GA4 e Meta ainda precisam ser acompanhadas nos respectivos paineis.

Nota estimada atualizada: 96/100. A operacao esta documentada, mas a maturidade operacional ainda depende de uso real, incidentes reais registrados, custos reais acompanhados e validacao continua dos provedores.

## Backup, recuperacao e seguranca de dados

Status: etapa operacional implementada para reduzir risco de perda de dados, orientar restauracao e revisar RLS sem tornar o repositorio publico.

O que foi feito:

- Criado `docs/backup-strategy.md` com dados criticos, dados proibidos no Git e responsabilidades de Supabase, Stripe, Resend e OpenAI.
- Criado `docs/disaster-recovery.md` com resposta a banco indisponivel, dados corrompidos, webhook Stripe falho, deploy quebrado e chave vazada.
- Criado `docs/monthly-backup-checklist.md` para revisao mensal de Supabase, Stripe, Vercel e seguranca.
- Criado `docs/safe-migrations.md` para orientar migrations incrementais, backup antes de producao, teste em staging e revisao de RLS.
- Criado `docs/rls-review-checklist.md` para validar isolamento de profiles, subscriptions, historico, respostas salvas, feedbacks, leads e eventos.
- Criado `docs/stripe-reconciliation.md` para tratar divergencias entre Stripe e Supabase.
- Criado `docs/data-retention.md` com principios de minimizacao, logs seguros e futuras rotinas de exportacao/exclusao.
- Criado `docs/critical-api-security-review.md` registrando revisao de IA, historico, respostas salvas, feedbacks, assinatura, checkout, portal Stripe, webhook Stripe, leads/ebook e admin.
- Criado teste estatico `src/lib/supabase/rls-policies.test.ts` para proteger policies criticas contra regressao.
- README e `docs/README.md` atualizados com os novos documentos.

Pendencias:

- Confirmar plano e retencao de backup no Supabase real.
- Testar restauracao em ambiente seguro antes de depender do procedimento em producao.
- Validar RLS com dois usuarios reais em staging/producao.
- Registrar reconciliacoes manuais em `docs/incident-log.md`.

Recomendacao atualizada:

Manter o repositorio privado e seguir com producao controlada. A etapa melhora protecao de dados e recuperacao operacional, mas nao substitui validacao real de backup, restauracao, RLS e provedores.

Nota estimada atualizada: 97/100 para operacao controlada, condicionada a validacao real de backup/restauracao, RLS e provedores em staging/producao.

## Privacidade, LGPD e controle de dados

Status: base inicial implementada para o usuario entender dados armazenados e solicitar exportacao ou exclusao com seguranca.

O que foi feito:

- Criado `docs/data-inventory.md` com dados armazenados, obrigatorios, opcionais, sensiveis e dados enviados para Stripe, Resend, OpenAI e analytics.
- Criado `docs/privacy-policy.md` e revisada a pagina `/privacidade`.
- Criado `docs/terms-of-use.md` e revisada a pagina `/termos`.
- Criado `docs/lgpd-compliance.md` com principios, direitos do usuario e pendencias futuras.
- Criada migration `supabase/migrations/0016_data_requests.sql` para `data_requests`, com tipos `export`/`deletion`, status controlados e RLS por usuario.
- Criada API autenticada `/api/data-requests` para usuario criar e listar apenas as proprias solicitacoes.
- Criada pagina protegida `/dashboard/privacidade` com resumo dos dados, links legais, botao de exportacao, botao de exclusao e historico de solicitacoes.
- Criada API admin `/api/admin/data-requests` e secao simples no admin para acompanhar, anotar e atualizar solicitacoes.
- Criados `docs/data-export-process.md` e `docs/data-deletion-process.md` para processo manual seguro.
- Tracking revisado para remover e-mail, perguntas, respostas, mensagens e outros campos sensiveis antes de analytics.
- Logs revisados e `docs/safe-logging.md` atualizado.

Pendencias:

- Aplicar `0016_data_requests.sql` no Supabase real/staging.
- Validar usuario A vs usuario B em staging/producao.
- Definir e revisar juridicamente a politica final, se necessario.
- Automatizar exportacao/exclusao somente depois de processo seguro validado.

Recomendacao atualizada:

Manter o repositorio privado e seguir com producao controlada. A etapa cria base operacional para LGPD, mas a execucao real ainda depende de processo manual, validacao em ambiente real e revisao juridica antes de escala.

Nota estimada mantida: 97/100 para operacao controlada.

## Suporte simples e central de ajuda

Status: estrutura inicial implementada para usuarios encontrarem respostas basicas e enviarem solicitacoes simples, sem CRM, chat em tempo real ou integracao com WhatsApp.

O que foi feito:

- Criado `docs/support-workflow.md` com tipos de solicitacao, prioridades e processo interno.
- Criado `docs/product-faq.md` e refletida a FAQ principal na rota protegida `/dashboard/ajuda`.
- Criado `docs/internal-support-playbook.md` com procedimentos para plano pago nao liberado, IA sem gerar, login, cobranca/cancelamento e exportacao/exclusao.
- Criada migration `supabase/migrations/0017_support_requests_workflow.sql` para evoluir `support_requests` com categoria, assunto, status, prioridade, notas internas, RLS e grants controlados.
- Criada API `/api/support` para listar solicitacoes do proprio usuario e criar solicitacoes autenticadas ou publicas com e-mail.
- Criada API admin `/api/admin/support/[id]` para atualizar status, prioridade e nota interna via `requireAdmin`.
- Criada central `/dashboard/ajuda` com FAQ, formulario, lista de solicitacoes e estados de carregamento, sucesso, erro e vazio.
- Revisada pagina publica `/suporte` para formulario simples, placeholder de `SUPPORT_EMAIL`, links legais e aviso para nao enviar dados sensiveis.
- Admin protegido passou a exibir solicitacoes recentes de suporte com contato mascarado, status, prioridade e nota interna.
- Tracking e logs de suporte foram adicionados sem enviar mensagem completa, e-mail, dados de pagamento ou secrets.
- Testes cobrem criacao autenticada/publica, visitante sem e-mail, listagem isolada, validacoes, falha de e-mail opcional e update admin.

Pendencias:

- Aplicar `0017_support_requests_workflow.sql` no Supabase real/staging.
- Validar usuario A vs usuario B em staging/producao.
- Configurar `SUPPORT_EMAIL` na Vercel se notificacao interna por e-mail for desejada.
- Revisar periodicamente as notas internas para garantir que nao recebam dados sensiveis.

Recomendacao atualizada:

Manter o repositorio privado e seguir com suporte assíncrono simples. A etapa melhora operacao e onboarding sem criar CRM, chat ou WhatsApp direto.

Nota estimada mantida: 97/100 para operacao controlada.

## Ativação e retenção inicial

Status: etapa implementada para orientar o usuário novo até a primeira resposta útil e melhorar visibilidade agregada de ativação sem criar CRM, automação complexa ou integração com WhatsApp.

O que foi feito:

- Checklist "Primeiros passos" criado no dashboard principal com onboarding, primeira resposta, cópia, salvamento, templates, favoritos e planos.
- Estado inicial do dashboard melhorado com a chamada "Comece gerando sua primeira resposta" e exemplos comuns de perguntas.
- Recomendações pós-primeira resposta adicionadas para copiar, salvar, testar outro exemplo, ver templates, favoritar e conhecer planos.
- Eventos seguros `activation_*` adicionados sem conteúdo de pergunta, resposta, e-mail ou dados sensíveis.
- Admin ganhou seção "Ativação" com métricas agregadas de usuários novos, onboardings, primeiras respostas, respostas salvas, cópias, favoritos, ativos em 7 dias, checkouts e assinaturas.
- Templates de e-mails de ativação adicionados em `src/lib/email.ts`, sem envio automático novo.
- Criados `docs/activation-emails.md` e `docs/user-activation.md`.
- `docs/retention-plan.md`, `docs/tracking.md`, README e `docs/README.md` atualizados.
- Testes adicionados para checklist, eventos de ativação, métricas agregadas e templates de e-mail.

Pendências:

- Validar comportamento do checklist com usuários reais em staging/producao.
- Definir regra operacional antes de qualquer envio automático de e-mail de ativação.
- Acompanhar se os passos reduzem abandono entre cadastro, onboarding e primeira resposta.

Recomendacao atualizada:

Manter a ativação simples e orientada à primeira resposta útil. Não escalar para automações de retenção antes de haver dados reais de abandono e consentimento operacional claro.

Nota estimada mantida: 97/100 para operacao controlada.

## Resumo executivo

O AtendeZap IA esta tecnicamente pronto para uma liberacao controlada com 3 a 5 usuarios reais e para uma campanha pequena de validacao com orcamento baixo, desde que as configuracoes externas de producao/staging estejam preenchidas e validadas no ambiente final. Alem da validacao local de release, agora existe um canal simples de feedback, lista no admin, roteiro de entrevista, mensagens de suporte, triagem rapida de bugs, metricas internas, pagina direta para campanha e relatorio de validacao comercial.

Ainda nao e recomendavel escalar trafego pago ou rodar anuncios maiores antes de validar Stripe, Supabase, Resend, OpenAI, tracking, dominio, admin e suporte no ambiente real.

## Seguranca do repositorio privado

Status: repositorio deve permanecer privado no GitHub.

O que foi feito:

- `.gitignore` revisado para evitar commit acidental de `.env`, `.env.local`, envs por ambiente, `.vercel`, arquivos `.pem`, `.key`, `.cert`, outputs de build, coverage e dependencias.
- Verificacao de arquivos versionados confirmou que `.env.local` nao esta rastreado; apenas `.env.example` aparece entre arquivos de ambiente versionados.
- `.env.example` revisado para placeholders vazios, sem valores reais.
- Criado `scripts/check-secrets.js` e atualizado `npm run check:secrets`.
- Criados `docs/private-repo-security-checklist.md`, `docs/private-deploy.md` e `docs/repository-visibility.md`.
- README atualizado com regras de seguranca do repositorio privado.
- Uso de variaveis sensiveis revisado por busca; chaves privadas seguem em codigo server-side, testes ou documentacao, nao em Client Components.

Pendencias:

- Ativar secret scanning no GitHub, se disponivel.
- Revisar permissoes de colaboradores periodicamente.
- Fazer auditoria de historico Git e rotacao de chaves antes de qualquer decisao futura de tornar qualquer parte publica.

Recomendacao:

Manter o repositorio privado. Se alguma chave real tiver sido exposta em qualquer canal, revogar/rotacionar no painel do servico, atualizar `.env.local` e Vercel e nao confiar na chave antiga.

## Esteira de validacao antes de push/deploy

Status: validacao automatica simples adicionada para o repositorio privado.

O que foi feito:

- Criado `npm run validate` com `check:secrets`, `lint`, `typecheck`, `build` e `test`.
- Criada GitHub Action em `.github/workflows/validate.yml` para pull requests e pushes para `main`.
- A action usa `npm ci`, placeholders publicos seguros e nao recebe secrets reais.
- Criados `docs/validation-workflow.md`, `docs/pre-push-checklist.md`, `docs/pre-deploy-checklist.md` e `docs/env-safety.md`.
- README atualizado para orientar `npm run validate` antes de push/deploy.
- `scripts/check-secrets.js` revisado para cobrir os diretorios ignorados e manter saida sem valores completos.

Pendencias:

- Configurar branch protection no GitHub privado, se desejado, exigindo a action verde antes de merge.
- Manter secrets reais apenas em `.env.local` e Vercel, fora do workflow.

## Fluxo staging para producao privado

Status: processo operacional documentado para testar em staging antes de qualquer promocao para producao.

O que foi feito:

- Criado `docs/environments.md` para separar Local, Preview/Staging e Producao.
- Criado `docs/staging-checklist.md` para validar deploy Preview/Staging.
- Criado `docs/production-deploy-checklist.md` para controlar promocao para producao.
- Revisado `docs/rollback-plan.md` com gatilhos de rollback, passos na Vercel e rotina apos rollback.
- Criado `docs/post-deploy-smoke-test.md` para validacao rapida apos deploy.
- Revisado `/api/health` para incluir versao sem expor dados sensiveis.
- Criado `docs/health-check.md`.
- Criado `docs/vercel-env-vars.md` para separar variaveis publicas e privadas por ambiente.
- README e `docs/README.md` atualizados com os links e orientacao de deploy privado.

Pendencias:

- Executar checklist de staging em um Preview real da Vercel.
- Validar provedores reais ou sandbox conforme ambiente: Supabase, Stripe, OpenAI, Resend e tracking.
- Promover para producao somente apos staging validado e `npm run validate` verde.

## O que esta validado

- Landing: rota `/` carrega no build/e2e, CTAs principais apontam para `/cadastro`, `/demo` e `/ebook`.
- Campanha: `/atendimento-whatsapp-ia` criada para trafego pago direto, com CTA para demo, ebook, planos e Pro.
- Ebook: `/ebook`, `/ebook/obrigado` e `/ebook/guia` existem, preservam UTMs e usam erro amigavel no formulario.
- Demo: `/demo` tem e2e, validacao server-side e fallback controlado sem OpenAI.
- Cadastro/login: `/cadastro` e `/login` carregam; fluxo real ainda depende de Supabase configurado.
- Dashboard: `/dashboard` e protegido sem login e usa dados reais do Supabase no fluxo SaaS.
- Onboarding: `/onboarding` redireciona para `/dashboard`, preservando o onboarding real no dashboard.
- Geracao de resposta: API autenticada, validada, server-side, com limite mensal e mensagens controladas.
- Assinatura: `/assinatura` e protegida e usa assinatura real via Supabase/Stripe.
- Stripe checkout: API protegida sem sessao, valida plano, usa variaveis de price IDs, aplica cupom de primeiro mes no Pro quando elegivel e retorna para `/assinatura`.
- Stripe webhook: rota publica para middleware, valida assinatura Stripe e trata eventos principais.
- Portal Stripe: API protegida sem sessao, retorna erro controlado quando nao ha customer e usa `/assinatura` como return URL.
- Stripe validacao automatizada: mocks cobrem checkout sem login, plano invalido, Starter, Pro, Premium, cupom Pro, webhook invalido, assinatura Pro com cupom, cancelamento, pagamento bem-sucedido/falho e portal sem/com customer.
- Supabase: service role fica em codigo server-side; client usa apenas URL e anon key publicas.
- Resend: ebook pode salvar lead mesmo se envio estiver indisponivel; entrega real depende de chave/remetente.
- OpenAI: chave fica no backend; demo e geracao usam fallback/erro controlado.
- Admin: `/admin` e `/api/admin/overview` ficam protegidos; API admin exige usuario admin.
- Feedback: `/feedback` permite envio publico ou autenticado; `/api/feedback` valida, aplica rate limit e salva no Supabase; admin visualiza feedbacks recentes e pode marcar como em analise ou resolvido.
- Metricas internas: `/api/admin/metrics` calcula ativacao, funil, uso inicial, feedback, assinaturas e UTMs/campanhas de forma agregada; admin exibe cards e secoes simples sem expor listas pessoais.
- Relatorio de campanha: `/api/admin/campaign-report` exige admin, retorna apenas agregados, aceita filtros por periodo, `utm_source` e `utm_campaign`, mostra taxas principais, interpretacao simples e exportacao CSV do resumo.
- Tracking: GA4/Meta sao opcionais e UTMs sao preservadas no funil.
- Mobile: e2e cobre paginas publicas; revisao final nao encontrou bloqueio visual critico no codigo/CSS.
- Seguranca: middleware preserva webhooks publicos, bloqueia superficies privadas sem hint de sessao e APIs privadas retornam 401 sem sessao.

## O que ainda depende de configuracao externa

- Stripe producao/test mode: produtos, prices, webhook, portal e eventos.
- Supabase producao/staging: migrations, RLS, Auth URLs, Redirect URLs e usuarios reais.
- Vercel: projeto, dominio, variaveis por ambiente, logs e deploy final.
- Resend: dominio/remetente, `RESEND_API_KEY` e teste de entrega.
- Dominio: URL final em `NEXT_PUBLIC_APP_URL`, SSL e redirects.
- GA4: `NEXT_PUBLIC_GA_MEASUREMENT_ID` e validacao no DebugView.
- Meta Pixel: `NEXT_PUBLIC_META_PIXEL_ID` e validacao no Events Manager.
- OpenAI billing: chave, modelo, limite de custo e monitoramento de uso.
- Stripe: configurar produtos, prices, cupom `STRIPE_PRO_FIRST_MONTH_COUPON_ID`, webhook e portal em test/live.

## Prontidao para anuncios pequenos

Pronto para orcamento baixo, com ressalvas.

O produto tem landing revisada, pagina especifica de campanha, demo publica, ebook, pricing, CTAs coerentes, preservacao de UTMs, eventos de tracking no-op safe, metricas internas e relatorio de campanha no admin para acompanhar lead, cadastro, onboarding, primeira resposta, checkout, assinatura e feedback.

Agora tambem existe um processo pos-campanha para transformar dados reais em prioridade de melhoria: diagnostico, matriz P0/P1/P2/P3, checklist semanal, backlog comercial/produto e experimentos manuais pequenos.

As ressalvas sao externas e operacionais: antes de ligar anuncios, executar `docs/pre-ads-checklist.md`, validar GA4/Meta Pixel, Stripe checkout/webhook/portal, Supabase, Resend, OpenAI, dominio e admin no ambiente real. Nao aumentar investimento enquanto checkout, lead, cadastro, IA ou tracking estiverem instaveis.

## Bloqueadores

- Validar em staging/producao real o fluxo completo com Supabase: cadastro, login, dashboard, onboarding, geracao e isolamento por usuario.
- Validar Stripe em modo test/live no ambiente real: checkout, webhook assinado, assinatura ativa, portal e cancelamento.
- Confirmar `NEXT_PUBLIC_APP_URL` com HTTPS e dominio final antes de checkout/e-mails.
- Validar Resend com remetente real ou decidir liberar sem e-mail automatico do ebook com status operacional documentado.
- Validar admin com usuario admin e usuario comum no Supabase real.
- Validar relatorio de campanha com dados reais ou dados controlados de staging antes de ligar anuncio.
- Aplicar a migration `supabase/migrations/0008_user_feedback.sql` no Supabase real antes de liberar o canal de feedback.

## Pendencias nao bloqueantes

- Migrar auth para Supabase SSR cookies se a protecao server-side completa de paginas virar requisito.
- Reduzir ou esconder superficies legadas fora do fluxo vendavel.
- Criar fluxo de recuperacao de senha.
- Automatizar e2e autenticado completo com Supabase real.
- Automatizar webhook Stripe com assinatura real da Stripe CLI.
- Melhorar atomicidade do limite mensal em geracoes simultaneas.
- Configurar alertas automaticos de Sentry/Vercel/Stripe/GA4/Meta.
- Evoluir feedback para notificacao automatica se o volume crescer.
- Evoluir metricas para queries agregadas/views se o volume crescer; hoje o calculo em memoria e suficiente para poucos usuarios.
- Visitantes, custo por lead e custo por assinatura dependem da plataforma de anuncios/GA4/Meta; o admin nao calcula gasto de midia.

## Recomendacao final

Pode liberar para os primeiros usuarios, em producao controlada, depois de executar o smoke test final no ambiente real com variaveis externas configuradas e a migration de feedback aplicada.

Pode rodar anuncio pequeno com orcamento baixo depois de validar checkout, webhook Stripe, tracking, Resend, OpenAI e suporte minimo no ambiente final. Antes disso, a recomendacao e liberar para teste interno e 3 a 5 primeiros usuarios por convite.

Nao ha correcao de codigo bloqueante identificada nesta etapa. O proximo passo e deploy/staging real, execucao do checklist final, convite para 3 a 5 usuarios e acompanhamento diario de feedback e metricas de ativacao no admin.

## Validacao comercial da campanha - 2026-05-23

Estrutura adicionada:

- `/api/admin/campaign-report` protegido por admin.
- Secao "Relatorio de campanha" no admin.
- Filtros por `utm_source`, `utm_campaign` e periodo.
- Exportacao CSV agregada do resumo.
- Interpretacao simples das metricas.
- `docs/campaign-analysis.md`.
- `docs/campaign-daily-checklist.md`.
- Atualizacao de `docs/ads-validation-plan.md` e `docs/pre-ads-checklist.md`.

Metricas disponiveis:

- Leads totais, leads por UTM, cadastros, onboarding, ativacao, demo, primeira resposta, checkout, assinaturas, feedbacks e taxas principais de conversao.

Pendencias restantes:

- Validar o relatorio com dados reais de staging/producao.
- Confirmar se eventos internos da tabela `events` serao populados para demo usada; se nao, usar GA4/Meta para essa leitura.
- Calcular custo por etapa fora do app com o gasto da plataforma de anuncios.

Recomendacao atualizada:

Pode iniciar campanha pequena apenas apos executar `docs/pre-ads-checklist.md` no ambiente real. Aumentar orcamento somente se o relatorio mostrar leads, cadastros, onboarding, primeira resposta e algum sinal de compra sem bloqueadores tecnicos.

## Ciclo de melhoria pos-campanha - 2026-05-23

Estrutura adicionada:

- `docs/post-campaign-diagnosis.md`.
- `docs/improvement-prioritization.md`.
- `docs/weekly-growth-review.md`.
- `docs/product-growth-backlog.md`.
- `docs/growth-experiments.md`.
- Bloco "Possivel gargalo atual" no admin com regras simples e sem IA.
- Feedback com contexto/origem/campanha opcionais para identificar onde a dificuldade surgiu.

Recomendacao atualizada:

Depois da campanha inicial, nao aumentar anuncios por intuicao. Usar o admin, feedbacks e a revisao semanal para escolher uma correcao pequena P0/P1 antes de qualquer novo aumento de orcamento.

## Stripe billing completo - 2026-05-23

Estrategia escolhida para o Pro: cupom Stripe.

- O checkout usa `STRIPE_PRICE_PRO` como price recorrente mensal.
- O primeiro mes por R$ 29 usa cupom `duration=once` em `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.
- `STRIPE_PRICE_PRO_FIRST_MONTH_29` permanece apenas para compatibilidade de mapeamento de webhook e resolve como `plan = "pro"`.
- Checkout, Portal e webhook foram revisados para Starter, Pro e Premium.
- `docs/stripe-setup.md` documenta produtos, prices, variaveis, webhook, Stripe CLI e teste manual.

Status atualizado: pronto para teste real em Stripe test mode quando as variaveis externas, products, prices, coupon, webhook e Customer Portal estiverem configurados no ambiente final.

## Validacao Stripe ponta a ponta - 2026-05-24

Status: parcialmente validado e pronto para teste real em modo test.

O fluxo Stripe foi revisado do botao ate o dashboard: `StripeCheckoutButton`, `/api/stripe/create-checkout-session`, `/api/stripe/webhook`, `/api/stripe/create-portal-session`, `src/services/stripe.ts`, mapeamento de planos, migrations Supabase, `/assinatura` e dashboard.

O que esta validado por codigo/testes:

- Checkout sem login retorna 401.
- Plano invalido retorna 400.
- Starter usa `STRIPE_PRICE_STARTER`.
- Pro usa `STRIPE_PRICE_PRO`.
- Premium usa `STRIPE_PRICE_PREMIUM`.
- Cupom `STRIPE_PRO_FIRST_MONTH_COUPON_ID` aplica somente no Pro quando configurado.
- Metadata inclui `user_id`, `plan`, `price_id` e UTMs.
- `client_reference_id` usa `user_id`.
- `success_url` e `cancel_url` retornam para `/assinatura`.
- Webhook rejeita assinatura invalida.
- Webhook mapeia price Pro e price promocional legado como `plan = "pro"`.
- `customer.subscription.deleted` marca `canceled`.
- `invoice.payment_failed` registra falha/pagamento pendente.
- Portal sem customer retorna erro amigavel e portal com customer retorna para `/assinatura`.

O que ainda depende de teste manual externo:

- Rodar `npm run stripe:setup-products` com `STRIPE_SECRET_KEY` test real.
- Copiar price IDs e cupom para `.env.local`.
- Rodar `stripe listen` e configurar `STRIPE_WEBHOOK_SECRET`.
- Assinar Starter, Pro e Premium em Stripe Checkout test mode.
- Conferir eventos reais no Stripe CLI.
- Confirmar linhas reais em `subscriptions` no Supabase.
- Confirmar `/assinatura` e dashboard com usuario real apos webhook.

Documentos criados:

- `docs/stripe-validation-checklist.md`
- `docs/stripe-validation-report.md`

Nota estimada mantida: 96/100 ate a validacao real externa ser executada. A nota operacional pode subir para 97/100 depois de confirmar checkout, webhook, Supabase, portal e dashboard em Stripe test mode.

## Supabase seguranca e isolamento - 2026-05-24

Status: validado por auditoria de codigo/schema e pronto para teste manual em staging.

O Supabase foi revisado em migrations, schema consolidado, clientes, auth helpers, APIs, dashboard, assinatura, admin, onboarding, historico, leads, feedbacks e subscriptions.

O que esta validado por codigo/testes:

- Tabelas principais existem com nomes reais do projeto: `profiles`, `businesses`, `generated_responses`, `subscriptions`, `ebook_leads`, `lead_email_events` e `user_feedback`.
- RLS esta previsto em `supabase/schema.sql` para tabelas sensiveis.
- Queries privadas filtram pelo `user_id` da sessao autenticada.
- APIs privadas retornam erro sem sessao e nao usam `user_id` livre do client para autorizacao.
- Admin passa por API protegida e `ADMIN_EMAILS`.
- Service role fica centralizada em helper server-side com `server-only`.
- Teste automatizado cobre a fronteira service role/client.

O que ainda depende de teste manual externo:

- Aplicar migrations no Supabase de staging/producao.
- Conferir RLS e grants no painel Supabase.
- Criar usuario A e usuario B e validar isolamento real.
- Confirmar que usuario comum nao lista leads, eventos internos, pedidos ou kits.
- Confirmar que admin comum e admin autorizado se comportam corretamente.
- Confirmar Auth Site URL e Redirect URLs no painel Supabase.

Documentos criados:

- `docs/supabase-security.md`
- `docs/supabase-production-checklist.md`

Nota estimada mantida: 96/100 ate validar RLS e isolamento no Supabase real. Com Stripe test mode e Supabase staging validados de ponta a ponta, a nota operacional pode subir para 97/100.

## Resend e funil do ebook - 2026-05-24

Status: validado por codigo/testes e pronto para teste real com Resend em staging.

O fluxo do ebook foi revisado de ponta a ponta: pagina `/ebook`, formulario, API `/api/ebook-lead`, Supabase, Resend, `lead_email_events`, pagina `/ebook/obrigado`, guia `/ebook/guia` e admin.

O que esta validado por codigo/testes:

- Lead sem nome, sem e-mail ou com e-mail invalido retorna 400.
- Lead valido e salvo em `ebook_leads`.
- UTMs sao preservadas.
- Resend ausente ou `EMAIL_FROM` ausente nao quebra o funil e registra `skipped_not_configured`.
- Falha do Resend registra `failed` sem perder o lead.
- Sucesso do Resend registra `sent` com id do provider.
- Falha ao salvar lead retorna erro amigavel e nao tenta enviar e-mail.
- Obrigado mostra acesso imediato ao guia, demo, planos/cadastro e Pro por R$ 29 no primeiro mes.
- Guia abre sem login e tem CTAs para demo, cadastro, planos, termos e privacidade.
- Admin mostra status, data/evento e erro resumido do envio.

O que ainda depende de teste manual externo:

- Configurar remetente/dominio no Resend.
- Preencher `RESEND_API_KEY`, `EMAIL_FROM` e `NEXT_PUBLIC_APP_URL` em staging/Vercel.
- Enviar lead real pelo formulario.
- Confirmar recebimento do e-mail.
- Confirmar eventos `sent`, `failed` e `skipped_not_configured` no Supabase/admin.

Documentos criados/atualizados:

- `docs/resend-setup.md`
- `docs/email-funnel-checklist.md`
- `docs/emails.md`

Nota estimada mantida: 96/100 ate validar entrega real no Resend. Com Resend, Stripe e Supabase staging validados, a nota operacional pode subir para 97/100.

## Deploy Vercel staging/producao controlada - 2026-05-24

Status: pronto para deploy staging com validacao manual obrigatoria.

A configuracao de deploy foi auditada em `package.json`, `next.config.mjs`, middleware, rotas API, variaveis, URLs, Stripe, Supabase, Resend, OpenAI, tracking, Sentry opcional e documentacao.

O que esta validado por codigo/documentacao:

- Build command esperado e `npm run build`.
- `/api/health` existe e retorna apenas `status`, `environment` e `timestamp`.
- Webhook Stripe fica publico no middleware.
- Rotas privadas continuam protegidas.
- Stripe usa `NEXT_PUBLIC_APP_URL` para checkout e portal.
- E-mails do ebook usam `NEXT_PUBLIC_APP_URL` para links absolutos.
- Sentry e opcional e nao quebra sem `NEXT_PUBLIC_SENTRY_DSN`.
- `.env.example` contem placeholders sem valores reais.
- Documentacao Vercel, Supabase/Vercel, checklist staging e troubleshooting foram criados.

O que ainda depende de teste externo:

- Criar projeto Vercel e conectar GitHub.
- Preencher envs por ambiente.
- Aplicar migrations no Supabase staging.
- Configurar Supabase Auth Site URL e Redirect URLs.
- Configurar webhook Stripe para a URL Vercel.
- Validar Resend com remetente real.
- Validar OpenAI com chave e limite de custo.
- Validar GA4/Meta, se forem usados.
- Executar `docs/staging-vercel-checklist.md` completo.

Nota estimada mantida: 96/100 ate validar staging real. Com staging Vercel verde e provedores reais testados, a nota operacional pode subir para 97/100.

## Validacao pos-deploy staging - 2026-05-24

Status: nao validado em staging publicado nesta sessao.

Foi criado `docs/staging-validation-report.md` para registrar a validacao pos-deploy. A URL real da Vercel nao foi encontrada no repositorio e o conector Vercel disponivel nao listou um projeto AtendeZap IA, portanto nao houve teste remoto de paginas, auth, Stripe, webhook, Supabase, Resend, OpenAI, tracking, admin ou mobile.

O que foi validado nesta etapa:

- Documentos obrigatorios de deploy foram revisados.
- Busca local confirmou que nao ha URL real de staging versionada; apenas placeholders/documentacao.
- `/api/health` continua simples e sem dados sensiveis.
- Middleware mantem `/api/stripe/webhook` e `/api/health` como rotas publicas.
- Validacoes locais foram executadas para reduzir risco antes do proximo deploy.

Pendencias externas:

- Informar a URL de staging ou vincular o projeto correto na Vercel.
- Confirmar `NEXT_PUBLIC_APP_URL` no ambiente Preview/Staging.
- Confirmar envs reais na Vercel sem colocar valores no codigo.
- Executar `docs/staging-vercel-checklist.md` no deploy publicado.
- Registrar bugs reais encontrados no ambiente publicado antes de liberar usuarios.

Recomendacao: ainda nao liberar primeiros usuarios. Avancar para staging validado assim que a URL/projeto Vercel estiver acessivel.

Nota estimada mantida: 96/100 ate a validacao real do staging.

## Producao controlada - 2026-05-24

Status: pronto para preparacao de producao controlada, com go-live condicionado a validacao no dominio final.

Foram criados os documentos operacionais de producao:

- `docs/production-readiness.md`
- `docs/domain-checklist.md`
- `docs/stripe-production.md`
- `docs/supabase-production.md`
- `docs/resend-production.md`
- `docs/openai-production.md`
- `docs/tracking-production.md`
- `docs/go-live-checklist.md`
- `docs/first-users-launch.md`

Revisoes executadas:

- Busca por `localhost`, `127.0.0.1`, placeholders Vercel e `NEXT_PUBLIC_APP_URL`.
- Busca por textos de staging/teste/simulado no codigo.
- Busca por variaveis sensiveis em `src`.
- Conferencia de `.gitignore` e `.env.example`.

Resultado:

- Nao foi encontrado dominio hardcoded de producao no codigo.
- `localhost` permanece apenas em fallback local controlado, testes e documentacao.
- Variaveis sensiveis continuam sem valores reais em arquivos versionados.
- Fluxos de Stripe, Supabase, Resend e OpenAI continuam dependentes de validacao real no ambiente final.

Pendencias antes de liberar usuarios:

- Configurar dominio final e `NEXT_PUBLIC_APP_URL`.
- Configurar Vercel Production com variaveis reais.
- Aplicar migrations Supabase e validar RLS/isolamento.
- Configurar Stripe live mode, price IDs, cupom Pro e webhook.
- Configurar Resend com dominio/remetente final.
- Configurar OpenAI com limite de custo.
- Configurar GA4/Meta, se usados.
- Executar `docs/go-live-checklist.md`.

Recomendacao final: liberar somente para 3 a 5 usuarios depois do go-live checklist verde. Nao escalar anuncios ate obter validacao real de checkout, webhook, e-mail, IA, tracking, admin e suporte.

Nota estimada mantida: 96/100 ate validar producao no dominio final.

## Go-live controlado com primeiros usuarios - 2026-05-24

Status: pronto para executar validacao com 3 a 5 primeiros usuarios, apos ambiente final configurado.

Documentos criados:

- `docs/controlled-go-live-report.md`
- `docs/first-users-validation-checklist.md`
- `docs/first-users-interview.md`
- `docs/launch-bugs.md`
- `docs/launch-day-monitoring.md`

Documentos atualizados:

- `docs/support.md`
- `docs/support-messages.md`
- `docs/production-readiness.md`

O que esta preparado:

- Relatorio de go-live com status, URL, fluxos, bugs, pendencias e recomendacao final.
- Checklist por usuario convidado.
- Roteiro de entrevista curta.
- Classificacao simples de bugs P0/P1/P2/P3.
- Checklist de monitoramento do dia do lancamento.
- Respostas de suporte para as principais duvidas.
- Canal de feedback visivel no dashboard e pagina `/feedback`.
- Admin ja contem leads, feedbacks, assinaturas, metricas, campanha/UTMs e CSV sem novo dashboard complexo.

Pendencias antes de anuncios pequenos:

- Preencher o relatorio com URL/data reais.
- Executar teste com 3 a 5 usuarios.
- Corrigir qualquer P0/P1.
- Confirmar que pelo menos um usuario entende valor, gera primeira resposta e demonstra intencao real de uso/pagamento.
- Confirmar checkout, webhook, e-mail, IA, tracking e admin no dominio final.

Recomendacao: liberar para 3 a 5 usuarios por convite apos go-live tecnico. Anuncios pequenos somente depois de validar esses usuarios e atualizar `docs/controlled-go-live-report.md`.

Nota estimada mantida: 96/100 ate obter dados reais dos primeiros usuarios.

## Correcoes pos-go-live e pre-anuncios - 2026-05-24

Status: preparacao preventiva para anuncios pequenos, sem P0/P1 real registrado nos documentos atuais.

O que foi feito:

- `docs/controlled-go-live-report.md` e `docs/launch-bugs.md` foram revisados; nao ha bug P0/P1 registrado.
- Demo publica reforca que a IA gera sugestoes para revisar, copiar e enviar manualmente pelo WhatsApp.
- CTA pos-demo ficou mais claro para criacao de conta e salvamento de respostas.
- Dashboard mostra CTA de feedback logo apos uma resposta gerada.
- `docs/post-go-live-fixes.md` registra correcoes, pendencias e recomendacao.
- `docs/pre-ads-final-checklist.md` consolida o checklist operacional antes de qualquer campanha pequena.

Pendencias:

- Executar validacao real com 3 a 5 usuarios.
- Preencher URL/data reais no relatorio de go-live.
- Validar ambiente final com Stripe, Supabase, Resend, OpenAI, tracking, admin e mobile.
- Corrigir qualquer P0/P1 que aparecer antes de ligar anuncios.

Recomendacao atualizada:

Ainda nao declarar pronto para anuncios pequenos sem uma rodada real validada. O projeto esta pronto para nova rodada com usuarios e pode seguir para anuncios pequenos apenas se o checklist pre-anuncio final ficar verde e nao houver P0/P1 aberto.

Nota estimada mantida: 96/100 ate a validacao real dos primeiros usuarios e do ambiente final.

## Primeira campanha paga pequena - 2026-05-24

Status: estrutura pronta para acompanhar uma campanha inicial de baixo orcamento, com decisao diaria de continuar, ajustar ou pausar.

Documentos criados:

- `docs/first-paid-campaign-plan.md`
- `docs/first-campaign-daily-checklist.md`
- `docs/first-campaign-report.md`
- `docs/campaign-utm-links.md`
- `docs/ads-pause-criteria.md`
- `docs/scale-ads-checklist.md`
- `docs/tracking-setup.md`

Revisoes realizadas:

- Admin ja possui relatorio de campanha protegido, filtros por periodo, `utm_source` e `utm_campaign`, cards de leads, cadastros, onboarding, primeira resposta, checkout, assinaturas, feedbacks e leads por UTM.
- O bloco do admin foi alinhado para "Diagnostico do funil" com mensagens acionaveis por etapa.
- Tracking e UTMs foram revisados: eventos principais existem e UTMs sao preservadas no lead e no checkout.
- `docs/tracking.md` foi atualizado com os eventos atuais do funil.
- `docs/pre-ads-final-checklist.md` agora aponta para os documentos operacionais da campanha.

Metricas a acompanhar:

- visitas, leads, custo por lead, cadastros, custo por cadastro, onboarding concluido, primeira resposta gerada, checkout iniciado, assinatura ativa, feedbacks, bugs, origem por UTM e campanha com melhor desempenho.

Riscos conhecidos:

- Visitantes e custos dependem de GA4, Meta Ads ou plataforma externa.
- Custo por lead, cadastro, checkout e assinatura precisa ser calculado manualmente usando gasto externo e totais do admin.
- Demo usada no admin depende de eventos internos persistidos; se GA4/Meta forem a fonte principal, validar tambem fora do app.
- Ainda nao ha validacao real da campanha com trafego pago nesta sessao.

Recomendacao atualizada:

Pode preparar e rodar uma campanha pequena somente depois de `docs/pre-ads-final-checklist.md` verde no ambiente final. Pausar imediatamente se checkout, lead, cadastro, IA, webhook, pagina principal ou tracking quebrarem. Nao aumentar orcamento antes de preencher `docs/first-campaign-report.md` e passar por `docs/scale-ads-checklist.md`.

Nota estimada mantida: 96/100 ate haver dados reais da primeira campanha.

## Analise pos-primeira campanha e segunda rodada - 2026-05-24

Status: estrutura de analise criada, sem dados reais suficientes registrados nos documentos atuais.

O que foi feito:

- Criado `docs/first-campaign-analysis.md` para consolidar numeros, taxas, gargalos, hipoteses e decisao.
- Criado `docs/funnel-diagnosis.md` para interpretar cada etapa do funil.
- Criado `docs/post-campaign-improvement-plan.md` para priorizar P0/P1/P2/P3 antes de novo trafego.
- Criado `docs/second-campaign-plan.md` para orientar uma segunda campanha com hipotese unica.
- Demo pos-resposta recebeu copy mais direta e evento separado `demo_ebook_cta_click`.
- Pagina de obrigado recebeu copy mais conectada ao produto e eventos separados `thank_you_demo_cta_click`, `thank_you_signup_cta_click` e `thank_you_pricing_cta_click`.
- Admin/campaign report agora diferenciam ausencia de leads como sinal para revisar criativo, publico ou landing.

Pendencias:

- Preencher dados reais de visitantes, leads, cadastros, onboarding, primeira resposta, checkout e assinatura.
- Validar GA4/Meta Ads com os eventos novos.
- Comparar UTMs no admin antes de decidir canal, criativo ou rota vencedora.
- Corrigir qualquer P0/P1 real antes da segunda campanha.

Recomendacao atualizada:

Nao aumentar orcamento ainda. O projeto esta preparado para aprender com a primeira campanha e rodar uma segunda campanha pequena, desde que o relatorio seja preenchido com dados reais e o checklist de escala continue sem bloqueadores.

Nota estimada mantida: 96/100 ate haver dados reais de campanha e validacao de segunda rodada.

## Segunda campanha com variacoes controladas - 2026-05-24

Status: preparada para execucao manual por UTM, sem sistema complexo de A/B testing.

O que foi feito:

- Criado `docs/second-campaign-execution.md`.
- Criado `docs/second-campaign-utm-links.md`.
- Criado `docs/second-campaign-creatives.md`.
- Criado `docs/second-campaign-report.md`.
- Criado `docs/second-campaign-decision-criteria.md`.
- Revisada a pagina existente `/atendimento-whatsapp-ia` como rota direta de campanha.
- CTAs da pagina de campanha agora disparam eventos `campaign_*`.
- Relatorio admin inclui leads por `utm_content` para comparar criativos e rotas.

Variacoes preparadas:

- Demo primeiro.
- Ebook primeiro.
- Landing principal.
- Pagina direta de campanha.
- Destaque Pro com primeiro mes por R$ 29 para novos usuarios.

Pendencias:

- Gerar links finais com dominio real fora da documentacao versionada.
- Validar eventos novos no GA4/Meta Pixel.
- Rodar campanha pequena e preencher `docs/second-campaign-report.md`.
- Comparar visitantes/custos na plataforma de anuncios com leads/ativacao no admin.

Recomendacao atualizada:

Pode preparar a segunda campanha com baixo orcamento e variações controladas. Nao aumentar investimento antes de identificar uma entrada vencedora com dados reais e sem bugs P0/P1.

Nota estimada mantida: 96/100 ate validacao real da segunda campanha.

## Analise da segunda campanha e escala cautelosa - 2026-05-24

Status: sem dados reais suficientes para recomendar escala.

O que foi feito:

- Criado `docs/second-campaign-analysis.md` para comparar demo, ebook, landing e Pro R$ 29.
- Criado `docs/scale-decision-matrix.md` com condicoes para escalar, nao escalar e pausar.
- Criado `docs/cautious-scale-plan.md` para aumento gradual com monitoramento diario.
- Criado `docs/copy-iteration-notes.md` com hipoteses de copy, CTAs e objecoes a validar.
- Criado `docs/third-campaign-prep-checklist.md` para preparar a proxima rodada somente depois de dados reais.
- Atualizado `docs/second-campaign-report.md` com resultado comparativo, melhor/pior variacao, decisao recomendada e proximos ajustes.
- Atualizado `docs/scale-ads-checklist.md` com criterios antes de aumentar orcamento e revisao pos-segunda campanha.

Inspecao realizada:

- Admin/metricas ja mostra leads, cadastros, onboarding, primeira resposta, checkout, assinaturas, feedbacks e leads por `utm_source`, `utm_campaign` e `utm_content`.
- Tracking preserva UTMs e eventos principais do funil.
- Landing, demo, ebook, pricing e dashboard seguem explicando que a IA gera respostas para copiar, ajustar e enviar manualmente.

Pendencias:

- Preencher resultados reais por variacao.
- Validar visitantes e custos em GA4/Meta Ads.
- Conferir Stripe, webhook, Resend, OpenAI e Vercel logs durante a campanha.
- Corrigir qualquer P0/P1 antes de novo aumento.

Recomendacao atualizada:

Nao escalar ainda. O AtendeZap IA esta pronto para avaliar a segunda campanha e preparar escala cautelosa, mas a decisao depende de dados reais, tracking confiavel, checkouts funcionando e ausencia de bugs P0/P1.

Nota estimada mantida: 96/100 ate validacao real da segunda campanha e decisao de escala.

## Qualidade das respostas com IA - 2026-05-25

Status: melhoria pos-1.0 implementada para gerar respostas mais especificas por nicho e coletar feedback real de qualidade.

O que foi feito:

- Criados templates por nicho para Autonomo, Prestador de servico, Loja, Delivery, Estetica, Restaurante, Assistencia tecnica e Outro.
- Atualizado o prompt interno da IA para usar tipo de atuacao, tom de voz, contexto do negocio, perguntas comuns, informacoes importantes e template do nicho.
- Reforcadas regras para nao inventar preco, prazo, disponibilidade, estoque, garantia, endereco, link ou forma de pagamento.
- Reforcada regra para nao confirmar agendamento, reserva, entrega ou atendimento sem dados suficientes.
- Dashboard e demo publica passam a mostrar exemplos por tipo de atuacao.
- Criada avaliacao simples da resposta com Sim, Nao e comentario opcional.
- Criada tabela `ai_response_feedback` com RLS para o proprio usuario e leitura agregada pelo admin.
- Admin mostra positivos, negativos, taxa util e comentarios recentes de qualidade da IA.
- Historico mostra tipo de atuacao, tom usado e status da avaliacao quando existir.
- Criado `docs/ai-business-templates.md` e atualizado o plano de qualidade da IA.

Pendencias:

- Aplicar a migration `0011_ai_response_feedback.sql` nos ambientes Supabase.
- Acompanhar feedbacks reais antes de mexer novamente no prompt.
- Evoluir templates por subnicho somente depois de padroes recorrentes em uso real.
- Validar manualmente demo/dashboard/admin no dominio final depois do deploy.

Recomendacao atualizada:

O AtendeZap IA esta mais preparado para operar a IA da versao 1.0 com melhoria continua de qualidade. A escala cautelosa continua recomendada; nao escalar amplamente sem dados reais de uso, custos sob controle, feedbacks positivos e ausencia de P0/P1.

Nota estimada atualizada: 97/100 para operacao controlada da IA pos-1.0, condicionada a migration aplicada e validacao real em producao.

## Biblioteca de respostas salvas - 2026-05-26

Status: melhoria pos-1.0 implementada para reutilizar respostas boas sem criar CRM, automacao ou integracao direta com WhatsApp.

O que foi feito:

- Criada tabela `saved_responses` com RLS por usuario.
- Criadas APIs autenticadas para listar, salvar, editar e remover respostas salvas.
- Dashboard ganhou botao "Salvar resposta" na resposta gerada e no historico.
- Criada secao/rota protegida `/dashboard/biblioteca` para buscar, copiar, editar e remover respostas salvas.
- Categorias simples adicionadas: Preco, Agendamento, Entrega, Pagamento, Horario, Informacoes gerais, Pos-venda e Outro.
- Busca simples client-side por titulo, categoria e conteudo.
- Botao "Copiar" revisado com feedback visual e erro amigavel.
- Tracking adicionado sem enviar conteudo completo da resposta.
- Admin recebeu apenas metricas agregadas de biblioteca.
- Documentacao criada em `docs/saved-responses.md` e roadmap atualizado.

Pendencias:

- Aplicar `supabase/migrations/0012_saved_responses.sql` no Supabase real/staging.
- Validar manualmente usuario A vs usuario B no ambiente real.
- Validar a rota `/dashboard/biblioteca` em Vercel depois do deploy.

Recomendacao atualizada:

A biblioteca esta dentro do escopo pos-1.0 e melhora reutilizacao sem transformar o produto em CRM. A producao controlada continua recomendada; nao escalar amplamente sem migrations aplicadas, RLS conferido e validacao real dos provedores.

Nota estimada atualizada: 97/100 para operacao controlada pos-1.0, condicionada a validacao real de Supabase/RLS e provedores em staging/producao.

## Personalizacao da biblioteca de respostas - 2026-05-26

Status: melhoria pos-1.0 implementada para adaptar respostas/templates salvos ao atendimento real do usuario, sem CRM, automacao ou envio direto para WhatsApp.

O que foi feito:

- Biblioteca editavel: criar resposta manual, editar titulo/conteudo/categoria, duplicar, copiar, filtrar e excluir respostas salvas.
- `saved_responses` recebeu campo `source` com origem `ai_generated`, `template` ou `manual`, backfill seguro e indice por origem.
- Criada migration incremental `supabase/migrations/0014_saved_responses_source.sql`.
- Criada API autenticada `POST /api/saved-responses/[id]/duplicate`, sempre usando o usuario da sessao.
- Dashboard ganhou CTA "Nova resposta", filtros por categoria/origem, confirmacao antes de excluir e estado vazio atualizado.
- Templates salvos podem ser personalizados ou duplicados na biblioteca privada do usuario.
- Tracking adicionado sem enviar conteudo das respostas para analytics.
- Documentacao atualizada em `docs/saved-responses.md`, `docs/whatsapp-templates.md`, `docs/roadmap-post-1.0.md` e `docs/project-audit.md`.

Pendencias:

- Aplicar `supabase/migrations/0014_saved_responses_source.sql` no Supabase real/staging.
- Validar com dois usuarios reais que um nao cria, edita, duplica ou exclui respostas do outro.
- Validar `/dashboard/biblioteca` em Vercel depois do deploy.

Recomendacao atualizada:

A biblioteca editavel aumenta utilidade diaria sem mudar o escopo do produto. A producao controlada continua recomendada ate migrations, RLS e fluxo real em staging/producao serem validados.

Nota estimada atualizada: 97/100 para operacao controlada pos-1.0, condicionada a validacao real de Supabase/RLS e provedores em staging/producao.

## Organizacao da biblioteca com favoritos - 2026-05-27

Status: melhoria pos-1.0 implementada para encontrar e copiar respostas importantes com menos atrito, sem criar CRM, automacao ou envio automatico pelo WhatsApp.

O que foi feito:

- Criado `is_favorite` em `saved_responses` com default `false`.
- Criados `copy_count` e `last_copied_at` para contador simples de copias.
- Criada migration incremental `supabase/migrations/0015_saved_response_favorites_and_copy_count.sql`.
- Biblioteca ganhou favoritar/desfavoritar, filtro Todos/Favoritos, filtros combinados por categoria/origem/busca e ordenacao por recentes, antigos, atualizadas recentemente, favoritos primeiro e categoria.
- Cards da biblioteca mostram titulo, categoria, origem, favorito, data, trecho da resposta, contador de copias e acoes de copiar, editar, duplicar, favoritar e excluir.
- Dashboard principal ganhou bloco "Respostas favoritas" com ate 3 respostas e estado vazio.
- Tracking foi ampliado sem enviar conteudo completo das respostas.
- API continua autenticada e filtrando por `user_id`; usuario nao favorita, copia, edita, duplica nem exclui item de outro usuario.

Pendencias:

- Aplicar `supabase/migrations/0015_saved_response_favorites_and_copy_count.sql` no Supabase real/staging.
- Validar usuario A vs usuario B no ambiente real, incluindo favoritar, copiar, editar, duplicar e excluir.
- Validar mobile da biblioteca em Vercel depois do deploy.

Recomendacao atualizada:

A organizacao por favoritos melhora o uso diario da biblioteca sem ampliar escopo para CRM ou WhatsApp direto. A producao controlada continua recomendada ate migrations e isolamento real serem validados.

Nota estimada mantida: 97/100 para operacao controlada pos-1.0, condicionada a validacao real de Supabase/RLS e provedores em staging/producao.

## Templates prontos para WhatsApp - 2026-05-26

Status: melhoria pos-1.0 implementada para acelerar o primeiro uso com mensagens prontas por nicho, sem CRM, automacao ou envio automatico.

O que foi feito:

- Criado catalogo estatico de templates em `src/lib/templates/whatsapp-templates.ts`.
- Cobertos os nichos Delivery, Estetica, Assistencia tecnica, Loja, Restaurante, Prestador de servico, Autonomo e Outro.
- Criados pelo menos 5 templates por nicho, com categorias simples e campos editaveis.
- Criada rota protegida `/dashboard/templates` e aba no dashboard com filtros, busca, copiar e salvar na biblioteca.
- Dashboard principal recomenda templates conforme `business_type` para usuarios no inicio.
- Biblioteca de respostas passou a aceitar `source_template_id`, evitando duplicar o mesmo template salvo pelo usuario.
- Tracking adicionado sem enviar conteudo completo do template.
- Admin recebeu agregados simples de templates salvos e categorias mais salvas.
- Documentacao criada em `docs/whatsapp-templates.md`.

Pendencias:

- Aplicar `supabase/migrations/0013_saved_response_templates.sql` no Supabase real/staging.
- Validar usuario A vs usuario B no ambiente real.
- Validar `/dashboard/templates` em Vercel depois do deploy.
- Persistir eventos internos de copia de template somente se houver necessidade futura de metricas mais profundas.

Recomendacao atualizada:

Os templates prontos melhoram ativacao inicial e reforcam o valor do produto sem ampliar escopo para WhatsApp direto ou CRM. A producao controlada continua recomendada ate validar migrations, RLS e provedores no ambiente real.

Nota estimada atualizada: 97/100 para operacao controlada pos-1.0, condicionada a validacao real de Supabase/RLS e provedores em staging/producao.

## Monitoramento minimo de producao - 2026-05-27

Status: etapa operacional implementada para dar visibilidade basica de falhas criticas sem expor dados sensiveis e sem criar estrutura complexa.

O que foi feito:

- Criado `docs/production-monitoring.md`.
- Criado `docs/safe-logging.md`.
- Criado `docs/daily-ops-checklist.md`.
- Criado `docs/critical-failure-checklist.md`.
- Criado `docs/error-messages.md`.
- Logger server-side revisado para mascarar user id, e-mails, secrets e omitir conteudo completo de mensagens, prompts, respostas e payloads.
- Eventos internos seguros adicionados para sucesso/falha de IA, checkout, webhook Stripe, envio de ebook e resposta salva.
- Painel admin recebeu secao "Saude do sistema" com metricas agregadas de operacao.
- Health check documentado como endpoint leve, sem chamada a provedores caros e sem dados sensiveis.
- README e indice de docs atualizados com os documentos de operacao.

Pendencias:

- Validar os contadores do painel admin com dados reais em staging/producao.
- Conferir logs reais da Vercel apos deploy para confirmar que nao ha conteudo sensivel.
- Configurar alertas externos somente se a operacao ganhar volume suficiente.
- Continuar registrando incidentes em `docs/incident-log.md`.

Recomendacao atualizada:

O AtendeZap IA tem monitoramento minimo suficiente para producao controlada. A rotina ainda depende de checagem operacional diaria; alertas automaticos mais sofisticados devem ser adicionados apenas quando houver volume real.

Nota estimada mantida: 97/100 para operacao controlada, condicionada a validacao real em staging/producao e revisao dos logs depois do deploy.

## Limites de uso, custo de IA e abuso - 2026-05-30

Status: etapa implementada para reduzir custo desnecessario de OpenAI e abuso sem exigir login na demo publica.

O que foi feito:

- Limites por plano mantidos centralizados em `src/config/plans.ts` e fallback free/demo documentado em `src/lib/plan-limits.ts`.
- API de geracao autenticada verifica assinatura, status, ciclo e limite antes de chamar OpenAI.
- Ciclo de uso usa periodo da assinatura quando disponivel e mes calendario como fallback.
- Uso mensal continua contando apenas respostas persistidas com sucesso em `generated_responses`; falhas antes da geracao nao contam.
- Demo publica segue protegida por rate limit e mensagem clara para limite de testes gratuitos.
- Admin ganhou visibilidade agregada de usuarios perto/no limite, maiores usuarios por volume e nota de custo OpenAI indisponivel sem tokens.
- Novos docs: `docs/ai-cost-control.md`, `docs/plan-limits.md` e `docs/rate-limits.md`.

Pendencias:

- Salvar tokens/modelo por resposta se for necessario calcular custo estimado interno.
- Validar rate limit distribuido com Upstash no ambiente real.
- Considerar idempotencia por request se repeticoes de envio aparecerem em producao.

Nota estimada mantida: 97/100 para operacao controlada, condicionada a validacao real em staging/producao.

## Paginas publicas por nicho - 2026-05-30

Status: etapa implementada para testar campanhas com mensagens mais especificas por tipo de atendimento.

O que foi feito:

- Criada configuracao central de nichos em `src/config/niches.ts`.
- Criadas paginas publicas em `/para/delivery`, `/para/estetica`, `/para/assistencia-tecnica`, `/para/lojas`, `/para/restaurantes`, `/para/prestadores-de-servico` e `/para/autonomos`.
- Criado componente reutilizavel de landing por nicho com CTA para demo, cadastro, ebook e planos.
- FAQs por nicho reforcam que o AtendeZap IA nao envia mensagens automaticamente pelo WhatsApp.
- SEO basico por nicho criado com title, description, canonical e Open Graph.
- Tracking seguro de nicho adicionado sem e-mail, pergunta, resposta ou dados sensiveis.
- Rodape ganhou links discretos para os nichos.
- Criados `docs/niche-campaign-utm-links.md`, `docs/niche-copy-guide.md` e `docs/niche-campaign-plan.md`.

Pendencias:

- Validar visitantes e custo por nicho no GA4/Meta Ads.
- Usar UTMs para comparar leads, checkouts e assinaturas no admin.
- Ajustar copy apenas depois de dados reais por nicho.

Nota estimada mantida: 97/100 para operacao controlada, condicionada a validacao real de campanhas.

## Polimento final de UX, acessibilidade e SEO - 2026-05-31

Status: etapa implementada para fechar UX, mobile, estados de carregamento/erro/vazio e SEO tecnico antes de nova validacao em staging.

O que foi feito:

- Criados `src/app/sitemap.ts` e `src/app/robots.ts`.
- Sitemap inclui rotas publicas principais e paginas por nicho; rotas privadas, admin, assinatura e APIs ficam fora.
- Robots bloqueia `/dashboard`, `/admin`, `/assinatura`, `/api` e `/app`.
- Criados `src/app/loading.tsx` e `src/app/error.tsx` com mensagens amigaveis e sem detalhes internos.
- Demo publica sanitiza erro 500 para nao mostrar stack trace, path interno ou segredo retornado por engano.
- Biblioteca de respostas recebeu estado de carregamento acessivel e estado vazio testavel.
- Criados `docs/ux-polish-checklist.md`, `docs/ux-review.md` e `docs/technical-seo.md`.
- README e indice de docs atualizados.

Pendencias:

- Validar no dominio real com viewports 360px, 768px e desktop.
- Conferir `/sitemap.xml` e `/robots.txt` em Preview/Production depois do deploy.
- Confirmar Search Console apenas depois que o dominio real estiver configurado.
- Ajustar copy e layout apenas com evidencia de uso, feedback ou dados de campanha.

Recomendacao atualizada:

O produto esta mais preparado para producao controlada e campanhas pequenas. Continuar sem escala ampla ate checkout, webhook, Supabase, Resend, OpenAI, tracking e logs reais ficarem validados no ambiente final.

Nota estimada atualizada: 98/100 para producao controlada, condicionada a validacao real em staging/producao.

## Release Candidate privada e aprovacao pre-escala - 2026-05-31

Status: etapa de Release Candidate criada para validar estabilidade antes de aumentar campanhas.

O que foi feito:

- `docs/release-candidate.md` atualizado com objetivo, status, escopo, fora do escopo, evidencias obrigatorias e decisao recomendada.
- `docs/release-candidate-checklist.md` criado para seguranca, produto, billing, operacao e campanhas.
- `docs/manual-qa-plan.md` criado para QA manual ponta a ponta.
- `docs/release-blockers.md` criado com P0, P1 e P2.
- `docs/final-qa-report.md` criado para registrar ambiente, fluxos, bugs, pendencias e decisao.
- `docs/pre-scale-approval-checklist.md` criado para impedir aumento de campanha sem produto, billing, seguranca, operacao e campanhas verdes.
- Processo de release, readiness, staging, deploy de producao e smoke pos-deploy atualizados.
- CHANGELOG atualizado com `1.1.0-rc.1` em preparacao.

Pendencias:

- Executar QA manual em staging.
- Validar Supabase Auth/RLS com usuarios reais de teste.
- Validar Stripe checkout, portal e webhook em modo teste.
- Validar OpenAI, Resend, tracking e admin no ambiente real.
- Atualizar `docs/final-qa-report.md` apos staging.

Decisao recomendada:

- manter privado
- validar staging
- rodar campanha pequena apenas com staging verde
- nao escalar ainda
- escalar com cautela apenas sem P0/P1 e com dados suficientes

Nota estimada mantida: 98/100 para producao controlada documentada, condicionada a validacao real em staging/producao.

## Go-live controlado pos-Release Candidate - 2026-05-31

Status: etapa criada para liberar producao controlada e campanha pequena com criterio de pausa antes de qualquer escala.

O que foi feito:

- `docs/controlled-go-live.md` criado.
- `docs/go-live-approval-checklist.md` criado.
- `docs/go-live-deploy-plan.md` criado.
- `docs/first-72-hours-monitoring.md` criado.
- `docs/post-go-live-small-campaign.md` criado.
- `docs/emergency-pause-criteria.md` criado.
- `docs/go-live-daily-report-template.md` criado.
- `docs/post-go-live-decision.md` criado.
- `docs/go-live-tracking-checklist.md` criado.
- Admin recebeu secao "Go-Live" com metricas agregadas e placeholders "Nao disponivel" para campos sem fonte persistida.
- CHANGELOG atualizado com `1.1.0-rc.2` em preparacao.

Pendencias:

- Executar staging end-to-end.
- Validar deploy de producao com smoke test.
- Validar billing, webhook, IA, suporte, tracking e admin no ambiente real.
- Monitorar as primeiras 72 horas antes de aumentar campanhas.
- Pausar imediatamente se qualquer criterio de `docs/emergency-pause-criteria.md` ocorrer.

Decisao recomendada:

- manter privado
- validar staging
- liberar go-live controlado apenas com checklist verde
- rodar campanha pequena somente apos smoke test
- nao escalar antes das primeiras 72 horas
- escalar com cautela somente sem P0/P1, com custo de IA controlado e tracking confiavel

Nota estimada mantida: 98/100 para producao controlada, condicionada a validacao real em staging/producao e ao monitoramento das primeiras 72 horas.

## Analise das primeiras 72 horas pos-go-live - 2026-05-31

Status: artefatos criados para transformar dados agregados das primeiras 72 horas em decisao operacional.

O que foi feito:

- `docs/post-go-live-72h-report.md` criado.
- `docs/post-go-live-diagnosis.md` criado.
- `docs/post-go-live-decision-matrix.md` criado.
- `docs/post-go-live-fix-plan.md` criado.
- `docs/next-small-campaign-plan.md` criado.
- `docs/post-go-live-daily-decision.md` criado.
- `docs/post-go-live-learnings.md` criado.
- Admin Go-Live recebeu bloco "Resumo 72h".
- Criterios de escala e pausa foram reforcados.
- Intake pos-go-live adicionado ao backlog.
- CHANGELOG atualizado com `1.1.0-rc.3` em preparacao.

Pendencias:

- Preencher relatorio com dados reais agregados.
- Classificar bugs P0/P1/P2, se existirem.
- Identificar gargalo principal de ativacao, checkout, assinatura, IA, suporte ou campanha.
- Decidir entre manter, pausar, corrigir, liberar nova campanha pequena ou escalar com cautela.

Recomendacao:

- manter privado
- continuar operacao controlada apenas se nao houver P0/P1
- pausar campanha se houver falha critica
- corrigir antes de nova campanha se houver gargalo claro
- liberar proxima campanha pequena apenas com tracking confiavel
- escalar com cautela somente com sinal positivo, custo controlado e suporte sob controle

Nota estimada mantida: 98/100 para producao controlada; sem dados reais suficientes para aprovar escala cautelosa.

## Campanha pequena otimizada - 2026-05-31

Status: preparada para teste pequeno, sem aprovar escala.

O que foi feito:

- Documentacao criada para plano, UTMs, matriz, copy, videos, checklist e relatorio da campanha otimizada.
- Eventos `optimized_campaign_page_view` e `optimized_campaign_cta_click` adicionados para URLs com `utm_campaign=campanha_otimizada_01`.
- Criterios de pausa e pre-escala atualizados para exigir tracking, ativacao, checkout/webhook estavel e custo de IA controlado.

Decisao recomendada:

- manter privado
- rodar apenas com baixo orcamento
- nao declarar nicho vencedor sem dados reais
- nao escalar se a conclusao permanecer `Sem dados suficientes`
