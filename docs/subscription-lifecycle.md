# Ciclo de Vida da Assinatura — AtendeZap IA

## Estados principais

- sem plano
- checkout iniciado
- assinatura ativa
- pagamento falhou
- assinatura vencida
- assinatura cancelada
- troca de plano

## Stripe como fonte de verdade

Stripe controla:

- pagamento
- assinatura
- cancelamento
- troca de plano
- método de pagamento

## Supabase como estado local

Supabase armazena:

- plano atual
- status local
- limite mensal
- uso
- data de renovação
- ids Stripe necessários

## Regras

- não salvar cartão
- não cobrar fora da Stripe
- webhook atualiza Supabase
- portal Stripe gerencia cancelamento e método de pagamento

## Eventos Stripe tratados

- `checkout.session.completed`: confirma checkout e busca a assinatura.
- `customer.subscription.created`: cria ou atualiza assinatura local.
- `customer.subscription.updated`: reflete troca de plano, status, cancelamento agendado e período.
- `customer.subscription.deleted`: marca assinatura como cancelada.
- `invoice.payment_succeeded`: registra pagamento bem-sucedido.
- `invoice.payment_failed`: registra falha de pagamento e mantém aviso no app.

Eventos duplicados são tratados por `stripe_webhook_events.provider_event_id`. A Stripe continua sendo a fonte de verdade financeira.
