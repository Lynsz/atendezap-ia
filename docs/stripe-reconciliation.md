# Reconciliacao Stripe e Supabase - AtendeZap IA

## Objetivo

Resolver divergencias entre pagamentos na Stripe e status salvo no Supabase.

## Stripe como fonte de verdade

- cliente
- assinatura
- status
- pagamento
- cancelamento
- renovacao

## Supabase como estado da aplicacao

- plano atual
- status local
- limite mensal
- uso mensal
- data de renovacao

## Quando reconciliar

- webhook falhou
- usuario pagou mas plano nao liberou
- assinatura cancelada mas app mostra ativa
- checkout concluido sem atualizacao
- evento duplicado ou fora de ordem

## Processo manual seguro

- conferir cliente na Stripe
- conferir assinatura na Stripe
- conferir usuario no Supabase
- atualizar apenas campos necessarios
- documentar acao no incident-log
- nao expor dados sensiveis

## Revisao Sprint 1 da versao 1.2

- Reconciliacao continua manual e segura quando webhook falhar ou houver divergencia entre Stripe e Supabase.
- Nao registrar payload completo, dados de cartao, secrets ou dados sensiveis em docs ou logs.
- Manter Stripe como fonte de verdade financeira.
- Manter Supabase como estado local de plano, status, limite e ciclo.

