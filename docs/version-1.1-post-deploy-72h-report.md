# Relatório 72h Pós-Deploy — Versão 1.1 AtendeZap IA

## Status geral

* **bloqueado para aprovação pós-deploy e campanha pequena por falta de evidência operacional preenchida**
* saudável: não comprovado em Preview ou Production
* atenção: validações locais foram aprovadas com observações
* rollback realizado: não há registro de rollback

## Ambiente

* preview: não disponível; URL, resultado e checklist do smoke test não foram preenchidos
* production: não disponível; URL, resultado e checklist do smoke test não foram preenchidos

## Período analisado

* janela real de 72 horas: não disponível; início e fim não foram registrados
* referência documental disponível: relatório pós-release de 2 de junho de 2026, limitado a um único dia e com métricas marcadas como insuficientes

## Saúde técnica

* `/api/health`: contrato seguro confirmado por teste local; resultado em Preview/Production não disponível
* erros 500: não medido em Preview/Production
* falhas críticas: nenhuma confirmada nos documentos e testes locais; dados de produção não disponíveis
* CI: validações locais serão reexecutadas nesta análise; GitHub Actions remoto não confirmado
* build: documentado como aprovado localmente no fechamento da 1.1; validação atual registrada ao final desta etapa

## Produto

* cadastros: não disponível
* onboardings: não disponível
* respostas geradas: não disponível
* respostas copiadas: não disponível
* respostas salvas: não disponível
* templates usados: não disponível
* feedbacks: não disponível
* suportes: não disponível

## Billing

* acessos à assinatura: não disponível
* checkouts iniciados: não disponível
* assinaturas concluídas: não disponível
* webhooks recebidos: não disponível
* falhas Stripe: não disponível em Preview/Production; nenhuma falha confirmada pelos testes locais documentados

## IA

* falhas OpenAI: não disponível em Preview/Production
* limites atingidos: não disponível
* custo estimado: não calculável sem custo do painel OpenAI e volume de respostas no mesmo período
* feedbacks negativos sobre resposta: não disponível

## Segurança

* incidentes: nenhum confirmado na auditoria local; dados operacionais de produção não disponíveis
* tentativas de acesso admin: não medido
* vazamento de dados: nenhum confirmado na auditoria local; não verificado no ambiente real
* vazamento de secrets: nenhum confirmado pelo scanner local; não verificado no bundle/deploy real
* eventos com dados sensíveis: testes locais confirmam sanitização; auditoria dos eventos reais não disponível

## Bugs P0

* Nenhum P0 confirmado nas fontes revisadas.

## Bugs P1

* Nenhum bug P1 confirmado nas fontes revisadas.
* Pendências operacionais de validação não são classificadas como bugs: smoke real, RLS com dois usuários, Stripe assinado, OpenAI, suporte, feedback e CI remoto.

## Bugs P2

* Nenhum bug P2 confirmado por dados das primeiras 72 horas.
* Risco técnico conhecido: `supabase/schema.sql` foi documentado como desatualizado em relação às migrations incrementais.

## Conclusão

* Não é possível afirmar que as primeiras 72 horas foram saudáveis, porque a janela, os ambientes e as métricas não foram registrados.
* Não há evidência para rollback e não há P0/P1 comprovado; a validação local sustenta apenas operação interna/controlada com observações.
* A aprovação pós-deploy, a campanha pequena e o planejamento detalhado da 1.2 permanecem bloqueados até repetir o smoke real, confirmar CI e consolidar 72 horas de dados agregados.

## Base de evidências

* `docs/version-1.1-preview-smoke-test.md`
* `docs/version-1.1-production-smoke-test.md`
* `docs/version-1.1-deploy-report.md`
* `docs/version-1.1-final-report.md`
* `docs/post-1.1-release-report.md`
* `docs/post-go-live-72h-report.md`
* `docs/security-final-validation-report.md`
* `docs/stripe-billing-validation-report.md`
* `docs/supabase-rls-validation-report.md`
