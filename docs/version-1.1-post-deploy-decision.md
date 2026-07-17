# Decisão Pós-Deploy — Versão 1.1 AtendeZap IA

## Decisão

* **repetir validação**
* manter operação controlada: somente interna/limitada, sem tratar a 1.1 como validada em produção
* corrigir bugs e continuar: não aplicável sem bug P0/P1 comprovado
* fazer rollback: não aplicável; não há incidente nem deploy documentado que sustente rollback
* preparar campanha pequena: não aprovado
* planejar versão 1.2: não aprovado nesta análise; faltam dados pós-deploy suficientes

## Motivos

* Smoke tests de Preview e Production estão sem URL, checklist, resultado e decisão.
* Relatório de deploy não registra ambiente, execução ou aprovação.
* A janela real de 72 horas e todas as métricas operacionais estão ausentes.
* A validação local não substitui Vercel, Supabase/RLS, Stripe, OpenAI e CI reais.

## Evidências

* Fechamento da 1.1: aprovado com observações apenas para operação controlada.
* Auditorias locais: nenhum P0/P1 crítico confirmado; build, testes, segurança, billing e RLS estático documentados.
* Relatório pós-release disponível cobre somente 2 de junho de 2026 e marca dados reais como insuficientes.
* Relatórios e templates de go-live permanecem sem dados agregados preenchidos.

## Bloqueadores

* GitHub Actions remoto não confirmado.
* Preview e Production sem smoke test comprovado.
* Migrations e RLS real com dois usuários não confirmados.
* Checkout, portal e webhook assinado no ambiente final não confirmados.
* OpenAI, suporte, feedback, admin e logs reais sem evidência.
* Métricas e custo OpenAI das 72 horas não disponíveis.

## Bugs P0

* Nenhum confirmado.

## Bugs P1

* Nenhum bug confirmado.
* As pendências acima são bloqueadores operacionais de validação, não bugs comprovados.

## Pendências aceitas

* Nenhuma pendência é aceita para campanha pequena ou aprovação de produção.
* Durante a repetição controlada, aceitar somente a ausência temporária de volume, desde que saúde, segurança, billing e tracking sejam comprovados.

## Riscos conhecidos

* Configuração real divergente do ambiente local.
* RLS ou migrations não aplicados no banco final.
* Checkout/webhook ou OpenAI falharem apenas no ambiente real.
* Dados ausentes ocultarem erros recorrentes, suporte alto ou custo anormal.
* Decisão prematura baseada em ausência de evidência.

## Próximo passo recomendado

* Confirmar CI remoto e executar o fluxo Preview → smoke autenticado → Production → smoke autenticado.
* Validar RLS com dois usuários, Stripe assinado, OpenAI, suporte, feedback e admin.
* Registrar início/fim e preencher três relatórios diários com dados agregados seguros.
* Reavaliar após 72 horas completas; somente então decidir entre manter operação, corrigir, campanha pequena ou planejar a 1.2.
