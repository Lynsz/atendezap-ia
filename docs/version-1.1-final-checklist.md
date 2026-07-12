# Checklist Final - Versao 1.1 AtendeZap IA

## CI e qualidade

* [x] check:secrets passando localmente
* [x] lint passando localmente
* [x] typecheck passando localmente
* [x] build passando localmente
* [x] testes passando localmente
* [ ] GitHub Actions verde confirmado visualmente
* [x] Node.js 24 no CI

## Seguranca

* [ ] repositorio privado confirmado no GitHub
* [x] `.env.local` fora do Git
* [x] nenhum secret real no codigo pela auditoria local
* [x] nenhum secret real em docs pela auditoria local
* [x] nenhum secret real em workflows pela auditoria local
* [x] OpenAI key apenas server-side
* [x] Stripe secret apenas server-side
* [x] Supabase service role apenas server-side
* [ ] RLS validado no Supabase real
* [x] admin protegido por `requireAdmin` e `ADMIN_EMAILS`
* [x] logs seguros
* [x] eventos sem dados sensiveis por testes e sanitizacao

## Produto

* [x] landing funcionando localmente
* [x] cadastro coberto por fluxo/testes locais
* [x] login coberto por fluxo/testes locais
* [x] logout presente no fluxo autenticado
* [x] onboarding funcionando localmente
* [x] dashboard funcionando localmente
* [x] primeira resposta coberta por testes locais
* [x] copiar resposta coberto por fluxo/testes locais
* [x] salvar resposta coberto por testes locais
* [x] templates funcionando localmente
* [x] biblioteca funcionando localmente
* [x] favoritos cobertos por testes locais
* [x] assinatura funcionando localmente
* [x] suporte funcionando localmente
* [x] feedback funcionando localmente
* [x] admin funcionando e protegido localmente

## IA

* [x] prompt revisado
* [x] contexto do negocio usado
* [x] resposta curta e natural
* [x] nao inventa preco
* [x] nao inventa prazo
* [x] nao inventa estoque
* [x] nao inventa entrega
* [x] nao inventa agenda
* [x] limite mensal validado antes da OpenAI
* [x] falha nao consome uso
* [x] sucesso incrementa uso

## Billing

* [x] planos configurados
* [x] Pro R$ 29 explicado
* [x] limites por plano funcionando localmente
* [x] checkout seguro por testes locais
* [x] portal seguro por testes locais
* [x] webhook seguro por testes locais
* [x] dados de cartao nao salvos

## Operacao

* [x] `/api/health` seguro
* [x] suporte operacional
* [x] metricas seguras
* [x] custo OpenAI monitoravel
* [x] rollback documentado em docs operacionais existentes
* [x] smoke test final aprovado localmente com observacoes

## Decisao

* [ ] versao 1.1 aprovada
* [x] versao 1.1 aprovada com observacoes
* [ ] versao 1.1 bloqueada

## Observacoes

* Smoke autenticado em Preview/Producao segue pendente.
* RLS com dois usuarios reais segue pendente.
* Stripe checkout, portal e webhook assinado seguem pendentes no ambiente final.
* GitHub Actions precisa de confirmacao visual no GitHub.
* Metricas reais seguem `nao medido` ou `nao disponivel`.
