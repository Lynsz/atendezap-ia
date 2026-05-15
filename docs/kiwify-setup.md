# Integração Kiwify

Guia para operar o checkout da Kiwify com o AtendeZap IA em produção.

## 1. Criar produto

1. Acesse a Kiwify.
2. Crie um produto digital chamado `AtendeZap IA - Plano Profissional`.
3. Defina o preço inicial recomendado: `R$49`.
4. Configure entrega como produto digital automatizado.

## 2. Configurar checkout

1. Configure o checkout do produto.
2. Defina a página de obrigado como:

```text
[APP_URL]/obrigado
```

Exemplo:

```text
https://atendezap-ia.com/obrigado
```

3. Copie o link do checkout e configure na Vercel:

```text
NEXT_PUBLIC_KIWIFY_CHECKOUT_PRO=https://pay.kiwify.com.br/...
```

Os planos Básico e Premium usam:

```text
NEXT_PUBLIC_KIWIFY_CHECKOUT_BASIC=
NEXT_PUBLIC_KIWIFY_CHECKOUT_PREMIUM=
```

Se uma variável não estiver preenchida, o botão do plano fica desabilitado.

## 3. Configurar webhook

Configure a URL:

```text
[APP_URL]/api/kiwify/webhook
```

Evento esperado:

- compra aprovada
- pagamento aprovado
- status equivalente a `approved`, `paid` ou `completed`

Se a Kiwify permitir segredo/header, configure também:

```text
KIWIFY_WEBHOOK_SECRET=um-segredo-forte
```

O app aceita o segredo em:

- `x-kiwify-webhook-secret`
- `x-webhook-secret`
- `Authorization: Bearer seu-segredo`

## 4. Testar webhook local

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

## 5. Conferir resultado

No Supabase, confira:

- `customers`: comprador criado ou atualizado.
- `orders`: pedido criado com `access_token`.
- `events`: eventos `webhook_received`, `order_approved` e `access_email_sent` ou `access_email_failed`.

Se `RESEND_API_KEY` não estiver configurada, o pedido é criado e o evento de e-mail informa falha/pulo. Para teste manual, use `orders.access_token` e acesse:

```text
[APP_URL]/gerar/[access_token]
```

## 6. Idempotência

Se o mesmo webhook chegar duas vezes com o mesmo `kiwify_order_id`, o app não cria novo pedido nem novo token. A resposta retorna sucesso com `duplicate: true`.

## 7. Erros comuns

- `Webhook não autorizado.`: segredo ausente ou diferente.
- `JSON inválido no webhook da Kiwify.`: payload malformado.
- `Webhook recebido sem e-mail do comprador.`: payload não trouxe e-mail em nenhum campo conhecido.
- Pedido criado, mas e-mail não enviado: confira `RESEND_API_KEY`, `EMAIL_FROM` e domínio verificado no Resend.
