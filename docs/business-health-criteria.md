# Criterios de Saude do Negocio - AtendeZap IA

## Sinais positivos

- usuarios concluem onboarding
- usuarios geram respostas
- usuarios salvam respostas
- usuarios voltam em ate 7 dias
- checkouts acontecem
- assinaturas aparecem
- feedbacks sao corrigiveis
- campanha em escala cautelosa mantem custo controlado
- suporte permanece sob controle durante aumento gradual

## Sinais de alerta

- muitos cadastros sem uso
- muitos usos sem checkout
- muitos checkouts sem assinatura
- feedbacks indicam produto confuso
- custo de IA cresce sem conversao
- suporte aumenta por erro tecnico
- campanha exige aumento de gasto sem primeira resposta
- tracking fica incompleto durante campanha ativa

## Sinais criticos

- checkout quebrado
- IA falhando
- webhook quebrado
- dados expostos
- usuarios pagos sem plano liberado
- bug P0/P1 durante escala cautelosa
- custo da IA sobe de forma anormal
- admin ou tracking ficam indisponiveis para decisao diaria

## Regra de escala cautelosa

- ativacao e primeira resposta sao pre-requisitos para qualquer aumento
- billing, webhook e suporte precisam estar estaveis
- custo da IA precisa ser revisado diariamente
- qualquer sinal critico exige pausa ou reducao antes de novo teste

## Regra pos-escala

- Manter escala cautelosa apenas se `docs/cautious-scale-analysis.md` tiver dados agregados suficientes e sem P0/P1.
- Reduzir orcamento se custo subir, ativacao cair, suporte aumentar ou IA consumir sem conversao.
- Pausar se checkout, webhook, IA, auth, tracking ou privacidade falhar.
- Preparar versao 1.1 somente depois de consolidar estabilidade, docs e pendencias P0/P1.

## Regra da campanha pequena pos-1.2

- Comecar pequena e monitorar diariamente.
- Pausar por bug critico ou falha de IA, auth, checkout, webhook, tracking, suporte ou privacidade.
- Nao escalar antes de 72h de dados agregados.
- Nao escalar sem primeira resposta, com billing instavel ou custo de IA instavel.
