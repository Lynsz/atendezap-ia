# Monitoramento Pos-Release - Versao 1.2

## Primeiras 24 horas

Verificar:

- health check
- logs Vercel
- Supabase Auth
- erros de API
- geracao de IA
- uso da demo
- limite mensal
- Stripe checkout
- Stripe webhook
- Resend
- suporte
- feedbacks
- admin
- tracking

## Primeiras 72 horas

Verificar:

- novos usuarios
- onboarding
- primeira resposta
- respostas salvas
- templates usados
- visitas em pricing
- checkouts
- assinaturas
- falhas de IA
- falhas Stripe
- solicitacoes de suporte
- custo da OpenAI
- erros recorrentes

## Sinais de alerta

- usuarios nao geram primeira resposta
- checkout nao inicia
- webhook nao atualiza plano
- IA falha para multiplos usuarios
- suporte recebe bugs criticos
- custo da IA sobe rapido
- tracking quebra

## Acoes

- manter operacao
- corrigir bug
- pausar campanha
- aplicar rollback
- bloquear proxima campanha
- liberar campanha pequena

## Guardrail

Nao ativar campanha pos-1.2 antes de smoke test aprovado e sem monitoramento minimo das primeiras verificacoes.

## Pos-deploy 1.2

Usar tambem:

- `docs/version-1.2-post-deploy-analysis.md`
- `docs/version-1.2-stability-diagnosis.md`
- `docs/version-1.2-post-deploy-fix-plan.md`
- `docs/post-1.2-final-campaign-launch-checklist.md`
- `docs/post-1.2-campaign-operations.md`

Enquanto o relatorio pos-release nao tiver dados agregados reais, a decisao permanece: campanha bloqueada e producao em observacao.
