# Deploy Vercel

Este guia prepara o AtendeZap IA para Vercel em staging e producao controlada. Nao coloque valores reais neste arquivo; configure segredos apenas no painel da Vercel ou em `.env.local` local.

## Criar projeto

1. Conectar o repositorio GitHub na Vercel.
2. Selecionar o framework Next.js.
3. Manter Root Directory como raiz do projeto.
4. Usar Install Command `npm install`.
5. Usar Build Command `npm run build`.
6. Deixar Output Directory vazio para o output padrao do Next.js.
7. Criar primeiro deploy de Preview.
8. Copiar a URL gerada pela Vercel e usar em `NEXT_PUBLIC_APP_URL` do ambiente Preview/Staging.

## Variaveis de ambiente

Configure Production e Preview separadamente. Use Stripe test mode, Supabase staging e remetente Resend de teste no ambiente Preview/Staging.

| Variavel | Obrigatoria? | Ambiente | Uso |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Sim | Publica | URL canonical do ambiente. Monta links de e-mail, redirects Stripe, portal e metadados. |
| `NEXT_PUBLIC_APP_ENV` | Recomendada | Publica | Identifica `staging` ou `production` em monitoramento. |
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | Publica | URL do projeto Supabase usado pelo client e APIs. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Publica | Chave anon publica do Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Servidor | Admin, webhooks, leads e escritas server-side. Nunca expor no client. |
| `OPENAI_API_KEY` | Sim para IA real | Servidor | Geracao real no dashboard e demo. |
| `OPENAI_MODEL` | Sim para IA real | Servidor | Modelo usado pela IA. Default esperado: `gpt-4o-mini`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Sim para pagamentos | Publica | Chave publica Stripe do mesmo modo do secret. |
| `STRIPE_SECRET_KEY` | Sim para pagamentos | Servidor | Cria Checkout, portal e consultas Stripe. |
| `STRIPE_RESTRICTED_KEY` | Opcional | Servidor | Placeholder; nao usar sem caso claro. |
| `STRIPE_WEBHOOK_SECRET` | Sim para pagamentos | Servidor | Valida assinatura do endpoint Stripe do ambiente. |
| `STRIPE_PRICE_STARTER` | Sim para pagamentos | Servidor | Price ID recorrente do Starter. |
| `STRIPE_PRICE_PRO` | Sim para pagamentos | Servidor | Price ID recorrente do Pro. |
| `STRIPE_PRICE_PREMIUM` | Sim para pagamentos | Servidor | Price ID recorrente do Premium. |
| `STRIPE_PRICE_PRO_FIRST_MONTH_29` | Compatibilidade | Servidor | Price legado/promocional mapeado como Pro em webhooks. |
| `STRIPE_PRO_FIRST_MONTH_COUPON_ID` | Recomendada | Servidor | Cupom `duration=once` para primeiro mes do Pro por R$ 29. |
| `RESEND_API_KEY` | Sim para e-mail real | Servidor | Envio do guia gratuito e e-mails transacionais. |
| `EMAIL_FROM` | Sim para e-mail real | Servidor | Remetente validado no Resend. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Opcional | Publica | GA4. Vazio desativa script. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Opcional | Publica | Meta Pixel. Vazio desativa script. |
| `ADMIN_EMAILS` | Sim para admin | Servidor | E-mails admin separados por virgula. |
| `UPSTASH_REDIS_REST_URL` | Opcional | Servidor | Rate limit distribuido. Sem isso, usa fallback em memoria. |
| `UPSTASH_REDIS_REST_TOKEN` | Opcional | Servidor | Token Upstash. |
| `NEXT_PUBLIC_SENTRY_DSN` | Opcional | Publica | Ativa Sentry client/server quando configurada. |
| `SENTRY_AUTH_TOKEN` | Opcional | Servidor/build | Token para integracao/upload Sentry, se adotado. |

## NEXT_PUBLIC_APP_URL

Configure sem barra final:

```text
https://SEU-STAGING.vercel.app
https://SEU-DOMINIO.com
```

O projeto usa essa URL para:

- `success_url` do Stripe Checkout.
- `cancel_url` do Stripe Checkout.
- `return_url` do Customer Portal.
- Links absolutos do e-mail do ebook.
- URL canonical e Open Graph no layout.

Localhost aparece apenas como fallback local em desenvolvimento ou em documentacao de teste local.

## Configurar webhook Stripe na Vercel

Crie um endpoint no Stripe para cada ambiente:

```text
https://SEU-STAGING.vercel.app/api/stripe/webhook
https://SEU-DOMINIO.com/api/stripe/webhook
```

Eventos:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Depois de criar o endpoint, copie o signing secret para `STRIPE_WEBHOOK_SECRET` no mesmo ambiente da Vercel. A rota `/api/stripe/webhook` e publica no middleware e nao depende de usuario logado.

## Supabase

1. Use projeto separado para staging.
2. Aplique migrations antes do teste real.
3. Configure Auth Site URL com `NEXT_PUBLIC_APP_URL`.
4. Configure Redirect URLs com o dominio Vercel e dominio final.
5. Confirme RLS ativo.
6. Configure `ADMIN_EMAILS`.
7. Mantenha `SUPABASE_SERVICE_ROLE_KEY` apenas em variavel server-side da Vercel.

Detalhes em `docs/supabase-vercel.md`.

## Resend

1. Configure `RESEND_API_KEY`.
2. Configure `EMAIL_FROM` com remetente validado.
3. Envie lead em `/ebook`.
4. Confirme e-mail recebido.
5. Confirme status em `lead_email_events` e admin.

Se Resend nao estiver configurado, o app deve salvar o lead e registrar `skipped_not_configured`.

## OpenAI

1. Configure `OPENAI_API_KEY`.
2. Configure `OPENAI_MODEL`.
3. Defina limite de custo na conta OpenAI.
4. Teste `/demo`.
5. Teste geracao no dashboard autenticado.
6. Confirme que a chave nao aparece em variavel `NEXT_PUBLIC_*`.

## Sentry

Sentry e opcional. O projeto so inicializa Sentry quando `NEXT_PUBLIC_SENTRY_DSN` existe. `SENTRY_AUTH_TOKEN` deve ficar apenas no servidor/build e nao e necessario para o app rodar.

## Validacao

Antes do push:

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm run test:e2e
npm run check:secrets
```

Depois do deploy, execute `docs/staging-vercel-checklist.md`.
