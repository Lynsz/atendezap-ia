# Release Candidate — AtendeZap IA

## Status geral

- Nota estimada atual: 89/100.
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
- Checkout: valida plano, exige auth, cria metadata com `user_id`, `plan`, price e UTMs.
- Webhook: valida assinatura Stripe e atualiza `subscriptions`.
- Portal Stripe: exige auth e customer Stripe salvo.
- Admin: API exige usuario autenticado e e-mail em `ADMIN_EMAILS`.
- Tracking: GA4/Meta sao opcionais; UTMs sao preservadas e enviadas em lead/checkout.
- E-mail: Resend e opcional; sem chave, lead continua o funil com status controlado.
- Operacao: checklist final de producao, plano de lancamento controlado, monitoramento, suporte minimo, rollback e rotina dos primeiros 7 dias documentados.

## Bloqueadores de producao

- Executar deploy staging na Vercel com `NEXT_PUBLIC_APP_URL` do ambiente.
- Aplicar Supabase staging e validar RLS com dois usuarios reais.
- Validar cadastro/login/dashboard com Supabase staging.
- Validar Stripe test mode de ponta a ponta: checkout, webhook assinado, plano ativo, portal e cancelamento.
- Validar Resend com remetente real ou registrar explicitamente status `skipped` antes de liberar usuarios.
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

## Pendencias externas

- Stripe: produtos Starter, Pro e Premium em test/live, prices, cupom Pro primeiro mes, webhook e portal.
- Supabase: migrations aplicadas, RLS revisado, Auth URLs e Redirect URLs configuradas.
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
