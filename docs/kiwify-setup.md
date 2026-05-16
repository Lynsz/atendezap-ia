# Integração Kiwify

Guia para operar os checkouts recorrentes da Kiwify com o AtendeZap IA em produção.

## Status atual

O webhook `/api/kiwify/webhook` está seguro como placeholder do SaaS: ele valida `KIWIFY_WEBHOOK_SECRET` quando a variável existir, registra apenas metadados mínimos e não atualiza `subscriptions` automaticamente.

A liberação automática por webhook será implementada em etapa futura, com validação real de autenticidade da Kiwify e mapeamento seguro entre compra, usuário Supabase e plano contratado.

## Fluxo manual inicial

1. Cliente compra na Kiwify.
2. Admin confirma o pagamento na Kiwify.
3. Admin localiza o `user_id` do cliente no Supabase.
4. Admin atualiza a tabela `subscriptions` manualmente no SQL Editor do Supabase.

## SQL manual para upgrade

Para Inicial:

```sql
update subscriptions
set plan_name = 'Inicial',
    status = 'active',
    current_period_end = now() + interval '30 days',
    updated_at = now()
where user_id = 'COLE_USER_ID_AQUI';
```

Para Pro:

```sql
update subscriptions
set plan_name = 'Pro',
    status = 'active',
    current_period_end = now() + interval '30 days',
    updated_at = now()
where user_id = 'COLE_USER_ID_AQUI';
```

Para Premium:

```sql
update subscriptions
set plan_name = 'Premium',
    status = 'active',
    current_period_end = now() + interval '30 days',
    updated_at = now()
where user_id = 'COLE_USER_ID_AQUI';
```

## Configurar checkouts

Defina a página de obrigado de cada produto como:

```text
[APP_URL]/obrigado
```

Configure as URLs públicas no ambiente:

```bash
NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL=
NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL=
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

Resposta esperada nesta etapa:

```json
{
  "ok": true,
  "mode": "manual_subscription_release"
}
```

## Erros comuns

- `Webhook não autorizado.`: segredo ausente ou diferente quando `KIWIFY_WEBHOOK_SECRET` está configurado.
- `JSON inválido no webhook da Kiwify.`: payload malformado.
- Cliente pagou, mas plano não mudou: comportamento esperado nesta etapa; faça o upgrade manual no Supabase.
