# Smoke Test Final do MVP - AtendeZap IA

## Status

* bloqueado

## Ambiente testado

* local

## URL testada

* ambiente local em validacoes anteriores; Preview/Production nao foram testados nesta etapa por falta de URL e credenciais de teste reais

## Testes publicos

* [x] landing abre em smoke local
* [x] cadastro abre em smoke local
* [x] login abre em smoke local
* [x] demo funciona com fallback controlado quando OpenAI nao esta configurada
* [x] termos abre em smoke local
* [x] privacidade abre em smoke local
* [x] suporte abre em smoke local
* [x] `/api/health` retorna ok e nao expoe secrets

## Testes autenticados

* [ ] cadastro funciona em Preview/Producao
* [ ] login funciona em Preview/Producao
* [ ] logout funciona em Preview/Producao
* [ ] onboarding funciona em Preview/Producao
* [ ] dashboard abre em Preview/Producao
* [ ] IA gera resposta em Preview/Producao
* [ ] copiar funciona em Preview/Producao
* [ ] salvar funciona em Preview/Producao
* [ ] biblioteca abre em Preview/Producao
* [ ] editar resposta funciona em Preview/Producao
* [ ] favoritar funciona em Preview/Producao
* [ ] excluir funciona em Preview/Producao
* [ ] templates funcionam em Preview/Producao
* [ ] assinatura abre em Preview/Producao
* [ ] checkout teste abre em Preview/Producao
* [ ] feedback funciona em Preview/Producao
* [ ] suporte funciona em Preview/Producao

## Testes de seguranca

* [x] dashboard bloqueia deslogado em smoke local
* [x] admin bloqueia usuario comum por codigo e testes
* [ ] usuario comum nao ve dados de outro usuario no Supabase real
* [x] erro nao mostra stack trace nos fluxos auditados
* [x] nenhum secret aparece no client pela auditoria local
* [x] eventos nao salvam dados sensiveis por testes e sanitizacao

## Bugs encontrados

* Pagina `/status` expunha estado de configuracao de provedores, sem valores; ajustada para nao consultar nem publicar configuracao de Supabase, OpenAI ou Stripe.

## Correcoes aplicadas

* `/status` agora mostra apenas estado geral do app e orienta validacao detalhada por checklist/logs restritos.
* Teste de prontidao reforcado para garantir que `/status` nao referencia `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY` ou `STRIPE_WEBHOOK_SECRET`.

## Decisao

* Bloquear fechamento final do MVP ate smoke autenticado em Preview/Producao, RLS real com dois usuarios, Stripe checkout teste e webhook assinado estarem validados.
