# Priorizacao - Versao 1.3

## Metodo

Priorizar por impacto, esforco, risco e evidencia.

## Criterios

- impacto em ativacao
- impacto em retencao
- impacto em conversao
- reducao de bugs
- reducao de suporte
- reducao de custo da IA
- evidencia em dados
- baixo risco tecnico

## Matriz

| Item | Categoria | Impacto | Esforco | Risco | Evidencia | Prioridade |
|---|---|---|---|---|---|---|
| Validar Stripe, portal, webhook, Supabase RLS, OpenAI, Resend, tracking, admin e health check | Correcoes | Alto | Medio | Baixo | Pendente recorrente pos-1.2 | P1 |
| Corrigir qualquer P0/P1 real antes de campanha | Correcoes | Alto | Variavel | Baixo | Criterio de pausa em todos os docs | P0 |
| Validar cadastro, onboarding, primeira resposta, copia e salvamento | Ativacao | Alto | Medio | Baixo | Maior gargalo ainda nao medido | P1 |
| Revisar limites, falhas e custo de IA antes de trafego | IA e qualidade | Alto | Medio | Medio | Risco explicito de custo e falha de IA | P1 |
| Validar mobile das paginas de destino e dashboard | UX mobile | Medio | Medio | Baixo | Campanha deve pausar se mobile quebrar | P1 |
| Melhorar biblioteca, favoritos e templates recomendados com dados | Retencao | Medio | Medio | Baixo | Retencao inicial e reutilizacao sao foco 1.3 | P2 |
| Ajustar CTA pos-primeira resposta para pricing | Conversao | Medio | Baixo | Baixo | Depende de primeira resposta sem pricing | P2 |
| Ajustar copy da landing delivery | Campanhas | Medio | Baixo | Baixo | Depende de visitantes sem clique ou leads | P2 |
| Testar criativo 02 de delivery | Campanhas | Medio | Baixo | Medio | Hipotese definida, sem dados reais ainda | P2 |
| Mudar pricing | Conversao | Alto | Medio | Alto | Sem dados suficientes | P3 |
| Alterar prompt de IA | IA e qualidade | Medio | Medio | Medio | Sem feedback agregado suficiente | P3 |
| Novo nicho prioritario | Campanhas | Medio | Medio | Medio | Sem nicho vencedor | P3 |
| Custo interno por resposta com tokens persistidos | IA e qualidade | Medio | Medio | Medio | Util apenas se custo virar decisao operacional | P3 |

## Itens escolhidos

- Validar provedores reais, RLS, billing, tracking, admin e health check.
- Corrigir qualquer P0/P1 real.
- Validar ativacao ate primeira resposta, copia e salvamento.
- Revisar IA, limites e custo antes de trafego.
- Validar mobile das superficies criticas.
- Preparar nova variacao pequena de delivery apenas depois de checklist verde.

## Itens adiados

- Mudanca de pricing.
- Mudanca grande de prompt.
- Novo nicho prioritario.
- Relatorio interno profundo de custo por resposta.
- Alertas automaticos.
- E-mails automaticos de retorno sem regra operacional.

## Justificativa

- A evidencia real ainda e insuficiente para concluir desempenho de campanha, nicho, criativo, pricing ou prompt.
- A versao 1.3 deve reduzir risco operacional e medir ativacao/conversao antes de qualquer melhoria maior.
- Itens escolhidos dependem pouco de dados sensiveis, cabem no admin e docs atuais e podem ser validados com metricas simples.
