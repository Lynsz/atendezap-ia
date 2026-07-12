# Smoke Test - Sprint 4 Versao 1.1

## Status

* aprovado com observacoes

## Billing

* [x] pagina de assinatura abre
* [x] plano atual aparece
* [x] uso mensal aparece
* [x] limite mensal aparece
* [x] Pro R$ 29 aparece
* [ ] checkout teste abre em ambiente final
* [x] retorno success funciona localmente
* [x] retorno cancel funciona localmente
* [ ] portal abre quando ha customer em ambiente final
* [x] erro amigavel quando nao ha customer

## Stripe

* [x] checkout valida planId
* [x] checkout nao aceita preco do client
* [x] webhook valida assinatura
* [x] webhook atualiza subscriptions
* [x] dados de cartao nao sao salvos
* [ ] webhook assinado validado no ambiente final

## Operacao

* [x] suporte funciona localmente
* [x] feedback funciona localmente
* [x] admin bloqueia usuario comum
* [x] admin mostra agregados seguros
* [x] eventos nao salvam dados sensiveis
* [x] limites mensais funcionam localmente

## Bugs encontrados

* Eventos operacionais da Sprint 4 nao estavam todos na allowlist segura.
* Portal usava evento client-side legado `stripe_portal_opened` sem o evento operacional `billing_portal_opened`.
* Admin overview devolvia texto livre de suporte e feedback no resumo operacional.
* Categorias principais de suporte ainda nao refletiam todas as categorias sugeridas para Sprint 4.

## Correcoes aplicadas

* Eventos Sprint 4 adicionados em analytics, tracking e migration.
* Webhook registra `stripe_webhook_received` e checkout concluido sem payload completo.
* Aviso de uso OpenAI acima de 80% registra `openai_usage_warning`.
* Admin overview e update de suporte passaram a ocultar texto livre completo.
* Categorias de suporte foram alinhadas ao escopo operacional.

## Pendencias

* Smoke real em Preview/Producao.
* RLS real com dois usuarios.
* Stripe checkout/portal/webhook assinado no ambiente final.
* Dados reais de metricas e custo OpenAI.

## Decisao

* Sprint 4 aprovada localmente com observacoes.
* A versao 1.1 fica pronta para fechamento apenas depois das validacoes reais pendentes.
