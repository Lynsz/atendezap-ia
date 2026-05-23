# Produtos Stripe - AtendeZap IA

Este guia prepara os produtos, prices mensais e a oferta do Plano Pro em Stripe test mode. Nao coloque chaves reais em arquivos versionados.

## Estrategia escolhida

A oferta "primeiro mes por R$ 29" usa cupom Stripe aplicado somente no Checkout do plano Pro.

- O price recorrente principal continua sendo `STRIPE_PRICE_PRO`.
- O plano interno continua sendo `plan = "pro"`.
- O cupom deve ter `duration=once`.
- `STRIPE_PRICE_PRO_FIRST_MONTH_29` fica como compatibilidade para webhooks antigos ou configuracoes anteriores e tambem mapeia para `plan = "pro"`.

## Criar via script

1. Configure `STRIPE_SECRET_KEY` de test mode no terminal local.
2. Ajuste os valores em centavos, se necessario:

```bash
STRIPE_STARTER_AMOUNT_CENTS=
STRIPE_PRO_AMOUNT_CENTS=
STRIPE_PREMIUM_AMOUNT_CENTS=
STRIPE_PRO_FIRST_MONTH_AMOUNT_CENTS=
STRIPE_CURRENCY=brl
```

Se os valores ficarem vazios, o script usa os valores comerciais centralizados no projeto: Starter R$ 49, Pro R$ 97, Premium R$ 197 e primeiro mes Pro R$ 29.

3. Rode:

```bash
npm run stripe:setup-products
```

4. Copie os IDs impressos para `.env.local` e para as variaveis da Vercel:

```bash
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
```

O script cria ou reutiliza produtos e prices mensais equivalentes. Ele nao imprime `STRIPE_SECRET_KEY`.

## Criar manualmente no Stripe Dashboard

1. Entrar no Stripe Dashboard.
2. Ativar modo test.
3. Criar produto `AtendeZap IA Starter`.
4. Criar price mensal recorrente em BRL.
5. Copiar o price ID para `STRIPE_PRICE_STARTER`.
6. Criar produto `AtendeZap IA Pro`.
7. Criar price mensal recorrente em BRL.
8. Copiar o price ID para `STRIPE_PRICE_PRO`.
9. Criar produto `AtendeZap IA Premium`.
10. Criar price mensal recorrente em BRL.
11. Copiar o price ID para `STRIPE_PRICE_PREMIUM`.
12. Criar cupom para o Pro primeiro mes por R$ 29.
13. No cupom, usar desconto fixo em BRL com `duration=once`.
14. Calcular o desconto como `valor normal do Pro - R$ 29`.
15. Copiar o coupon ID para `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.
16. Configurar webhook.
17. Testar checkout em modo test.

## Variaveis completas

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=
STRIPE_PRICE_PRO_FIRST_MONTH_29=
STRIPE_PRO_FIRST_MONTH_COUPON_ID=
STRIPE_STARTER_AMOUNT_CENTS=
STRIPE_PRO_AMOUNT_CENTS=
STRIPE_PREMIUM_AMOUNT_CENTS=
STRIPE_PRO_FIRST_MONTH_AMOUNT_CENTS=
STRIPE_CURRENCY=brl
NEXT_PUBLIC_APP_URL=
```

## Webhook

Endpoint:

```text
/api/stripe/webhook
```

Eventos minimos:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

O webhook mapeia `STRIPE_PRICE_STARTER` para `starter`, `STRIPE_PRICE_PRO` para `pro`, `STRIPE_PRICE_PRO_FIRST_MONTH_29` para `pro` e `STRIPE_PRICE_PREMIUM` para `premium`.

## Checklist de teste

1. Rodar o script ou criar produtos manualmente.
2. Copiar price IDs e coupon ID para `.env.local`.
3. Reiniciar o servidor Next.js.
4. Acessar `/assinatura` com usuario logado.
5. Assinar Starter em test mode.
6. Confirmar webhook e Supabase.
7. Assinar Pro e confirmar desconto do primeiro mes quando o cupom existir.
8. Remover temporariamente o cupom e confirmar que o Pro ainda abre checkout sem desconto.
9. Assinar Premium em test mode.
10. Testar Customer Portal.
