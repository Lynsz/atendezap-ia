# Plano de Lancamento Pequeno Controlado - AtendeZap IA

## Objetivo

Validar o MVP com um publico pequeno fora do beta fechado, sem escalar trafego, sem campanha grande e com monitoramento diario.

## Status de prontidao

* Bloqueado ate concluir smoke test autenticado em Preview/Producao.
* Nenhum P0 confirmado nos relatorios finais lidos.
* Nenhum P1 critico confirmado nos relatorios finais lidos.
* A decisao pos-beta atual recomenda repetir/completar beta antes de lancamento pequeno porque faltam metricas reais.
* Os arquivos `docs/post-deploy-smoke-test-report.md` e `docs/production-smoke-test-final.md` nao existem com esses nomes no repositorio; usar `docs/post-deploy-smoke-test.md` e `docs/production-smoke-test.md` como referencias operacionais ate gerar relatorios finais.

## Publico inicial

* autonomos
* MEIs
* pequenos negocios
* pessoas que atendem clientes pelo WhatsApp
* usuarios que possam dar feedback rapido

## Escopo

* divulgar para poucas pessoas
* acompanhar cadastros
* acompanhar onboarding
* acompanhar geracao de respostas
* acompanhar copias e respostas salvas
* acompanhar feedbacks
* acompanhar suporte
* acompanhar acessos a assinatura
* acompanhar checkouts, se houver

## Fora do escopo

* campanha grande
* automacao de WhatsApp
* integracao oficial com WhatsApp
* CRM completo
* app mobile
* escala de trafego
* investimento alto em anuncios

## Criterios para iniciar

* CI verde
* build passando
* smoke test aprovado
* nenhum P0 aberto
* P1 criticos corrigidos ou documentados
* Supabase/RLS validado
* OpenAI validada
* Stripe teste validado
* admin protegido
* suporte funcionando
* feedback funcionando
* seguranca validada

## Criterios de sucesso

* usuarios conseguem criar conta
* usuarios concluem onboarding
* usuarios geram respostas
* usuarios copiam ou salvam respostas
* usuarios entendem que o app nao envia WhatsApp automaticamente
* nenhum bug P0 aparece
* feedbacks indicam utilidade real

## Criterios de pausa

* cadastro quebrado
* login quebrado
* onboarding quebrado
* dashboard quebrado
* IA falhando para multiplos usuarios
* salvar resposta quebrado
* checkout quebrado
* webhook quebrado
* admin acessivel para usuario comum
* vazamento de secret ou dado sensivel
* erro 500 recorrente em rota critica

## Decisao apos lancamento pequeno

* corrigir bugs
* repetir lancamento pequeno
* preparar campanha pequena
* bloquear avanco
* fechar MVP final
