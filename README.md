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
- Metricas basicas, feedback e tracking.
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
- `/assinatura`: assinatura e portal.
- `/admin`: painel protegido.
- `/feedback`: coleta de feedback.
- `/termos` e `/privacidade`: paginas legais.

## Documentacao importante

- `docs/README.md`: indice principal da documentacao.
- `docs/version-1.0.md`: escopo da versao 1.0.
- `docs/operations-1.0.md`: rotina operacional da versao 1.0.
- `docs/roadmap-post-1.0.md`: roadmap depois da 1.0.
- `docs/stability-criteria.md`: criterios de estabilidade.
- `docs/incident-response.md`: resposta a incidentes.
- `docs/incident-log.md`: modelo de registro de incidentes.
- `docs/cost-monitoring.md`: monitoramento de custos.
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
