# Billing: Kiwify + Asaas

## Estratégia

O AtendeZap IA usa dois papéis separados:

- Kiwify: funil de aquisição, ebook, produto de entrada, order bump e origem do lead.
- Asaas: billing principal do SaaS, cobrança recorrente mensal e webhooks que liberam ou bloqueiam assinatura.

O dashboard não consulta Kiwify nem Asaas diretamente no front-end. A fonte final de verdade é a tabela `subscriptions` no Supabase.

```text
Pagamento confirmado no Asaas
-> /api/asaas/webhook
-> subscriptions no Supabase
-> dashboard lê Supabase
-> plano, limite e recursos são liberados
```

## Planos

A fonte única de planos está em `src/config/plans.ts`.

- Starter: R$ 49/mês, 150 respostas com IA por mês.
- Pro: R$ 29 no primeiro mês para novos usuários, depois R$ 97/mês, 600 respostas com IA por mês.
- Premium: R$ 197/mês, 2.000 respostas com IA por mês.

A oferta do Pro é permanente para novos usuários. Não depende de lançamento, vagas ou prazo temporário.

No fluxo Asaas, a assinatura Pro deve ser criada com valor recorrente normal de R$ 97/mês. Quando a conta ainda não usou a oferta, a primeira cobrança pendente da assinatura é ajustada para R$ 29 e o uso da oferta é marcado no Supabase após confirmação do pagamento.

## Variáveis de ambiente

```bash
NEXT_PUBLIC_APP_URL=

ASAAS_API_KEY=
ASAAS_ENVIRONMENT=sandbox
ASAAS_WEBHOOK_TOKEN=

NEXT_PUBLIC_KIWIFY_EBOOK_URL=
NEXT_PUBLIC_KIWIFY_PRO_ORDER_BUMP_URL=
NEXT_PUBLIC_KIWIFY_STARTER_URL=
NEXT_PUBLIC_KIWIFY_PREMIUM_URL=
KIWIFY_WEBHOOK_SECRET=
```

Também mantenha as variáveis existentes do Supabase e OpenAI:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## Asaas

### Configuração manual

1. Criar conta Sandbox no Asaas.
2. Gerar `ASAAS_API_KEY` em Integrações/API Keys.
3. Configurar `ASAAS_ENVIRONMENT=sandbox` no ambiente local/Vercel.
4. Criar um token forte para webhook e salvar em `ASAAS_WEBHOOK_TOKEN`.
5. Configurar webhook no Asaas apontando para:

```text
https://SEU-DOMINIO/api/asaas/webhook
```

6. Configurar o token do webhook no painel do Asaas. O app valida o header `asaas-access-token`.
7. Habilitar eventos de pagamento/cobrança, especialmente:
   - `PAYMENT_CREATED`
   - `PAYMENT_RECEIVED`
   - `PAYMENT_CONFIRMED`
   - `PAYMENT_OVERDUE`
   - `PAYMENT_CREDIT_CARD_CAPTURE_REFUSED`
   - `PAYMENT_DELETED`
   - `PAYMENT_REFUNDED`

### Rotas

- `POST /api/asaas/create-subscription`: cria customer/assinatura no Asaas para usuário autenticado.
- `POST /api/asaas/webhook`: recebe eventos do Asaas, valida token, registra idempotência e atualiza `subscriptions`.

Se `ASAAS_API_KEY` ou `ASAAS_ENVIRONMENT` não estiverem configuradas, o build continua funcionando. O erro aparece apenas ao iniciar pagamento.

## Kiwify

### Configuração manual

1. Manter Kiwify para ebook, baixo ticket, order bump e upsell/cross-sell.
2. Usar links públicos `NEXT_PUBLIC_KIWIFY_*` apenas no funil de aquisição.
3. Configurar webhook Kiwify em:

```text
https://SEU-DOMINIO/api/kiwify/webhook
```

4. Se a Kiwify permitir header/segredo, configurar `KIWIFY_WEBHOOK_SECRET`.
5. Não usar Kiwify como fonte principal de assinatura recorrente do SaaS.

O webhook Kiwify registra o evento como aquisição:

- `acquisition_source = "kiwify"`
- `funnel_source = "ebook"`
- `funnel_event = "kiwify_product_purchase"`

## Supabase

Aplicar as migrations:

```text
supabase/migrations/0002_funnel_pricing_ebook.sql
supabase/migrations/0003_asaas_billing.sql
```

A migration do Asaas adiciona campos em `subscriptions` sem apagar dados:

- `provider`
- `provider_customer_id`
- `provider_subscription_id`
- `provider_payment_id`
- `acquisition_source`
- `funnel_source`
- `first_month_price_applied`
- `promo_code`
- `last_payment_status`
- `metadata`

Também cria `asaas_webhook_events` com `provider_event_id` único para idempotência.

## Teste local/sandbox

1. Rodar `npm run dev`.
2. Criar uma conta em `/cadastro`.
3. Acessar `/precos`.
4. Clicar no plano desejado.
5. Se aparecer erro de CPF/CNPJ, enviar a chamada via API com dados completos do customer ou evoluir a UI para capturar CPF/CNPJ antes do checkout.
6. Conferir no Asaas Sandbox se customer, assinatura e cobrança foram criados.
7. Expor localhost com ngrok ou Cloudflare Tunnel.
8. Configurar o webhook Sandbox para `https://URL-TUNNEL/api/asaas/webhook`.
9. Simular ou pagar a cobrança no Sandbox.
10. Confirmar no Supabase que `subscriptions.status` virou `active`, `provider = asaas` e `provider_subscription_id` foi salvo.
11. Acessar `/dashboard` e confirmar que o limite do plano foi liberado.
