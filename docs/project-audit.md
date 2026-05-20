# Auditoria do AtendeZap IA

## Nota geral

74/100

O projeto esta acima de um prototipo simples: o funil publico, auth, dashboard SaaS, IA server-side, Stripe, Supabase, Resend, tracking, admin, docs e deploy estao bem encaminhados. Ainda nao considero 80+ porque existem rotas legadas com estado local, fluxos criticos sem teste ponta a ponta real, e algumas partes dependem de configuracao externa ainda nao comprovada em ambiente de producao.

## Mapa tecnico

- Framework: Next.js 16 com App Router em `src/app`.
- Pages Router: nao identificado.
- Middleware: nao identificado.
- Server actions: nao identificadas; o backend usa route handlers em `src/app/api`.
- Supabase: cliente browser em `src/lib/supabase/browser.ts`, cliente legado em `src/lib/supabase.ts` e service role em `src/lib/supabase/server.ts`.
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
- Stripe webhook valida assinatura e trata `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded` e `invoice.payment_failed`.
- Admin server-side exige usuario autenticado e e-mail listado em `ADMIN_EMAILS`.
- Schema Supabase tem tabelas esperadas, RLS e policies por `auth.uid()` para dados de usuario.
- `.env`, `.env.local`, `.next`, `node_modules` e tsbuildinfo estao ignorados no Git.
- `docs/deploy-vercel.md`, `docs/production-checklist.md`, `docs/tracking.md`, `docs/billing.md`, `docs/emails.md`, `docs/admin.md` e checklists existem.
- `/api/health` retorna `200`.

## Parcial

- Auth: cadastro, login e logout existem; fluxo precisa de teste real em Supabase com confirmacao de e-mail ligada/desligada.
- Dashboard: a superficie principal funciona, mas concentra muita regra em um componente grande e ainda convive com modulos legados.
- Onboarding: o onboarding real do SaaS fica no dashboard e salva em `businesses`; `/onboarding` agora redireciona para essa superficie.
- Assinatura: dashboard e `/assinatura` refletem Supabase/Stripe, mas ainda falta teste ponta a ponta real com Stripe em modo test.
- Supabase: RLS esta documentado/aplicado no SQL, mas falta teste automatizado provando isolamento entre usuarios.
- Tracking: eventos principais existem e no-op sem GA4/Meta Pixel, mas falta validacao com ferramentas reais em producao.
- Admin: metricas, filtros e CSV existem, mas nao ha endpoint dedicado de exportacao server-side nem teste automatizado de permissao.
- SEO: metadados basicos existem; falta imagem OG padrao configurada se o ativo final existir.
- Resend: entrega do ebook esta pronta, mas sequencia de nutricao e descadastro ainda nao estao implementados.
- Deploy: docs estao boas, mas falta evidencia de deploy real com envs de producao.

## Quebrado ou ausente

- Rotas legadas fora do fluxo principal ainda usam localStorage e podem confundir o escopo de producao.
- Existem dois helpers Supabase browser (`src/lib/supabase.ts` e `src/lib/supabase/browser.ts`), ambos lancam erro quando env publica falta; isso aumenta chance de comportamento divergente.
- Nao ha middleware para proteger rotas privadas antes do render client-side; a protecao ocorre em componentes/API.
- Nao ha testes e2e para cadastro -> onboarding -> gerar resposta -> checkout -> webhook -> dashboard ativo.
- Nao ha testes automatizados de RLS ou acesso cruzado entre usuarios.
- Nao ha teste automatizado de webhook Stripe com eventos reais assinados.
- Fluxos legados/localStorage continuam acessiveis e podem confundir o escopo de producao.
- Variaveis `OPENAI_MODEL` e `NEXT_PUBLIC_APP_ENV` eram usadas/listadas em docs/codigo, mas faltavam no `.env.example`; corrigido nesta auditoria.

## Prioridade maxima

- Rodar um teste ponta a ponta em Supabase/Stripe test mode: cadastro, onboarding, geracao, checkout, webhook e portal.
- Validar em producao/preview que `NEXT_PUBLIC_APP_URL` monta redirects corretos de Stripe e links de e-mail.
- Criar testes automatizados minimos para API de checkout, webhook Stripe e isolamento de dados.

## Bugs criticos

- Nenhum erro de build, lint ou API publica basica foi encontrado no ambiente local.
- Risco critico de produto removido das rotas `/assinatura` e `/onboarding`; ainda existem superficies legadas fora do fluxo principal.

## Bugs medios

- Duplicacao de cliente Supabase browser.
- Rotas legadas visiveis no app ainda falam em localStorage/mock/Supabase planejado.
- Admin nao tem teste automatizado de bloqueio por usuario comum.
- Falta fluxo de recuperacao de senha.
- Falta teste automatizado de limite mensal concorrente; duas geracoes simultaneas podem passar pelo mesmo contador antes do insert.

## Para chegar em 80/100

- Adicionar suite e2e curta para rotas publicas, auth basico e dashboard.
- Adicionar testes unitarios/API para checkout, portal e webhook com mocks.
- Validar manualmente Stripe test mode com webhook local ou Vercel preview.
- Validar Resend com remetente real e confirmar `lead_email_events`.
- Marcar claramente ou esconder rotas legadas que nao fazem parte do SaaS vendavel.

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

## Comandos executados

- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm install --dry-run`
- Smoke test browser em `/`, `/ebook`, `/ebook/obrigado`, `/ebook/guia`, `/demo`, `/precos`, `/termos`, `/privacidade` e 404.
- Smoke mobile em `/`, `/ebook`, `/ebook/obrigado`, `/demo`, `/precos`, `/login`, `/cadastro`, `/dashboard`, `/onboarding`, `/assinatura`, `/admin`, `/termos`, `/privacidade`.
- Smoke API em `/api/health`, `/api/ai/generate-response`, `/api/stripe/create-checkout-session`, `/api/admin/overview`.

## Pendencias externas

- Stripe: criar produtos, prices, cupom Pro, webhook e testar eventos em modo test/live.
- Supabase: aplicar migrations, validar RLS e configurar URLs de Auth.
- Vercel: preencher envs, dominio, `NEXT_PUBLIC_APP_URL`, build e health check.
- Resend: validar dominio/remetente e testar entrega real.
- GA4: configurar Measurement ID e validar eventos.
- Meta Pixel: configurar Pixel ID e validar eventos.
- Sentry: configurar DSN/token e revisar alertas.

## Proximos passos recomendados

1. Rodar teste manual completo em Supabase + Stripe test mode.
2. Adicionar testes de checkout/webhook e um e2e curto do fluxo principal.
3. Revisar rotas legadas e decidir quais ficam escondidas, redirecionadas ou documentadas como demo.
4. Fazer deploy preview na Vercel e executar `docs/post-deploy-test.md`.
