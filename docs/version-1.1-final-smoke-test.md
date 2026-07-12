# Smoke Test Final - Versao 1.1 AtendeZap IA

## Status

* aprovado com observacoes

## Ambiente testado

* local

## URL testada

* `http://localhost:3000` como referencia local; validacao automatizada executada por build e testes.

## Publico

* [x] landing abre no build
* [x] cadastro abre no build
* [x] login abre no build
* [x] demo funciona com fallback controlado quando aplicavel
* [x] termos abre no build
* [x] privacidade abre no build
* [x] suporte abre no build
* [x] `/api/health` retorna contrato seguro por teste

## Autenticado

* [x] cadastro funciona por fluxo/teste local
* [x] login funciona por fluxo/teste local
* [x] logout presente no fluxo autenticado
* [x] onboarding funciona por fluxo/teste local
* [x] dashboard abre no build
* [x] IA gera resposta por teste local
* [x] copiar funciona por fluxo/teste local
* [x] salvar funciona por teste local
* [x] biblioteca abre no build
* [x] editar resposta funciona por teste local
* [x] favoritar funciona por teste local
* [x] excluir funciona por teste local
* [x] templates funcionam por testes locais
* [x] assinatura abre no build
* [ ] checkout teste abre em ambiente final
* [x] feedback funciona por teste local
* [x] suporte funciona por teste local

## Seguranca

* [x] dashboard bloqueia deslogado por protecao de rota
* [x] admin bloqueia usuario comum por teste local
* [x] APIs admin bloqueiam usuario comum por teste local
* [ ] usuario comum nao ve dados de outro usuario no Supabase real
* [x] erro nao mostra stack trace em rotas testadas
* [x] nenhum secret aparece no client pela auditoria local
* [x] eventos nao salvam dados sensiveis por teste local

## Bugs encontrados

* Relatorio e smoke test da Sprint 1 nao existem no repositorio.
* Validacoes reais de Preview/Producao, RLS com dois usuarios, Stripe em ambiente final e GitHub Actions visual seguem pendentes.

## Correcoes aplicadas

* Eventos operacionais seguros da Sprint 4 foram adicionados.
* Admin overview passou a ocultar texto livre completo de suporte e feedback.
* Suporte recebeu categorias operacionais principais.
* Documentacao final da 1.1 foi consolidada.

## Decisao

* Versao 1.1 aprovada com observacoes para fechamento documental e operacao controlada.
* Antes de campanha pequena externa, executar smoke real em Preview/Producao, validar RLS real, Stripe real/test mode e GitHub Actions verde.
