# Execucao da Campanha Pos-1.2 - AtendeZap IA

## Objetivo

Rodar uma campanha pequena apos a versao 1.2 para validar ativacao, conversao e estabilidade com trafego real.

## Status

- [ ] planejada
- [ ] pronta para ativar
- [ ] ativa
- [ ] pausada
- [ ] concluida
- [x] bloqueada

Motivo: faltam evidencias reais preenchidas de producao, monitoramento inicial e aprovacao do checklist final. Nao ativar enquanto `docs/post-1.2-campaign-decision-matrix.md` mantiver a decisao bloqueada.

## Hipotese

- Uma pagina especifica para delivery, com CTA principal para a demo, pode gerar sinais iniciais de ativacao sem ampliar o escopo do produto.

## Nicho

- delivery, como hipotese inicial; nao e nicho vencedor.

## Canal

- Meta Ads, com entrada e acompanhamento manual. Nao ha integracao direta.

## Pagina de destino

- `/para/delivery`

## CTA principal

- `Testar demo gratis`

## Criativo

- Uma variacao simples focada em responder duvidas repetidas de delivery. Copy final pendente de aprovacao antes da ativacao.

## UTM principal

- `/para/delivery?utm_source=meta&utm_medium=paid_social&utm_campaign=post_12_campaign_01&utm_content=delivery_criativo_01`

## Orcamento

- Pequeno e fixo, valor pendente de aprovacao operacional. Nao aumentar nesta etapa.

## Duracao prevista

- Primeiras 72h, com revisao diaria e pausa imediata por bloqueador.

## Metricas principais

- visitantes
- leads
- cadastros
- onboardings
- primeiras respostas
- respostas salvas
- pricing views
- checkouts
- assinaturas
- suporte aberto
- custo da IA
- bugs criticos

## Criterio para continuar

- Produto, IA, billing, suporte e tracking estaveis; usuarios avancando ate onboarding e primeira resposta; nenhum P0/P1; custo sob controle.

## Criterio para pausar

- Qualquer item de `docs/post-1.2-campaign-pause-checklist.md`, incluindo falha de checkout, webhook, IA, auth, tracking, privacidade ou suporte critico.

## Criterio para ajustar

- Gargalo claro sem falha critica: muitos visitantes e poucos leads, leads sem cadastro, cadastro sem onboarding, onboarding sem primeira resposta ou uso sem checkout.

## Registro manual no admin

Criar somente depois da liberacao operacional:

- nome: `Campanha pequena pos-1.2 - delivery`
- status inicial: `planned`
- decision inicial: `inconclusive`
- canal: `Meta Ads`
- nicho: `delivery`
- UTM: `post_12_campaign_01`
- destino: `/para/delivery`
- CTA: `Testar demo gratis`
- objetivo: validar ativacao, conversao e estabilidade
- notas: hipotese planejada, orcamento aprovado e guardrails; sem dados pessoais

