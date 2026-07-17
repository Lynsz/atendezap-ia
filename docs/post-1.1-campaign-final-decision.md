# Decisão Final — Campanha Pequena Pós-1.1

## Decisão

* repetir campanha pequena: não agora
* corrigir produto antes de nova campanha: não há bug reproduzido que justifique alteração
* **manter operação controlada: sim**
* preparar campanha um pouco mais estruturada: não agora
* planejar versão 1.2: não aprovado por falta de dados
* **pausar divulgação: sim**

## Motivos

* A campanha foi bloqueada antes da primeira divulgação.
* Não existem métricas, feedbacks ou comparação de canais que sustentem mudança de produto, nova campanha ou versão 1.2.
* O ambiente real ainda possui validações operacionais pendentes.

## Evidências

* Nenhum canal, mensagem ou link UTM foi usado.
* Relatório do Dia 1 registra campanha bloqueada e nenhuma publicação.
* Todas as métricas estão `não disponível` ou `não medido`.
* Nenhum incidente, P0 ou P1 foi confirmado.
* Tracking e smoke locais passaram, mas não substituem validação autenticada em Production.

## Bloqueadores

* GitHub Actions remoto não confirmado.
* Smoke autenticado de Preview/Production não preenchido.
* Migrations e RLS com dois usuários reais pendentes.
* OpenAI, Stripe Checkout, portal e webhook reais pendentes.
* Custo OpenAI e janela de estabilidade real não medidos.

## Bugs P0 pendentes

* Nenhum confirmado.

## Bugs P1 pendentes

* Nenhum confirmado.

## Riscos

* Divergência de variáveis, migrations ou RLS no ambiente real.
* Falha de IA ou billing aparecer somente após divulgação.
* Tracking incompleto impedir diagnóstico e controle de custo.
* Interpretar ausência de dados como sucesso e avançar sem evidência.

## Próximo passo recomendado

* Resolver os bloqueadores operacionais e repetir a validação controlada.
* Só então decidir se uma nova campanha pequena pode começar por convite manual.
* Não criar agora o plano da próxima rodada nem o plano inicial da versão 1.2; faltam critérios de aprovação e dados suficientes.

## Critérios antes de nova decisão

* nenhum P0 aberto
* P1 críticos controlados
* copy e tracking validados no ambiente final
* fluxo principal autenticado funcionando
* checkout/webhook e custo OpenAI sob controle
* métricas agregadas disponíveis para a próxima análise
