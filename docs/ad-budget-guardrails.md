# Guardrails de Orcamento - AtendeZap IA

## Objetivo

Evitar aumento de orcamento sem dados suficientes.

## Regras

- nao aumentar orcamento com bug P0/P1
- nao aumentar orcamento se checkout/webhook nao estiver validado
- nao aumentar orcamento se usuarios nao geram primeira resposta
- nao aumentar orcamento se tracking estiver quebrado
- nao aumentar orcamento se custo da IA estiver subindo sem ativacao
- revisar metricas diariamente
- manter gasto externo fora do app, registrando no admin apenas numeros agregados

## Sinais para manter baixo orcamento

- poucos dados
- baixo volume de cadastros
- onboarding fraco
- baixa primeira resposta
- muitas duvidas de suporte
- feedback confuso

## Sinais para aumentar com cautela

- usuarios ativam
- custo controlado
- checkout inicia
- assinatura acontece
- suporte sob controle
- produto estavel

## Limite operacional

- Qualquer aumento deve ser pequeno, reversivel e revisado no dia seguinte.
- Se os sinais piorarem, reduzir ou pausar antes de buscar novo criativo.
