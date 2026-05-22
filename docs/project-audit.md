# Auditoria do AtendeZap IA

## Nota geral

89/100

O projeto esta em release candidate aprovado para producao controlada: funil publico, auth, dashboard SaaS, IA server-side, Stripe, Supabase, Resend, tracking, admin, docs, testes, staging e playbooks de operacao estao encaminhados. A validacao final local passou em lint, typecheck, build, testes unitarios e e2e, sem bloqueador de codigo nas rotas principais revisadas. Ainda falta executar o deploy final/staging real, validar checkout com Stripe test/live mode, testar RLS contra Supabase real e confirmar Resend, OpenAI, tracking, dominio e admin no ambiente final.

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
- `/api/support`
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
- Stripe checkout exige auth, valida plano, usa price IDs/cupom via env, envia metadata com `user_id`, `plan` e UTMs.
- Stripe checkout envia `user_id`, `plan`, `price_id` e UTMs na metadata, cria/reutiliza customer e grava assinatura pendente no Supabase.
- Stripe portal exige auth, busca customer no Supabase e retorna erro controlado quando o usuario ainda nao tem customer.
- Stripe webhook valida assinatura, registra idempotencia e trata `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded` e `invoice.payment_failed`.
- Stripe webhook resolve usuario por metadata, `client_reference_id`, subscription salva ou customer Stripe, e mapeia `STRIPE_PRICE_PRO_FIRST_MONTH_29` como plano Pro.
- Supabase agora tem migration segura para `stripe_customer_id`, `stripe_subscription_id`, `subscription_status` e `usage_count`, com backfill a partir de `provider_*`/`status`.
- Admin server-side exige usuario autenticado e e-mail listado em `ADMIN_EMAILS`.
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
- `docs/rollback-plan.md` documenta reversao para falhas de deploy, Stripe, Supabase, OpenAI e anuncios.
- `docs/first-7-days-checklist.md` documenta a rotina diaria inicial.

## Parcial

- Auth: cadastro, login e logout existem; fluxo precisa de teste real em Supabase com confirmacao de e-mail ligada/desligada.
- Middleware: melhora o bloqueio de paginas antes do render, mas ainda usa cookie nao sensivel de hint porque a sessao atual do Supabase fica no browser/localStorage.
- Dashboard: a superficie principal funciona, mas concentra muita regra em um componente grande e ainda convive com modulos legados.
- Onboarding: o onboarding real do SaaS fica no dashboard e salva em `businesses`; `/onboarding` agora redireciona para essa superficie.
- Assinatura: dashboard e `/assinatura` refletem Supabase/Stripe, com testes automatizados de checkout/portal/webhook; ainda falta teste ponta a ponta real com Stripe em modo test.
- Supabase: RLS esta documentado/aplicado no SQL e ha testes de regressao para filtros por `user_id`; ainda falta teste contra Supabase real com dois usuarios.
- Tracking: eventos principais existem e no-op sem GA4/Meta Pixel, mas falta validacao com ferramentas reais em producao.
- Admin: metricas, filtros e CSV existem; helpers e bloqueio sem sessao tem testes, mas nao ha endpoint dedicado de exportacao server-side nem teste e2e com sessao admin real.
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
- Nao esta pronto para anuncios pagos ate checkout real, webhook live/test, pixels, e-mail e rotina operacional dos primeiros usuarios serem validados no ambiente final.

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

## Comandos executados

- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run test:e2e`
- Revisao operacional de mensagens de erro criticas, fallback de integracoes e admin inicial.
- `npm install --dry-run`
- Smoke test browser em `/`, `/ebook`, `/ebook/obrigado`, `/ebook/guia`, `/demo`, `/precos`, `/termos`, `/privacidade` e 404.
- Smoke mobile em `/`, `/ebook`, `/ebook/obrigado`, `/demo`, `/precos`, `/login`, `/cadastro`, `/dashboard`, `/onboarding`, `/assinatura`, `/admin`, `/termos`, `/privacidade`.
- Smoke API em `/api/health`, `/api/ai/generate-response`, `/api/stripe/create-checkout-session`, `/api/admin/overview`.
- Testes automatizados de Stripe para checkout, portal, webhook invalido e mapeamento do Pro promocional.

## Pendencias externas

- Vercel: criar projeto staging, preencher envs, definir `NEXT_PUBLIC_APP_URL`, rodar deploy e health check.
- Supabase: aplicar migrations no projeto staging, validar RLS, Auth URLs e isolamento com dois usuarios.
- Stripe: criar produtos, prices, cupom Pro, webhook staging e testar eventos em modo test seguindo `docs/stripe-staging.md`.
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
- Nota estimada nova: 89/100.
- Bloqueadores atuais: nenhum bloqueador de codigo identificado; a liberacao real depende de Supabase, Stripe, Resend, OpenAI, Vercel, dominio, GA4/Meta e admin validados no ambiente final.
- Pendencias nao bloqueantes: SSR cookies para auth de pagina, reducao de superficies legadas, recuperacao de senha, e2e autenticado real, webhook Stripe com assinatura real automatizada, atomicidade do limite mensal e alertas automaticos.
- Pode liberar primeiros usuarios: sim, em producao controlada, apos executar `docs/final-smoke-test.md` e `docs/post-deploy-checklist.md`.
- Pode iniciar anuncios pequenos: ainda nao antes de validar checkout, webhook, tracking, e-mail, OpenAI e suporte minimo no ambiente final; depois dessa validacao, pode iniciar com orcamento baixo.
- Proximo passo recomendado: fazer deploy staging/producao controlada na Vercel, preencher envs sem segredos no codigo, executar smoke final completo e liberar 3 a 5 usuarios por convite antes de anuncios.
