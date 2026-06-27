# Plano de Correcao Pos-Lancamento Pequeno - AtendeZap IA

## Correcoes concluidas

* Analise pos-lancamento pequeno criada sem inventar metricas.
* Diagnostico do funil criado com gargalo principal em dados reais ausentes.
* Bugs classificados em P0/P1/P2.
* Copy de configuracoes ajustada para evitar expectativa de automacao do produto.
* Decisao pos-lancamento registrada como repetir rodada pequena.

## Correcoes pendentes

* Rodar smoke autenticado em Preview/Producao.
* Validar Supabase Auth e RLS com dois usuarios reais.
* Validar OpenAI real com limite mensal antes da chamada.
* Validar Stripe checkout teste, portal e webhook assinado.
* Preencher metricas reais do funil em `docs/small-launch-live-tracking.md`.
* Corrigir qualquer P0/P1 que aparecer no smoke real ou na proxima rodada.

## Nao sera feito agora

* Integracao direta com WhatsApp.
* Envio automatico de mensagens.
* CRM completo.
* Automacoes complexas.
* Redesign completo.
* App mobile.
* Alteracao grande de prompt sem feedback real.
* Expansao grande de templates sem uso real por nicho.

## Riscos

* Ambiente local passar, mas Preview/Producao falhar por secrets, RLS, Stripe ou OpenAI.
* Falta de metricas ocultar gargalos de ativacao.
* Billing real ficar inconsistente sem webhook assinado validado.
* RLS nao aplicada no banco real.

## Validacao necessaria

* `npm run check:secrets`
* `npm run lint`
* `npm run typecheck`
* `npm run build`
* `npm test`
* `npm run validate`
* Smoke manual autenticado em Preview/Producao:
  * landing
  * cadastro
  * login
  * onboarding
  * dashboard
  * IA
  * copiar resposta
  * salvar resposta
  * biblioteca
  * templates
  * assinatura
  * checkout teste
  * suporte
  * feedback
  * admin bloqueando usuario comum
  * `/api/health`

## Proxima etapa recomendada

* Repetir rodada pequena somente depois de smoke real aprovado e sem P0/P1 aberto.
