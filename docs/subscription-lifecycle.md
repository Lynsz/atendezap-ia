# Ciclo de Vida da Assinatura - AtendeZap IA

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
- metodo de pagamento

## Supabase como estado local

Supabase armazena:

- plano atual
- status local
- limite mensal
- uso
- data de renovacao
- ids Stripe necessarios

## Regras

- nao salvar cartao
- nao cobrar fora da Stripe
- webhook atualiza Supabase
- portal Stripe gerencia cancelamento e metodo de pagamento

## Eventos Stripe tratados

- `checkout.session.completed`: confirma checkout e busca a assinatura.
- `customer.subscription.created`: cria ou atualiza assinatura local.
- `customer.subscription.updated`: reflete troca de plano, status, cancelamento agendado e periodo.
- `customer.subscription.deleted`: marca assinatura como cancelada.
- `invoice.payment_succeeded`: registra pagamento bem-sucedido.
- `invoice.payment_failed`: registra falha de pagamento e mantem aviso no app.

Eventos duplicados sao tratados por `stripe_webhook_events.provider_event_id`. A Stripe continua sendo a fonte de verdade financeira.

## Revisao Sprint 1 da versao 1.2

- Checkout exige usuario autenticado antes de criar sessao Stripe.
- Portal Stripe exige usuario autenticado e customer Stripe vinculado.
- Webhook valida assinatura com `STRIPE_WEBHOOK_SECRET` antes de processar evento.
- Eventos duplicados continuam idempotentes por `provider_event_id`.
- Status locais preservam `active`, `trialing`, `past_due`, `unpaid`, `canceled`, `incomplete`, `incomplete_expired` e `paused`.
- IDs Stripe ficam restritos a backend, Supabase e respostas estritamente necessarias para redirecionamento de checkout/portal.
- Pendencia: validar checkout, portal, webhook, troca/cancelamento e dunning em staging/producao.

