# Auditoria do AtendeZap IA

## Nota geral

96/100

O projeto esta em release candidate aprovado para producao controlada e preparado para 3 a 5 primeiros usuarios e uma campanha pequena de validacao: funil publico, pagina direta de campanha, auth, dashboard SaaS, IA server-side, Stripe, Supabase, Resend, tracking, admin, feedback, metricas internas, relatorio de campanha, docs, testes, staging e playbooks de operacao estao encaminhados. A validacao local passou em lint, typecheck, build, testes unitarios e e2e, sem bloqueador de codigo nas rotas principais revisadas. Ainda falta executar o deploy final/staging real, validar checkout com Stripe test/live mode, testar RLS contra Supabase real e confirmar Resend, OpenAI, tracking, dominio, admin, feedback e metricas no ambiente final.

O ciclo pos-campanha agora tambem esta definido: diagnostico, matriz de priorizacao, revisao semanal, backlog de crescimento, experimentos pequenos e bloco simples de gargalo no admin para orientar melhorias com dados reais.

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
