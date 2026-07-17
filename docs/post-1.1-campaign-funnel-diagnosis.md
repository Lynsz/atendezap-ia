# Diagnóstico do Funil — Campanha Pequena Pós-1.1

## Etapas do funil

1. Visitou landing
2. Clicou em cadastro
3. Criou conta
4. Concluiu onboarding
5. Abriu dashboard
6. Gerou primeira resposta
7. Copiou resposta
8. Salvou resposta
9. Usou template
10. Acessou assinatura
11. Iniciou checkout
12. Concluiu assinatura

## Dados disponíveis

* Eventos seguros existem localmente para landing, clique/cadastro, onboarding, primeira resposta, cópia, salvamento, pricing e checkout.
* A landing e a preservação de UTMs foram cobertas por teste local.
* O admin agrega eventos do funil sem conteúdo completo de perguntas ou respostas.

## Dados não medidos

* Todas as quantidades das 12 etapas para a campanha real.
* Usuários únicos, períodos, taxas de conversão, abandono e tempo entre etapas.
* Uso real de templates e assinatura concluída atribuída à campanha.

## Gargalos encontrados

* Gargalo confirmado: prontidão operacional anterior ao topo do funil.
* Não há evidência para afirmar gargalo de cadastro, onboarding, IA, cópia, salvamento, templates ou billing.

## Hipóteses

* Migrations ou variáveis divergentes podem impedir tracking no ambiente final.
* OpenAI, Stripe ou RLS podem apresentar comportamento diferente em Production.
* Essas hipóteses não foram confirmadas e não justificam alteração de produto.

## Evidências

* Campanha registrada como bloqueada e não iniciada.
* Nenhum canal ou link UTM foi usado.
* Todas as métricas do acompanhamento e do Dia 1 estão como `não disponível`.
* Nenhum incidente ou P0/P1 foi registrado.

## O que corrigir antes da próxima rodada

* Nenhuma correção de produto sem bug reproduzido.
* Resolver CI remoto, smoke autenticado, migrations/RLS, OpenAI, Stripe e medição de custo.

## O que medir melhor na próxima rodada

* Contagem agregada e usuários únicos por etapa e por período.
* Atribuição segura por canal/UTM.
* Abandono entre cadastro, onboarding e primeira resposta.
* Cópia/salvamento após primeira resposta, acesso à assinatura, checkout e assinatura concluída.
* Feedback agregado, suporte, erros críticos e custo OpenAI.

Nenhuma taxa de conversão foi calculada porque não há dados confiáveis.
