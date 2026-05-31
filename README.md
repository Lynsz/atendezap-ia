# AtendeZap IA

AtendeZap IA e um micro-SaaS para autonomos, prestadores de servico, pequenos negocios, lojas pequenas, delivery, estetica, assistencia tecnica, restaurantes e vendedores que atendem pelo WhatsApp.

O produto ajuda o usuario a cadastrar o contexto do negocio, colar uma pergunta real de cliente, gerar uma sugestao de resposta com IA, revisar, copiar e enviar manualmente pelo WhatsApp. A versao 1.0 nao envia mensagens automaticamente e nao conecta diretamente ao WhatsApp.

## Status

- Versao 1.0 consolidada documentalmente.
- MVP validado.
- Pronto para producao controlada quando o checklist do ambiente real estiver verde.
- Pronto para campanhas pequenas com baixo orcamento depois de validar checkout, webhook, Supabase, Resend, OpenAI, tracking, admin e suporte.
- Ainda nao pronto para escala ampla.

## Principais features

- Landing page.
- Demo publica.
- Ebook gratuito e captura de leads.
- Envio do ebook por e-mail via Resend.
- Cadastro/login com Supabase.
- Onboarding no dashboard.
- Geracao de respostas com IA em rota server-side.
- Historico de respostas.
- Limite mensal por plano.
- Planos Starter, Pro e Premium.
- Pro recomendado com primeiro mes por R$ 29 para novos usuarios.
- Stripe Checkout, Customer Portal e webhook.
- Dashboard de assinatura.
- Admin protegido.
- Metricas basicas, relatorios internos, feedback e tracking.
- Registro interno admin-only de campanhas, resultados manuais, UTMs, criativos, diagnostico simples e comparacao por nicho/canal.
- Registro interno de insights de produto para feedbacks, bugs, churn, suporte, campanhas e backlog.
- Area de privacidade no dashboard para solicitacoes de exportacao/exclusao.
- Central de ajuda no dashboard com FAQ e solicitacoes simples de suporte.
- Checklist de ativacao no dashboard para primeiros passos.
- Paginas legais.

## Stack usada

- Next.js com App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Supabase Auth e Database.
- Stripe Billing, Checkout, Webhooks e Customer Portal.
- OpenAI SDK em backend.
- Resend.
- `@react-pdf/renderer`.
- Zod.
- Vitest.
- Playwright.
- Deploy compativel com Vercel.

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Para simular um ambiente de producao local:

```bash
npm run build
npm run start
```

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha apenas no ambiente local ou nos provedores. Nunca commite `.env.local`.

Variaveis principais:

```bash
NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=

OPENAI_API_KEY=
OPENAI_MODEL=

RESEND_API_KEY=
EMAIL_FROM=

ADMIN_EMAILS=
SUPPORT_EMAIL=

NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Variaveis server-only:

- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAILS`
- `UPSTASH_REDIS_REST_TOKEN`
- `KIWIFY_WEBHOOK_SECRET`, se usado

Variaveis com `NEXT_PUBLIC_` entram no bundle do navegador. Use esse prefixo apenas para valores publicos.

