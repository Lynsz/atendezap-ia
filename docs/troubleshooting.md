# Troubleshooting

## O checkout abre o link errado

Confira o arquivo `src/config/checkout.ts`. Os checkouts oficiais atuais são mensais:

```text
Plano Básico: https://pay.kiwify.com.br/SoDyO2k
Plano Starter: https://pay.kiwify.com.br/KfYbZzC
Plano Premium: https://pay.kiwify.com.br/n6jZUdh
```

Depois de alterar qualquer configuração, rode o build novamente.

## O preço aparece sem mensalidade

Todos os preços públicos devem aparecer como:

```text
R$29,00/mês
R$49,00/mês
R$79,00/mês
```

Se aparecer qualquer preço sem `/mês`, atualize o texto para deixar a cobrança mensal clara.

## Webhook retorna 401

`KIWIFY_WEBHOOK_SECRET` está configurado, mas o header não foi enviado ou está diferente.

Envie um dos headers:

- `x-kiwify-webhook-secret`
- `x-webhook-secret`
- `Authorization: Bearer`

## Webhook retorna erro de e-mail ausente

O payload da Kiwify não trouxe e-mail nos campos conhecidos. Confira o payload recebido e ajuste `normalizeKiwifyPayload` se a Kiwify estiver usando outro formato.

## Pedido duplicado

É esperado que webhooks repetidos retornem:

```json
{ "ok": true, "duplicate": true }
```

Isso evita criar dois tokens para a mesma compra.

## E-mail não chega

Confira:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- domínio verificado no Resend
- logs do Resend
- evento `access_email_failed`

Se o pedido foi criado, use temporariamente `orders.access_token` para testar o link mágico.

## OpenAI falha

Confira:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- saldo/limites da conta
- logs da Vercel
- evento `kit_generation_failed`

Quando a IA falha, o token não é marcado como usado. O cliente pode tentar novamente.

## PDF não baixa

Confira:

- se `/kit/[kitId]` abre;
- se o registro existe em `kits`;
- logs da rota `/api/download/[kitId]`;
- evento `pdf_downloaded`.

O MVP gera o PDF sob demanda e não depende de Supabase Storage.

## Supabase bloqueia leitura/escrita

O schema habilita RLS e bloqueia acesso público direto. As operações devem passar pelas APIs do Next usando `SUPABASE_SERVICE_ROLE_KEY`.

Se falhar localmente, confira se a service role está configurada no `.env.local`.
