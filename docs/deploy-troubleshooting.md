# Troubleshooting de deploy

## Build falhou

- Verificar logs da Vercel.
- Rodar `npm run build` localmente.
- Rodar `npm run typecheck`.
- Verificar imports `server-only` em testes/mocks.
- Verificar uso de `window` ou `localStorage` fora de Client Components ou guards.
- Verificar variaveis usadas em build, especialmente `NEXT_PUBLIC_*`.

## Pagina branca

- Verificar erro de runtime nos logs da Vercel.
- Abrir console do navegador.
- Confirmar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Confirmar `NEXT_PUBLIC_APP_URL`.
- Confirmar que scripts opcionais GA4/Meta/Sentry nao estao quebrando quando vazios.

## Checkout nao inicia

- Verificar usuario autenticado.
- Verificar `STRIPE_SECRET_KEY`.
- Verificar `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO` e `STRIPE_PRICE_PREMIUM`.
- Verificar `STRIPE_PRO_FIRST_MONTH_COUPON_ID` para oferta Pro.
- Verificar `NEXT_PUBLIC_APP_URL`.
- Verificar logs de `/api/stripe/create-checkout-session`.
- Confirmar que price IDs pertencem ao mesmo modo da chave Stripe, test ou live.

## Webhook nao atualiza Supabase

- Verificar endpoint configurado no Stripe:
  - `https://SEU-STAGING.vercel.app/api/stripe/webhook`
  - `https://SEU-DOMINIO.com/api/stripe/webhook`
- Verificar `STRIPE_WEBHOOK_SECRET`.
- Verificar eventos selecionados:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Verificar logs da Vercel.
- Verificar `SUPABASE_SERVICE_ROLE_KEY`.
- Confirmar que o webhook nao esta protegido pelo middleware.
- Confirmar que o Stripe event usa metadata com `user_id` e `plan` quando esperado.

## Login nao redireciona

- Verificar Supabase Auth Site URL.
- Verificar Supabase Redirect URLs.
- Verificar dominio configurado em `NEXT_PUBLIC_APP_URL`.
- Verificar cookie `atendezap_auth_hint`.
- Verificar middleware em rotas privadas.
- Testar `/login?redirectTo=%2Fdashboard`.

## E-mail nao envia

- Verificar `RESEND_API_KEY`.
- Verificar `EMAIL_FROM`.
- Verificar dominio/remetente no Resend.
- Verificar `NEXT_PUBLIC_APP_URL` para links do guia.
- Verificar `lead_email_events.status`.
- `skipped_not_configured` indica env ausente.
- `failed` indica erro do provider ou configuracao do remetente.

## IA nao gera resposta

- Verificar `OPENAI_API_KEY`.
- Verificar `OPENAI_MODEL`.
- Verificar billing/limites da conta OpenAI.
- Verificar assinatura e limite mensal do usuario.
- Verificar logs de `/api/ai/generate-response`.
- Confirmar que a chave nao foi colocada como `NEXT_PUBLIC_OPENAI_API_KEY`.

## Supabase retorna erro

- Verificar `NEXT_PUBLIC_SUPABASE_URL`.
- Verificar `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Verificar `SUPABASE_SERVICE_ROLE_KEY`.
- Verificar migrations aplicadas.
- Verificar RLS e grants.
- Testar usuario A/B para isolamento.

## Admin bloqueia admin correto

- Verificar `ADMIN_EMAILS` separado por virgula.
- Confirmar e-mail exato do usuario no Supabase Auth.
- Fazer novo login apos alterar env.
- Verificar logs de `/api/admin/overview`.

## Tracking nao aparece

- Verificar `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Verificar `NEXT_PUBLIC_META_PIXEL_ID`.
- Testar em janela sem bloqueador.
- Verificar GA4 DebugView e Meta Events Manager.
- Confirmar UTMs no lead e checkout metadata.
