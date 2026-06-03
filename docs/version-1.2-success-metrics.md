# Metricas de Sucesso - Versao 1.2

## Ativacao

- mais usuarios concluem onboarding
- mais usuarios geram primeira resposta
- mais usuarios copiam ou salvam resposta
- mais usuarios usam templates

## Retencao

- mais usuarios voltam em 7 dias
- mais usuarios geram multiplas respostas
- mais usuarios salvam respostas favoritas

## Conversao

- mais usuarios chegam ao pricing
- mais checkouts iniciados
- mais assinaturas
- menos abandono no checkout

## Suporte

- menos duvidas repetidas
- menos bugs criticos
- menor volume de suporte por usuario

## IA e custo

- falhas de IA reduzidas
- custo controlado
- demo sem abuso
- limites funcionando

## Guardrails

- nenhum P0 aberto
- nenhum P1 grave aberto
- nenhum vazamento de dados
- tracking sem conteudo sensivel
- custos externos registrados apenas de forma agregada

## Sprint 2 - ativacao e retencao inicial

Usuario ativado nesta etapa:

- concluiu onboarding
- gerou pelo menos uma resposta
- copiou ou salvou uma resposta
- entendeu como reutilizar templates ou favoritas

Eventos acompanhados:

- `activation_onboarding_completed`
- `activation_first_response_generated`
- `activation_response_copied`
- `activation_response_saved`
- `activation_template_viewed`
- `activation_template_saved`
- `activation_favorite_created`
- `activation_pricing_viewed`

Metricas admin:

- usuarios novos nos ultimos 7 dias
- onboardings concluidos
- primeiras respostas geradas
- respostas copiadas
- respostas salvas
- templates salvos
- favoritos criados
- usuarios ativos em 7 dias
- checkouts iniciados

Guardrail especifico: nao escalar campanha se usuarios novos nao concluem onboarding, nao geram primeira resposta ou nao copiam/salvam respostas.
