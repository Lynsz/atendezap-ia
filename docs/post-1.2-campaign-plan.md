# Campanha Pos-1.2 - AtendeZap IA

## Objetivo

Rodar campanha pequena apos validar a versao 1.2.

## Condicoes para ativar

- versao 1.2 validada
- smoke test pos-deploy aprovado
- primeiras verificacoes das 72h pos-release sem P0/P1
- sem bugs P0/P1
- checkout funcionando
- IA funcionando
- tracking confiavel
- custo da IA controlado
- suporte preparado
- orcamento pequeno definido

## Nichos candidatos

- estetica
- delivery
- prestador de servico
- autonomo
- loja

## Rotas candidatas

- pagina por nicho
- demo
- ebook
- pricing

## Metricas

- visitantes
- leads
- cadastros
- onboarding
- primeira resposta
- checkout
- assinatura

## Criterios de pausa

- falha de checkout ou webhook
- falha de IA para multiplos usuarios
- tracking principal quebrado
- custo de IA subindo sem ativacao
- suporte com bug critico recorrente
- qualquer exposicao de dados

## Campanha pequena pos-Sprint 3

Status inicial: Sem dados suficientes.

Hipotese: paginas por nicho com CTA claro para demo, cadastro e planos devem gerar sinais melhores de conversao sem aumentar escopo do produto.

Rotas iniciais:

- `/para/delivery`
- `/para/estetica`
- `/para/prestadores-de-servico`
- `/demo`
- `/ebook`
- `/precos`

Eventos principais:

- `niche_to_demo_click`
- `niche_to_signup_click`
- `niche_to_pricing_click`
- `demo_to_signup_click`
- `demo_to_pricing_click`
- `ebook_to_signup_click`
- `ebook_to_pricing_click`
- `plan_cta_click`
- `checkout_started`
- `checkout_failed`

Regra de decisao: manter campanha pequena ate haver dados agregados de pricing, cliques de plano, checkout, assinatura, primeira resposta e suporte. Nao escalar com checkout, IA, tracking ou suporte instavel.

## Regras pos-1.2 final

- So ativar campanha apos deploy controlado e smoke test aprovado.
- So ativar campanha se a versao 1.2 estiver estavel nas primeiras verificacoes operacionais.
- Pausar imediatamente se IA, checkout, webhook, portal Stripe, tracking ou suporte falhar.
- Acompanhar as primeiras 72h apos release antes de qualquer nova decisao.
- Usar orcamento pequeno e manter `Sem dados suficientes` como conclusao ate haver amostra real.

## Aprovacao pos-deploy controlado

- A campanha so pode ser ativada apos a versao 1.2 estar aprovada em producao.
- Preencher `docs/post-1.2-campaign-approval-checklist.md` antes de publicar qualquer anuncio.
- Revisar metricas diariamente nas primeiras 72h.
- Pausar ao primeiro bug P0/P1.
- Nao escalar antes de 72h de dados agregados.
