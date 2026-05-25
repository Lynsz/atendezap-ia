# Plano de Retencao Inicial - AtendeZap IA

## Objetivo

Entender se usuarios voltam a usar o produto depois do primeiro acesso.

## Metricas iniciais

- Usuarios que geraram primeira resposta.
- Usuarios que geraram mais de uma resposta.
- Usuarios ativos nos ultimos 7 dias.
- Usuarios ativos nos ultimos 30 dias.
- Usuarios que atingiram limite mensal.
- Cancelamentos.
- Feedbacks negativos.
- Feedbacks positivos.

## Sinais positivos

- Usuario gera varias respostas.
- Usuario edita configuracao.
- Usuario volta ao dashboard.
- Usuario inicia checkout.
- Usuario assina.
- Usuario envia feedback construtivo.

## Sinais de alerta

- Usuario cadastra e nao faz onboarding.
- Usuario conclui onboarding e nao gera resposta.
- Usuario gera uma resposta e nao volta.
- Usuario inicia checkout e abandona.
- Usuario cancela rapido.
- Usuario reclama da qualidade da resposta.

## Como acompanhar

- Usar o admin para ativacao, primeira resposta, assinaturas e feedbacks.
- Usar Supabase para conferir historico por usuario quando houver suporte individual.
- Usar Stripe para cancelamentos, pagamentos falhos e status de assinatura.
- Usar feedbacks para entender motivos qualitativos de abandono.
