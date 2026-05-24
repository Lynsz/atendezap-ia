# Release Candidate — AtendeZap IA

## Status geral

- Nota estimada atual: 96/100.
- Pronto para staging: sim, desde que as variaveis externas sejam configuradas na Vercel.
- Candidato aprovado para producao controlada: sim, para poucos usuarios, apos executar `docs/final-smoke-test.md` e `docs/production-launch-checklist.md` no ambiente final. O codigo local, build e testes automatizados estao prontos; a liberacao depende de validacao real com Supabase, Stripe, Resend, OpenAI, tracking e admin.
- Pronto para anuncios pagos pequenos: ainda condicional. Pode iniciar apenas depois de checkout real, webhook, pixel/GA4, e-mail, OpenAI e suporte minimo estarem validados no ambiente final.

## Fluxos obrigatorios validados

- Landing page: coberta por e2e publico e smoke local.
- Ebook: coberto por e2e com UTMs e envio mockado; precisa confirmar gravacao real no Supabase staging.
- Demo: coberta por e2e e aceita fallback sem OpenAI.
- Cadastro/login: implementado com Supabase; precisa teste real em staging.
- Dashboard: usa Supabase real, filtra dados por `user_id` e exige login.
- Onboarding: ocorre no dashboard e salva em `businesses`.
- Geracao de resposta: rota server-side autenticada, validada, com limite mensal.
- Assinatura: `/assinatura` usa Supabase e Stripe real.
- Checkout: valida plano, exige auth, usa Price mensal por plano, aplica cupom `duration=once` no Pro quando elegivel, cria metadata com `user_id`, `plan`, price e UTMs, e retorna para `/assinatura`.
- Webhook: valida assinatura Stripe e atualiza `subscriptions`.
- Portal Stripe: exige auth e customer Stripe salvo.
- Admin: API exige usuario autenticado e e-mail em `ADMIN_EMAILS`.
- Tracking: GA4/Meta sao opcionais; UTMs sao preservadas e enviadas em lead/checkout.
- E-mail: Resend e opcional; sem chave, lead continua o funil com status controlado.
- Operacao: checklist final de producao, plano de lancamento controlado, monitoramento, suporte minimo, rollback e rotina dos primeiros 7 dias documentados.
- Feedback: `/feedback`, `/api/feedback`, tabela `user_feedback`, listagem no admin e docs de primeiros usuarios/triagem/suporte criados para a producao controlada.

## Bloqueadores de producao

- Executar deploy staging na Vercel com `NEXT_PUBLIC_APP_URL` do ambiente.
- Aplicar Supabase staging e validar RLS com dois usuarios reais.
- Validar cadastro/login/dashboard com Supabase staging.
- Validar Stripe test mode de ponta a ponta: checkout, webhook assinado, plano ativo, portal e cancelamento.
- Validar Resend com remetente real ou registrar explicitamente status `skipped_not_configured` antes de liberar usuarios.
- Validar OpenAI com limite de custo e modelo configurado.
- Validar admin com usuario admin e usuario comum.
- Executar rotina operacional de producao controlada: monitoramento diario, suporte minimo e rollback documentado.

## Pendencias nao bloqueantes

- Migrar auth para Supabase SSR cookies para protecao server-side completa de paginas.
- Reduzir ou esconder superficies legadas que ainda usam localStorage fora do fluxo vendavel.
- Recuperacao de senha.
- Teste automatizado autenticado completo com Supabase real.
- Teste automatizado de webhook com assinatura real da Stripe CLI.
- Melhorar atomicidade do limite mensal em geracoes simultaneas.
- Sequencia de nutricao/descadastro de e-mails.
- Alertas automaticos ainda nao configurados; monitoramento inicial sera manual.
- Feedback ainda depende da migration `0008_user_feedback.sql` aplicada no Supabase real e acompanhamento manual no admin.

## Pendencias externas

- Stripe: produtos Starter, Pro e Premium em test/live, prices, cupom Pro primeiro mes em `STRIPE_PRO_FIRST_MONTH_COUPON_ID`, webhook e portal.
- Supabase: migrations aplicadas, RLS revisado, Auth URLs e Redirect URLs configuradas.
- Feedback: migration `0008_user_feedback.sql` aplicada e envio publico/autenticado validado.
- Vercel: projeto, dominio, envs por ambiente e logs.
- Resend: dominio/remetente verificado, API key e teste de entrega.
- OpenAI: chave, modelo, limite de custo e monitoramento.
- GA4: Measurement ID e DebugView.
- Meta Pixel: Pixel ID e Events Manager.
- Operacao: responsavel por monitoramento diario, suporte e rollback durante os primeiros 7 dias.

## Criterio para publicar

