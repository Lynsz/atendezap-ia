# Plano de Campanhas por Nicho - AtendeZap IA

## Objetivo

Testar qual nicho entende mais rapido o valor do produto.

## Nichos testados

- delivery
- estetica
- assistencia tecnica
- loja
- restaurante
- prestador de servico
- autonomo

## Metricas

- visitantes
- cliques em demo
- cliques em cadastro
- leads
- cadastros
- onboarding
- primeira resposta
- checkout
- assinatura

## Criterio para continuar

- visitantes clicam em CTA
- usuarios criam conta
- usuarios geram primeira resposta
- custo por lead/cadastro aceitavel
- feedbacks corrigiveis

## Criterio para pausar

- muitos cliques sem cadastro
- ninguem gera resposta
- feedback indica confusao
- custo alto sem sinal de interesse
- bug critico

## Leitura dos dados

- Use GA4/Meta Ads para visitantes, CTR e custo por variacao.
- Use UTMs preservadas para comparar leads, checkout e assinatura no admin.
- O app nao deve receber conteudo de perguntas/respostas em analytics.
- Eventos de nicho devem enviar apenas `niche`, `cta`, `source` e indices seguros.
- Para a campanha otimizada, compare `delivery` e `estetica` em `docs/optimized-campaign-analysis.md` e `docs/campaign-comparison-report.md`.
- Nao declarar nicho vencedor se a conclusao for `Sem dados suficientes`.

## Limites de escopo

- Nao criar integracao com WhatsApp.
- Nao dizer que mensagens sao enviadas automaticamente.
- Nao criar CRM ou automacao complexa.
- Nao mudar planos ou cobranca fora do fluxo Stripe.
