# Variaveis Vercel - Versao 1.1

## Obrigatorias

* NEXT_PUBLIC_SUPABASE_URL
* NEXT_PUBLIC_SUPABASE_ANON_KEY
* SUPABASE_SERVICE_ROLE_KEY
* OPENAI_API_KEY
* OPENAI_MODEL
* STRIPE_SECRET_KEY
* STRIPE_WEBHOOK_SECRET
* NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
* STRIPE_PRICE_STARTER
* STRIPE_PRICE_PRO
* STRIPE_PRICE_PREMIUM
* NEXT_PUBLIC_APP_URL
* ADMIN_EMAILS

## Recomendadas

* STRIPE_PRO_FIRST_MONTH_COUPON_ID
* EMAIL_FROM

## Opcionais

* RESEND_API_KEY
* NEXT_PUBLIC_GA_MEASUREMENT_ID
* NEXT_PUBLIC_META_PIXEL_ID
* NEXT_PUBLIC_SENTRY_DSN
* UPSTASH_REDIS_REST_URL
* UPSTASH_REDIS_REST_TOKEN

## Checklist

* [ ] Preview configurado
* [ ] Production configurado
* [ ] chaves de teste Stripe em Preview
* [ ] chaves corretas em Production somente quando aprovado
* [ ] webhook secret correto
* [ ] APP_URL sem localhost
* [ ] ADMIN_EMAILS apenas com e-mails autorizados
* [ ] nenhum valor real documentado no Git

## Regras

* Nao colocar valores reais neste arquivo.
* `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` e `RESEND_API_KEY` devem ficar apenas como variaveis server-side.
* Variaveis `NEXT_PUBLIC_*` podem ir ao bundle do navegador; usar esse prefixo apenas para valores publicos.
* `NEXT_PUBLIC_APP_URL` deve apontar para a URL publica do ambiente, nunca `localhost` em Preview ou Production.

