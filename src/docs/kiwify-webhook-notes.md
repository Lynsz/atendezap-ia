# Notas internas: Webhook Kiwify

O projeto atual usa simulação local com `localStorage`. A página `/integracoes/kiwify` permite testar eventos mockados de assinatura e pagamento sem chamadas reais para a Kiwify.

## Integração real futura

A integração real precisa de backend para receber, validar e processar webhooks com segurança.

Endpoint futuro sugerido:

```text
/api/webhooks/kiwify
```

## Eventos necessários

- `order_paid`
- `order_refunded`
- `subscription_created`
- `subscription_renewed`
- `subscription_late`
- `subscription_canceled`
- `subscription_expired`

## Fluxo esperado

- Compra aprovada -> liberar acesso e marcar assinatura como ativa.
- Assinatura criada -> criar ou atualizar cliente e assinatura.
- Renovação -> manter acesso ativo e atualizar próxima cobrança.
- Atraso -> marcar assinatura como pendente/em atraso.
- Cancelamento ou expiração -> bloquear ou limitar acesso.
- Reembolso -> cancelar assinatura e registrar evento.

## Segurança esperada

- Validar segredo ou assinatura do webhook.
- Normalizar payloads antes de salvar.
- Não confiar em dados enviados pelo client.
- Não expor chaves privadas no navegador.
- Registrar eventos suficientes para auditoria sem salvar payloads sensíveis completos.
