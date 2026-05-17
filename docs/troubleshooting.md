# Troubleshooting

## O checkout nao abre ou retorna erro

O billing recorrente do SaaS usa Asaas. Confira:

```text
ASAAS_API_KEY
ASAAS_ENVIRONMENT=sandbox
ASAAS_WEBHOOK_TOKEN
NEXT_PUBLIC_APP_URL
```

Se o erro acontecer antes de chamar o Asaas, verifique se o usuario esta autenticado e se o CPF/CNPJ foi informado quando for necessario criar um customer novo.

## O preco aparece errado

Os precos publicos devem seguir `src/config/plans.ts`:

```text
Starter: R$ 49/mes
Pro: R$ 29 no primeiro mes para novos usuarios; depois R$ 97/mes
Premium: R$ 197/mes
```

Se aparecer qualquer outro valor, atualize a fonte unica em `src/config/plans.ts`.

## Webhook Asaas retorna 401

`ASAAS_WEBHOOK_TOKEN` esta configurado, mas o header nao foi enviado ou esta diferente.

Envie o token no header:

- `asaas-access-token`
- `asaas_access_token`

## Webhook Kiwify retorna 401

`KIWIFY_WEBHOOK_SECRET` esta configurado, mas o header nao foi enviado ou esta diferente.

Envie um dos headers:

- `x-kiwify-webhook-secret`
- `x-webhook-secret`
- `Authorization: Bearer`

## Pedido duplicado

E esperado que webhooks repetidos retornem:

```json
{ "ok": true, "duplicate": true }
```

Isso evita processar o mesmo evento duas vezes.

## E-mail nao chega

Confira:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- dominio verificado no Resend
- logs do Resend
- evento `access_email_failed`

Se o pedido foi criado, use temporariamente `orders.access_token` para testar o link magico.

## OpenAI falha

Confira:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- saldo/limites da conta
- logs da Vercel
- evento `kit_generation_failed`

Quando a IA falha, o token nao e marcado como usado. O cliente pode tentar novamente.

## PDF nao baixa

Confira:

- se `/kit/[kitId]` abre;
- se o registro existe em `kits`;
- logs da rota `/api/download/[kitId]`;
- evento `pdf_downloaded`.

O MVP gera o PDF sob demanda e nao depende de Supabase Storage.

## Supabase bloqueia leitura/escrita

O schema habilita RLS e bloqueia acesso publico direto. As operacoes devem passar pelas APIs do Next usando `SUPABASE_SERVICE_ROLE_KEY`.

Se falhar localmente, confira se a service role esta configurada no `.env.local`.
