# Matriz de Testes de Anuncios - AtendeZap IA

## Objetivo

Comparar variacoes pequenas de nicho, criativo, CTA e destino sem criar automacao de campanha.

## Variacoes atuais

| Campanha | Nicho | Canal | Destino | Criativo | CTA | Status |
|---|---|---|---|---|---|---|
| campanha pequena otimizada | delivery | Meta Ads | `/para/delivery` | pergunta repetida | Testar uma resposta gratis | Sem dados suficientes |
| campanha pequena otimizada | estetica | Meta Ads | `/para/estetica` | agendamento e objecao | Ver resposta de exemplo | Sem dados suficientes |
| campanha pequena otimizada | delivery | Meta Ads | `/demo` | antes/depois de resposta | Criar conta | Sem dados suficientes |

## Metricas por variacao

- visitantes
- cliques
- leads
- cadastros
- onboardings
- primeiras respostas
- respostas copiadas ou salvas
- checkouts
- assinaturas
- custo agregado

## Regras

- Nao comparar variacoes sem amostra minima.
- Nao usar dados pessoais, respostas completas, emails, telefones ou dados de pagamento.
- Nao escalar se tracking, onboarding, checkout, webhook, IA ou suporte estiverem instaveis.
- Se a conclusao for `Sem dados suficientes`, repetir pequena variacao ou pausar.
