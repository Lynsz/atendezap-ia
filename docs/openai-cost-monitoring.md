# Monitoramento de Custo OpenAI - AtendeZap IA

## Objetivo

Acompanhar o uso da IA para evitar custo inesperado durante a operacao controlada.

## Monitorar

* respostas geradas por dia
* usuarios ativos
* limite mensal por plano
* falhas da OpenAI
* uso proximo do limite
* custo estimado semanal

## Guardrails

* limite mensal por plano obrigatorio
* verificar limite antes da chamada OpenAI
* nao chamar OpenAI se limite acabou
* falha nao incrementa uso
* demo publica deve ter fallback sem chave
* logs nao salvam prompt completo
* eventos nao salvam resposta completa

## Pausar se

* consumo subir sem explicacao
* usuario gerar volume anormal
* limite mensal falhar
* rota de IA for chamada em loop
* custo estimado passar do orcamento definido