- `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` e `npm run test:e2e` verdes.
- `docs/post-deploy-checklist.md` executado em staging.
- Nenhum 500 em rotas principais.
- Nenhum segredo exposto em bundle, logs ou HTML.
- Lead, cadastro, dashboard, IA, checkout, webhook, portal, admin e tracking validados em staging.
- Plano Pro confirmado como primeiro mes por R$ 29 para novos usuarios e recorrencia normal depois.
- Mobile validado em home, ebook, demo, login, cadastro, dashboard, assinatura e admin.
- `docs/production-launch-checklist.md`, `docs/monitoring.md`, `docs/support.md`, `docs/rollback-plan.md` e `docs/first-7-days-checklist.md` executaveis pelo responsavel do lancamento.

## Validacao final do release candidate - 2026-05-22

- Status do release candidate: aprovado como candidato para producao controlada.
- Evidencia local: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` e `npm run test:e2e` passaram.
- Pendencias externas: Vercel com `NEXT_PUBLIC_APP_URL`, Supabase real com migrations/RLS/Auth, Stripe test/live com webhook assinado, Resend com remetente real, OpenAI com billing/modelo, GA4, Meta Pixel, Sentry e dominio.
- Riscos conhecidos: auth de pagina ainda usa hint no middleware, superficies legadas continuam acessiveis, limite mensal pode ter concorrencia em chamadas simultaneas e nao ha e2e autenticado real contra Supabase/Stripe.
- Recomendacao final: liberar 3 a 5 primeiros usuarios por convite apos smoke final em staging/producao controlada; iniciar anuncios pequenos somente depois de comprovar checkout, webhook, tracking, e-mail e suporte no ambiente final.

## Stripe billing completo - 2026-05-23

- Estrategia Pro escolhida: Price mensal normal `STRIPE_PRICE_PRO` + cupom Stripe `duration=once` em `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.
- `STRIPE_PRICE_PRO_FIRST_MONTH_29` fica apenas como compatibilidade de mapeamento para eventos antigos/promocionais e continua resolvendo internamente como `plan = "pro"`.
- Checkout retorna para `/assinatura?checkout=success` ou `/assinatura?checkout=cancel`.
- Customer Portal retorna para `/assinatura`.
- Testes automatizados cobrem plano invalido, usuario sem login, Starter, Pro com cupom, Premium, portal, assinatura invalida no webhook, update/delete de subscription e pagamento falho.
- Pronto para teste real em Stripe test mode depois de configurar envs, products, prices, coupon, webhook e portal no Stripe Dashboard.

## Deploy Vercel staging - 2026-05-24

- Status: pronto para criar deploy staging na Vercel, sem declarar producao irrestrita.
- Documentos criados: `docs/vercel-deploy.md`, `docs/supabase-vercel.md`, `docs/staging-vercel-checklist.md` e `docs/deploy-troubleshooting.md`.
- Auditoria: `NEXT_PUBLIC_APP_URL`, middleware, health check, Stripe webhook/redirects, Supabase, Resend, OpenAI, tracking e Sentry opcional revisados.
- Criterio atualizado: promover para producao controlada somente apos `docs/staging-vercel-checklist.md` verde com Supabase, Stripe, Resend, OpenAI, admin e mobile validados.

## Validacao pos-deploy staging - 2026-05-24

- Status: nao validado em Vercel staging real nesta sessao.
- Relatorio: `docs/staging-validation-report.md`.
- Bloqueio: URL/projeto Vercel do AtendeZap IA nao foi encontrado no repositorio nem no conector Vercel disponivel.
- Bugs reais confirmados: nenhum, por falta de acesso ao ambiente publicado.
- Recomendacao: manter como release candidate para staging avancado; nao promover para primeiros usuarios ate executar o checklist completo na URL publicada.

## Producao controlada - 2026-05-24

- Status: preparado para go-live controlado, condicionado a validacao real no dominio final.
- Documentos criados: `docs/production-readiness.md`, `docs/domain-checklist.md`, `docs/stripe-production.md`, `docs/supabase-production.md`, `docs/resend-production.md`, `docs/openai-production.md`, `docs/tracking-production.md`, `docs/go-live-checklist.md` e `docs/first-users-launch.md`.
- Auditoria: URLs, `NEXT_PUBLIC_APP_URL`, segredos server-only, `.gitignore`, `.env.example`, copy publica e pendencias externas revisadas.
- Criterio atualizado: liberar 3 a 5 usuarios apenas depois de `docs/go-live-checklist.md` verde no dominio final.
- Nao escalar anuncios ate confirmar checkout, webhook, Supabase, Resend, OpenAI, tracking e admin em producao.

## Go-live controlado - 2026-05-24

- Status: pronto para validacao assistida com 3 a 5 primeiros usuarios depois do ambiente final verde.
- Documentos criados: `docs/controlled-go-live-report.md`, `docs/first-users-validation-checklist.md`, `docs/first-users-interview.md`, `docs/launch-bugs.md` e `docs/launch-day-monitoring.md`.
- Suporte atualizado: `docs/support.md` e `docs/support-messages.md`.
- Criterio atualizado: pausar novos convites se aparecer P0/P1; preparar anuncios pequenos somente apos feedback real sem bloqueadores.
