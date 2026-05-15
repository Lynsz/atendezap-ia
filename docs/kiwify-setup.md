# Integração Kiwify

Guia para operar os checkouts da Kiwify com o AtendeZap IA em produção.

## 1. Criar produtos

Crie três produtos digitais na Kiwify:

- Plano Básico: `R$29,00`
- Plano Starter: `R$49,00`
- Plano Premium: `R$79,00`

Configure todos como produtos digitais automatizados.

## 2. Configurar checkouts

Defina a página de obrigado de cada produto como:

```text
[APP_URL]/obrigado
```

Configure a URL de obrigado na Kiwify como `/obrigado` quando publicar o projeto.

Exemplo:

```text
https://atendezap-ia.com/obrigado
```

Os links oficiais ficam centralizados em `src/config/checkout.ts`:

```text
Plano Básico: https://pay.kiwify.com.br/TzuyT33
Plano Starter: https://pay.kiwify.com.br/YKQD0lL
Plano Premium: https://pay.kiwify.com.br/kpokbPx
```

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
