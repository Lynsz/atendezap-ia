# Pagamentos Falhos - AtendeZap IA

## Quando acontece

- cartao recusado
- metodo de pagamento expirado
- falha temporaria
- assinatura ficou `past_due` ou `unpaid`

## Como identificar

- evento `invoice.payment_failed`
- status da assinatura
- logs seguros
- admin

## O que mostrar ao usuario

- mensagem clara
- botao para abrir portal Stripe
- aviso sobre possivel interrupcao

## O que nao fazer

- nao pedir dados de cartao manualmente
- nao registrar dados de cartao
- nao expor detalhes sensiveis do erro

## Revisao Sprint 1 da versao 1.2

- `invoice.payment_failed` permanece tratado pelo webhook Stripe.
- Status `past_due` e `unpaid` nao liberam geracao como assinatura ativa.
- A mensagem ao usuario deve orientar atualizacao pelo portal Stripe, sem pedir dados de cartao manualmente.
- Logs registram apenas evento seguro, rota, status e metadados minimos.

