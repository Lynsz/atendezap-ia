# Backlog da Versao 1.2 - AtendeZap IA

## Correcoes

- Corrigir qualquer P0/P1 real que aparecer em login, cadastro, admin, RLS, billing, IA, suporte ou tracking.
- Validar a correcao de suporte da 1.1 em ambiente real.
- Entregue na Sprint 1: tracking remove e-mail em valores genericos, telefone e WhatsApp.
- Entregue na Sprint 1: testes cobrem limite bloqueando IA, falha da IA sem persistir uso e health check sem dados sensiveis.

## Ativacao

- Medir cadastro para onboarding e onboarding para primeira resposta.
- Melhorar exemplos iniciais por nicho se houver queda comprovada.
- Reforcar que a resposta deve ser revisada, copiada e enviada manualmente.

## Retencao

- Acompanhar retorno em 7 dias.
- Incentivar salvamento e favoritos sem criar CRM.
- Revisar templates recomendados com base em uso agregado.

## Conversao

- Medir demo para cadastro, primeira resposta para pricing e pricing para checkout.
- Melhorar CTA pos-demo apenas se houver uso sem cadastro/conversao.
- Revisar copy de pricing se houver duvida recorrente.

## Billing

- Validar checkout, portal, webhook, status de assinatura, pagamento falho e cancelamento em staging/producao.
- Manter Stripe como fonte de verdade financeira.
- Nao salvar dados de cartao.
- Revisado na Sprint 1: checkout, portal, webhook, idempotencia, status e pagamentos falhos sem P0/P1 local encontrado.

## IA

- Monitorar falhas, limites, usuarios perto do limite e custo agregado.
- Ajustar prompt/templates apenas com feedback agregado recorrente.
- Manter OpenAI server-side.
- Revisado na Sprint 1: limite antes da IA, uso apos persistencia e falha sem consumo.

## Campanhas

- Manter campanha pequena ate dados suficientes.
- Registrar resultados agregados por nicho, canal, pagina e CTA.
- Testar uma variacao por vez.

## Suporte

- Agrupar duvidas recorrentes sem expor mensagem completa.
- Melhorar FAQ/copy para WhatsApp automatico, onboarding, pricing e billing se houver recorrencia.

## Operacao

- Validar Supabase RLS com dois usuarios reais.
- Validar health check, logs, tracking seguro e admin no ambiente final.
- Atualizar auditoria, prontidao e release notes durante a execucao.
- Sprint 1 concluida com pendencias externas em `docs/version-1.2-sprint-1-report.md`.

## Sprint 2

- Melhorar ativacao e retencao somente com base em dados agregados.
- Medir cadastro para onboarding, onboarding para primeira resposta e primeira resposta para copia/salvamento.
- Revisar exemplos por nicho e templates recomendados se houver gargalo comprovado.

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile
