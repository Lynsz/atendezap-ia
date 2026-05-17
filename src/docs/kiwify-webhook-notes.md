# Notas internas: Webhook Kiwify

A Kiwify agora deve ser tratada como canal de aquisicao do funil, nao como billing recorrente principal do SaaS.

A pagina `/integracoes/kiwify` pode continuar sendo usada para testes e demonstracoes de eventos mockados, mas a liberacao real de Starter, Pro e Premium deve vir do Supabase atualizado pelo webhook do Asaas.

## Integracao real

Endpoint atual:

```text
/api/kiwify/webhook
```

## Eventos esperados

- `kiwify_lead`
- `kiwify_order_bump`
- `kiwify_product_purchase`

## Fluxo esperado

- Lead/ebook -> registrar origem do funil.
- Order bump -> registrar interesse ou compra inicial vinculada ao funil.
- Upsell/cross-sell -> orientar o usuario para criar conta e assinar pelo fluxo Asaas.

## Seguranca esperada

- Validar segredo ou assinatura do webhook quando disponivel.
- Normalizar payloads antes de salvar.
- Nao confiar em dados enviados pelo client.
- Nao expor chaves privadas no navegador.
- Registrar eventos suficientes para auditoria sem salvar payloads sensiveis completos.
