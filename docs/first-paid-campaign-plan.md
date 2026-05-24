# Primeira Campanha Paga - AtendeZap IA

## Objetivo

Validar se o publico entende a oferta, entra no funil e demonstra intencao real de usar ou pagar pelo AtendeZap IA.

A campanha inicial deve ser pequena, com baixo orcamento e acompanhamento diario. O objetivo nao e escalar, e sim descobrir onde o funil funciona e onde trava.

## Publico inicial

- autonomos
- prestadores de servico
- pequenos negocios
- estetica
- delivery
- assistencia tecnica
- lojas pequenas
- vendedores pelo WhatsApp

## Canais sugeridos

- Meta Ads
- Instagram
- Facebook
- teste organico com link rastreado, se ainda nao quiser investir

## Rotas para anuncio

- landing principal: `/`
- pagina do ebook: `/ebook`
- demo publica: `/demo`
- pagina de campanha: `/atendimento-whatsapp-ia`

Use uma rota por conjunto de anuncio quando possivel. Misturar landing, ebook e demo no mesmo conjunto dificulta identificar o gargalo.

## Eventos principais

- `landing_view`
- `ebook_view`
- `lead_success`
- `demo_view`
- `demo_response_success`
- `signup_completed`
- `onboarding_completed`
- `first_response_generated`
- `checkout_started`
- `subscription_active`

## Metricas a acompanhar

- visitas
- leads
- custo por lead
- cadastros
- custo por cadastro
- onboarding concluido
- primeira resposta gerada
- checkout iniciado
- assinatura ativa
- feedbacks
- bugs
- origem por UTM
- campanha com melhor desempenho

## Onde medir

- Visitantes, alcance, cliques, CTR, CPC e gasto: Meta Ads, GA4 ou plataforma de anuncios.
- Leads, cadastros, onboarding, primeira resposta, checkout, assinaturas, feedbacks e UTMs: admin do AtendeZap IA.
- Custo por lead, cadastro, checkout e assinatura: calcular manualmente usando gasto da plataforma dividido pelos totais do admin.

## Decisao esperada

Ao final da campanha, decidir:

- continuar
- ajustar oferta/copy/funil
- pausar anuncios
- corrigir produto antes de investir mais

## Analise apos a campanha

Preencha `docs/first-campaign-report.md` com dados reais e use:

- `docs/first-campaign-analysis.md` para consolidar numeros, taxas, gargalos, hipoteses e decisao.
- `docs/funnel-diagnosis.md` para interpretar cada etapa do funil.
- `docs/post-campaign-improvement-plan.md` para priorizar P0/P1 antes de novo trafego.
- `docs/second-campaign-plan.md` para definir uma hipotese clara da segunda rodada.

## Regra de prudencia

Nao aumentar orcamento se houver P0/P1 aberto, tracking quebrado, lead sem salvar, checkout instavel, webhook sem liberar plano ou IA sem gerar resposta.
