# Pagamentos Falhos — AtendeZap IA

## Quando acontece

- cartão recusado
- método de pagamento expirado
- falha temporária
- assinatura ficou past_due ou unpaid

## Como identificar

- evento invoice.payment_failed
- status da assinatura
- logs seguros
- admin

## O que mostrar ao usuário

- mensagem clara
- botão para abrir portal Stripe
- aviso sobre possível interrupção

## O que não fazer

- não pedir dados de cartão manualmente
- não registrar dados de cartão
- não expor detalhes sensíveis do erro
