# Deploy na Vercel

Guia de deploy do AtendeZap IA em producao. Para primeiro teste real, use antes `docs/staging-deploy.md`. Nao coloque valores reais neste arquivo; configure os valores no painel da Vercel.

## 1. Criar projeto na Vercel

1. Acesse a Vercel e crie um novo projeto.
2. Importe o repositorio GitHub do AtendeZap IA.
3. Confirme o framework como Next.js.
4. Use os comandos padrao:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: deixe vazio para Next.js.

## 2. Configurar variaveis de ambiente

Configure as variaveis em Production, Preview e Development quando fizer sentido.

### App

```text
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_ENV=
```

Use o dominio final, sem barra no fim. Essa URL monta redirects do Stripe, links de e-mail e metadados SEO.
Use `NEXT_PUBLIC_APP_ENV=production` em producao e `staging` em previews de teste.

### Supabase

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` podem ser publicas. `SUPABASE_SERVICE_ROLE_KEY` e somente servidor.

### OpenAI

```text
OPENAI_API_KEY=
OPENAI_MODEL=
```

Somente servidor. A geracao de respostas e kits deve continuar em rotas API ou libs chamadas pelo backend.

### Stripe

```text
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRICE_PRO_FIRST_MONTH_29=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
```

`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` e publica. As demais variaveis ficam somente no servidor. O checkout do Pro usa `STRIPE_PRICE_PRO` com cupom em `STRIPE_PRO_FIRST_MONTH_COUPON_ID`; `STRIPE_PRICE_PRO_FIRST_MONTH_29` fica apenas para mapear webhooks antigos/promocionais como plano Pro.

### Resend

```text
RESEND_API_KEY=
EMAIL_FROM=
SUPPORT_EMAIL=
```

`RESEND_API_KEY` fica somente no servidor. `EMAIL_FROM` deve ser um remetente validado no Resend.

### Tracking

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

Sao IDs publicos opcionais. Se ficarem vazios, os scripts nao carregam.

### Rate limit e monitoramento

```text
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

Upstash e Sentry sao opcionais. Se Upstash ficar vazio, o app usa fallback local/memoria para rate limit. `SENTRY_AUTH_TOKEN` fica somente no servidor/build.

### Admin

```text
ADMIN_EMAILS=
```

Use e-mails separados por virgula. O usuario precisa estar autenticado no Supabase e ter e-mail listado.

### Kiwify legado/aquisicao

```text
KIWIFY_WEBHOOK_SECRET=
NEXT_PUBLIC_KIWIFY_EBOOK_URL=
NEXT_PUBLIC_KIWIFY_PRO_ORDER_BUMP_URL=
NEXT_PUBLIC_KIWIFY_STARTER_URL=
NEXT_PUBLIC_KIWIFY_PREMIUM_URL=
```

`KIWIFY_WEBHOOK_SECRET` e servidor. As URLs publicas so devem apontar para destinos reais de campanha.

## 3. Configurar dominio

1. Adicione o dominio na Vercel.
2. Configure DNS conforme instrucoes da Vercel.
3. Atualize `NEXT_PUBLIC_APP_URL` para o dominio final.
4. Rode novo deploy para garantir que redirects, e-mails e SEO usem a URL correta.

## 4. Configurar Supabase em producao

1. Crie ou selecione o projeto Supabase de producao.
2. Aplique as migrations em `supabase/migrations`.
3. Verifique se as tabelas existem, incluindo `profiles`, `businesses`, `generated_responses`, `subscriptions`, `stripe_webhook_events`, `ebook_leads` e `lead_email_events`.
4. Verifique RLS nas tabelas expostas e confirme politicas de acesso por usuario.
5. Configure Auth Site URL com o dominio de producao.
6. Configure Redirect URLs para o dominio de producao e previews que serao usados.
7. Confirme que `SUPABASE_SERVICE_ROLE_KEY` existe apenas na Vercel, nunca no client.
8. Teste login, cadastro, dashboard, onboarding e leitura/escrita de dados do proprio usuario.
9. Teste que um usuario comum nao acessa dados de outro usuario.
10. Teste que `/admin` exige login e e-mail presente em `ADMIN_EMAILS`.

## 5. Configurar Stripe em producao

1. Crie produtos Starter, Pro e Premium.
2. Crie os precos recorrentes mensais e copie os price IDs para:
   - `STRIPE_PRICE_STARTER`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_PREMIUM`
3. Para o Pro com primeiro mes por R$ 29, crie um cupom `duration=once` que reduza a primeira fatura para R$ 29 e copie para `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.
4. Configure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` e `STRIPE_SECRET_KEY` no mesmo modo, test ou live.
5. Configure o webhook em:

```text
https://SEU-DOMINIO/api/stripe/webhook
```

6. Marque os eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
7. Copie o signing secret para `STRIPE_WEBHOOK_SECRET`.
8. Teste checkout em modo test antes de usar live.
9. Valide `success_url`, `cancel_url` e portal return URL voltando para o dominio configurado em `NEXT_PUBLIC_APP_URL`.

## 6. Configurar Resend

1. Crie a conta no Resend.
2. Valide o dominio de envio ou use um remetente de teste permitido pelo Resend.
3. Configure `RESEND_API_KEY`.
4. Configure `EMAIL_FROM` com remetente validado.
5. Envie um lead pelo ebook.
6. Confirme recebimento do e-mail do guia.
7. Confira `lead_email_events` ou o admin para status `sent`, `failed` ou `skipped_not_configured`.

## 7. Configurar tracking

1. Crie o stream Web no GA4 e copie o Measurement ID para `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
2. Crie o Meta Pixel e copie o ID para `NEXT_PUBLIC_META_PIXEL_ID`.
3. Rode novo deploy.
4. Acesse `/ebook` com UTMs.
5. Confirme que UTMs sao salvas e enviadas no lead e no checkout.
6. Teste eventos:
   - `ebook_view`
   - `lead_success`
   - `checkout_started`
   - `onboarding_completed`

## 8. Primeiro deploy

1. Rode localmente:

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run test
```

2. Faca commit e push.
3. Aguarde o build da Vercel.
4. Abra `/api/health` e confirme `status: "ok"`.
5. Abra as rotas publicas:
   - `/`
   - `/ebook`
   - `/ebook/guia`
   - `/ebook/obrigado`
   - `/precos`
   - `/cadastro`
   - `/login`
   - `/termos`
   - `/privacidade`

## 9. Testes finais em producao

1. Teste autenticacao com usuario novo.
2. Complete onboarding.
3. Gere uma resposta.
4. Veja uso mensal no dashboard.
5. Abra planos e inicie checkout.
6. Simule pagamento em modo test.
7. Confirme webhook recebido e plano ativo no Supabase.
8. Abra customer portal e volte para `/assinatura`.
9. Envie lead no ebook.
10. Confirme lead, UTMs, e-mail e evento de tracking.
11. Acesse admin e exporte CSV.
12. Teste mobile.

Use tambem `docs/post-deploy-checklist.md` e `docs/post-deploy-test.md`.
