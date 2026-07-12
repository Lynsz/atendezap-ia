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
* eventos `openai_usage_warning`
* usuarios que atingiram limite mensal
* volume por plano quando houver dados reais

## Guardrails

* limite mensal por plano obrigatorio
* verificar limite antes da chamada OpenAI
* nao chamar OpenAI se limite acabou
* falha nao incrementa uso
* demo publica deve ter fallback sem chave
* logs nao salvam prompt completo
* eventos nao salvam resposta completa
* eventos nao salvam pergunta completa
* sucesso incrementa uso somente depois da resposta salva
* falha da OpenAI nao incrementa uso

## Como estimar custo por quantidade de respostas

Use estimativa conservadora fora do produto ate haver medicao real por tokens.

1. Consulte no painel da OpenAI o custo diario ou semanal do projeto.
2. Conte respostas geradas no mesmo periodo pelo admin ou por `generated_responses`.
3. Divida custo do periodo por respostas geradas para obter custo medio aproximado por resposta.
4. Multiplique esse custo medio pelo limite mensal esperado dos usuarios ativos.

Exemplo de formula, sem assumir valor real:

```text
custo_medio_por_resposta = custo_openai_do_periodo / respostas_geradas_no_periodo
custo_estimado_mensal = custo_medio_por_resposta * respostas_previstas_no_mes
```

Se o painel da OpenAI e o volume do produto divergirem, use o painel da OpenAI como fonte financeira e investigue chamadas fora do fluxo principal.

## Onde olhar uso

* Painel da OpenAI para custo real e volume por modelo.
* Admin do AtendeZap IA para respostas geradas, usuarios ativos, limites atingidos e feedback.
* Eventos internos para `usage_limit_reached`, `openai_usage_warning` e falhas de geracao.
* Logs seguros do backend para erros resumidos, sem prompt completo.

## Metricas para acompanhar

* respostas geradas hoje, 7 dias e 30 dias
* usuarios ativos com geracao
* usuarios acima de 80% do limite
* usuarios com limite atingido
* falhas da rota de IA
* custo real no painel da OpenAI
* custo medio aproximado por resposta
* respostas por plano e status de assinatura

## Sinais de abuso

* muitas geracoes em poucos minutos pelo mesmo usuario
* usuario free atingindo limite repetidamente logo apos cadastro
* varias falhas seguidas na rota de IA
* crescimento de custo sem crescimento equivalente de usuarios ativos
* chamadas de IA fora do dashboard autenticado
* volume anormal vindo do mesmo IP ou conta

## Pausar se

* consumo subir sem explicacao
* usuario gerar volume anormal
* limite mensal falhar
* rota de IA for chamada em loop
* custo estimado passar do orcamento definido

## Como validar limite mensal

* Confirmar que a rota de IA consulta assinatura e uso antes da OpenAI.
* Confirmar que `free` cai no limite free quando nao ha assinatura.
* Confirmar que `active` e `trialing` usam o limite do plano pago.
* Confirmar que `past_due`, `canceled`, `unpaid` e `incomplete` usam regra segura.
* Confirmar que `usage_limit_reached` aparece quando o limite bloqueia.
* Confirmar que falha da OpenAI nao incrementa uso.
* Confirmar que sucesso incrementa uso.

## Como investigar consumo anormal

1. Conferir custo e modelo no painel da OpenAI.
2. Conferir respostas geradas no admin no mesmo periodo.
3. Procurar usuarios no topo de uso mensal.
4. Verificar eventos `openai_usage_warning` e `usage_limit_reached`.
5. Conferir logs seguros por erro ou rate limit.
6. Se houver suspeita de loop, reduzir temporariamente limites operacionais e pausar divulgacao.
7. Registrar resultado no relatorio operacional sem copiar prompts, respostas ou dados sensiveis.