## Comandos principais

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm run test:e2e
```

Comandos auxiliares:

```bash
npm run check
npm run test:all
npm run check:secrets
npm run validate
npm run stripe:setup-products
```

Antes de finalizar uma mudanca, rode:

```bash
npm run lint
npm run typecheck
npm run build
```

Quando a mudanca tocar validacao, webhook, prompt, geracao, assinatura, limite ou logica critica, rode tambem:

```bash
npm test
```

## Validacao antes de push/deploy

Antes de push ou deploy, rode:

```bash
npm run validate
```

Esse comando executa `check:secrets`, `lint`, `typecheck`, `build` e `test`.

A GitHub Action de validacao roda em pull requests e pushes para `main`, sem secrets reais e sem ler `.env.local`. O repositorio deve continuar privado.

## Deploy privado e ambientes

- O repositorio continua privado no GitHub.
- Use a Vercel conectada ao repositorio privado.
- Valide localmente com `npm run validate` antes de qualquer push ou deploy.
- Valide o Preview/Staging antes de promover qualquer mudanca para producao.
- Configure secrets reais apenas no painel da Vercel e no `.env.local` local.
- `.env.local` nunca deve ir para o Git.
- Use `docs/staging-checklist.md`, `docs/production-deploy-checklist.md` e `docs/post-deploy-smoke-test.md` antes de producao.

## Monitoramento e operacao

- O projeto permanece privado e sem secrets no Git.
- Use `docs/production-monitoring.md` para a rotina minima de acompanhamento em producao.
- Use `docs/backup-strategy.md`, `docs/disaster-recovery.md` e `docs/monthly-backup-checklist.md` para backup, recuperacao e revisao mensal.
- Use `docs/safe-migrations.md` e `docs/rls-review-checklist.md` antes de alterar schema, policies ou dados criticos.
- Use `docs/stripe-reconciliation.md` quando houver divergencia entre Stripe e Supabase.
- Use `docs/subscription-lifecycle.md`, `docs/failed-payments.md` e `docs/churn-analysis.md` para ciclo de assinatura, pagamentos falhos e churn.
- Use `docs/data-retention.md` para orientar retencao e limpeza futura de dados.
- Use `docs/support-workflow.md`, `docs/product-faq.md` e `docs/internal-support-playbook.md` para suporte simples, FAQ e operacao interna.
- Use `docs/user-activation.md`, `docs/activation-emails.md` e `docs/retention-plan.md` para ativacao e retencao inicial.
- Use `docs/internal-metrics.md`, `docs/weekly-business-review.md`, `docs/business-health-criteria.md` e `docs/monthly-business-report-template.md` para revisar crescimento, funil, receita e saude do negocio.
- Use `docs/safe-logging.md` para revisar o que pode ou nao ir para logs.
- Use `docs/ai-cost-control.md`, `docs/plan-limits.md` e `docs/rate-limits.md` para limites de IA, custo e prevencao de abuso.
- Use `docs/niche-campaign-utm-links.md`, `docs/niche-copy-guide.md` e `docs/niche-campaign-plan.md` para campanhas por nicho.
- Use `docs/campaign-results-workflow.md`, `docs/post-campaign-analysis-template.md`, `docs/campaign-decision-criteria.md` e `docs/monthly-campaign-report-template.md` para registrar resultados manuais e decidir proximos testes.
- Use `docs/feedback-workflow.md`, `docs/product-prioritization.md`, `docs/product-backlog.md`, `docs/user-interview-script.md` e `docs/monthly-feedback-report-template.md` para transformar feedback em backlog.
- Use `docs/daily-ops-checklist.md` para a checagem diaria.
- Use `docs/critical-failure-checklist.md` quando checkout, webhook, IA, login ou seguranca falharem.
- Use `docs/error-messages.md` para manter mensagens amigaveis e sem stack trace.
- Logs e analytics nao devem conter dados sensiveis, prompts completos, respostas completas de IA, tokens ou chaves.

## Rotas principais

- `/`: landing page.
- `/atendimento-whatsapp-ia`: pagina de campanha pequena.
- `/demo`: demo publica.
- `/ebook`: captura do guia gratuito.
- `/ebook/obrigado`: obrigado e ponte para demo/cadastro/planos.
- `/ebook/guia`: guia gratuito.
- `/precos`: planos.
- `/cadastro` e `/login`: autenticacao.
- `/dashboard`: produto logado.
- `/dashboard/privacidade`: privacidade, exportacao e exclusao de dados.
- `/dashboard/ajuda`: FAQ e solicitacoes simples de suporte.
- `/assinatura`: assinatura e portal.
- `/admin`: painel protegido.
- `/feedback`: coleta de feedback.
- `/suporte`: suporte publico simples.
- `/termos` e `/privacidade`: paginas legais.

## Documentacao importante

- `docs/README.md`: indice principal da documentacao.
- `docs/version-1.0.md`: escopo da versao 1.0.
- `docs/operations-1.0.md`: rotina operacional da versao 1.0.
- `docs/roadmap-post-1.0.md`: roadmap depois da 1.0.
- `docs/stability-criteria.md`: criterios de estabilidade.
- `docs/incident-response.md`: resposta a incidentes.
- `docs/incident-log.md`: modelo de registro de incidentes.
- `docs/backup-strategy.md`: estrategia de backup.
- `docs/disaster-recovery.md`: plano de recuperacao.
- `docs/monthly-backup-checklist.md`: checklist mensal de backup.
- `docs/safe-migrations.md`: regras para migrations seguras.
- `docs/rls-review-checklist.md`: checklist de revisao de RLS.
- `docs/stripe-reconciliation.md`: reconciliacao Stripe/Supabase.
- `docs/subscription-lifecycle.md`: ciclo de vida da assinatura.
- `docs/failed-payments.md`: tratamento de pagamentos falhos.
- `docs/churn-analysis.md`: analise simples de churn.
- `docs/data-retention.md`: retencao de dados.
- `docs/data-inventory.md`: inventario de dados pessoais e operacionais.
- `docs/support-workflow.md`: fluxo de suporte simples.
- `docs/product-faq.md`: FAQ do produto.
- `docs/internal-support-playbook.md`: playbook interno de suporte.
- `docs/user-activation.md`: definicao e objetivos de ativacao.
- `docs/activation-emails.md`: e-mails simples de ativacao.
- `docs/retention-plan.md`: plano de retencao inicial.
- `docs/internal-metrics.md`: metricas internas agregadas.
- `docs/weekly-business-review.md`: revisao semanal do negocio.
- `docs/business-health-criteria.md`: criterios de saude do negocio.
- `docs/monthly-business-report-template.md`: template de relatorio mensal.
- `docs/privacy-policy.md`: politica de privacidade operacional.
- `docs/terms-of-use.md`: termos de uso operacional.
- `docs/lgpd-compliance.md`: base LGPD inicial.
- `docs/data-export-process.md`: processo manual de exportacao.
- `docs/data-deletion-process.md`: processo manual de exclusao.
- `docs/critical-api-security-review.md`: revisao operacional das APIs criticas.
- `docs/cost-monitoring.md`: monitoramento de custos.
- `docs/ai-cost-control.md`: controle de custos da IA.
- `docs/plan-limits.md`: limites por plano e ciclo de uso.
- `docs/rate-limits.md`: protecao das APIs sensiveis.
- `docs/niche-campaign-utm-links.md`: links UTM por nicho.
- `docs/niche-copy-guide.md`: guia de copy por nicho.
- `docs/niche-campaign-plan.md`: plano de campanha por nicho.
- `docs/campaign-results-workflow.md`: fluxo do registro interno de campanhas.
- `docs/post-campaign-analysis-template.md`: template de analise pos-campanha.
- `docs/campaign-decision-criteria.md`: criterios para manter, pausar, ajustar ou escalar com cautela.
- `docs/monthly-campaign-report-template.md`: template mensal de campanhas.
- `docs/feedback-workflow.md`: fluxo interno de feedback e insights.
- `docs/product-prioritization.md`: critérios de priorização de produto.
- `docs/product-backlog.md`: backlog pós-feedback.
- `docs/user-interview-script.md`: roteiro de entrevista com usuários.
- `docs/monthly-feedback-report-template.md`: template mensal de feedback.
- `docs/retention-plan.md`: plano inicial de retencao.
- `docs/ai-response-quality-plan.md`: qualidade das respostas com IA.
- `docs/internal-faq.md`: FAQ operacional interna.
- `docs/production-readiness.md`: preparacao para producao controlada.
- `docs/go-live-checklist.md`: checklist final no dominio real.
- `docs/deploy-vercel.md`: deploy na Vercel.
- `docs/stripe-setup.md`: Stripe.
- `docs/supabase-setup.md`: Supabase.
- `docs/openai-production.md`: OpenAI em producao.
- `docs/resend-setup.md`: Resend.
- `docs/tracking.md`: GA4, Meta Pixel, UTMs e eventos.
- `docs/testing.md`: testes automatizados e manuais.
- `SECURITY.md`: seguranca e segredos.
- `CHANGELOG.md`: historico de versoes.

## Seguranca

- Nunca commitar `.env.local`.
- Nunca colocar valores reais de chaves em arquivos versionados.
- Nunca chamar OpenAI diretamente do frontend.
- Nunca enviar `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` ou `RESEND_API_KEY` para o navegador.
- Manter webhooks, APIs privadas, admin e RLS como fronteiras de seguranca.

## Seguranca do repositorio

- Este projeto deve permanecer privado por enquanto.
- Nunca commitar `.env.local`, `.env`, arquivos `.pem`, `.key`, `.cert` ou tokens pessoais.
- Use `.env.example` apenas como modelo, sempre sem valores reais.
- Configure secrets reais somente em `.env.local` e nas variaveis de ambiente da Vercel.
- Rode `npm run check:secrets` antes de qualquer push.
- Se qualquer chave for exposta, rotacione a chave no servico, atualize `.env.local` e atualize as variaveis na Vercel.

## Escopo fora da 1.0

- Envio automatico direto pelo WhatsApp.
- CRM completo.
- Multiplos atendentes.
- Automacoes avancadas.
- Integracoes externas avancadas.
- Testes A/B automaticos.
- Nutricao avancada por e-mail.
- App mobile.
