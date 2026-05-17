# Integracao Kiwify

Este guia descreve a nova responsabilidade da Kiwify no AtendeZap IA.

A Kiwify nao e mais a fonte principal da assinatura recorrente do SaaS. Ela deve ser usada para aquisicao:

- ebook gratuito ou baixo ticket;
- order bump do primeiro mes do Plano Pro por R$ 29;
- upsell/cross-sell apontando para criar conta no AtendeZap IA;
- marcacao de origem do usuario/funil.

O billing recorrente dos planos Starter, Pro e Premium fica no Asaas.

## Variaveis

```bash
KIWIFY_WEBHOOK_SECRET=
NEXT_PUBLIC_KIWIFY_EBOOK_URL=
NEXT_PUBLIC_KIWIFY_PRO_ORDER_BUMP_URL=
NEXT_PUBLIC_KIWIFY_STARTER_URL=
NEXT_PUBLIC_KIWIFY_PREMIUM_URL=
```

As URLs publicas sao opcionais e servem para CTAs do funil. A liberacao de plano pago no dashboard deve vir do Supabase atualizado pelo webhook do Asaas.

## Configurar pagina de obrigado

Defina a pagina de obrigado dos produtos de aquisicao como:

```text
[APP_URL]/ebook/obrigado
```

Para upsell/cross-sell, aponte para:

```text
[APP_URL]/precos
```

## Configurar webhook

Configure a URL:

```text
[APP_URL]/api/kiwify/webhook
```

Se a Kiwify permitir segredo/header, configure:

```text
KIWIFY_WEBHOOK_SECRET=um-segredo-forte
```

O app aceita o segredo em:

- `x-kiwify-webhook-secret`
- `x-webhook-secret`
- `Authorization: Bearer seu-segredo`

## Nomes esperados no funil

Use estes nomes ao mapear eventos ou metadata:

- `kiwify_lead`
- `kiwify_order_bump`
- `kiwify_product_purchase`
- `acquisition_source = "kiwify"`
- `funnel_source = "ebook"`

## Testar webhook local

Com `npm run dev` rodando:

```bash
curl -X POST http://localhost:3000/api/kiwify/webhook \
  -H "Content-Type: application/json" \
  -d @docs/mock-kiwify-webhook.json
```

Com segredo:

```bash
curl -X POST http://localhost:3000/api/kiwify/webhook \
  -H "Content-Type: application/json" \
  -H "x-kiwify-webhook-secret: seu-segredo" \
  -d @docs/mock-kiwify-webhook.json
```

Resposta esperada:

```json
{
  "ok": true,
  "mode": "acquisition_funnel",
  "acquisition_source": "kiwify",
  "funnel_source": "ebook"
}
```

## O que nao fazer

- Nao usar Kiwify como fonte principal de assinatura recorrente.
- Nao liberar Starter/Pro/Premium no dashboard apenas por compra Kiwify.
- Nao usar urgencia artificial como vagas limitadas, primeiros usuarios ou oferta temporaria.
