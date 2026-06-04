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

- Entregue: plano e relatorio da Sprint 2 em `docs/version-1.2-sprint-2-plan.md` e `docs/version-1.2-sprint-2-report.md`.
- Entregue: dashboard inicial revisado para orientar a primeira resposta.
- Entregue: checklist de ativacao revisado com onboarding, primeira resposta, copia, salvamento, templates, favoritos e planos.
- Entregue: exemplos por nicho revisados para delivery, estetica, assistencia tecnica, loja, restaurante, prestador de servico e autonomo.
- Entregue: templates recomendados e favoritas mantidos no dashboard.
- Entregue: metricas/admin de ativacao revisadas com cards agregados e diagnostico simples.
- Pendente: validar ativacao real em staging/producao e mobile antes de nova campanha.

## Sprint 3

- Entregue: pricing, FAQ, CTAs pos-demo, pos-primeira resposta, paginas por nicho, eventos seguros de conversao e admin Conversao.
- Entregue: campanha pequena pos-Sprint 3 planejada com UTMs e criterios de pausa.
- Manter P1: validacao real de Stripe, Supabase RLS, OpenAI, Resend, tracking, admin e health check.

## Sprint 4

- Entregue: QA final, checklist de deploy, smoke test, release notes finais, changelog, auditoria, prontidao e relatorio final da 1.2.
- Status: versao 1.2 aprovada com observacoes para deploy controlado.
- P1 para versao 1.3: validar provedores reais, RLS, billing e tracking no ambiente final.
- P2 para versao 1.3: melhorar ativacao, conversao, mobile, templates e custo de IA somente com dados agregados.
- P3 futuro: planos anuais, novos nichos e metricas internas de custo por resposta.

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile

## Pendencias movidas para versao 1.3

- P1: validacao real de Stripe, Supabase RLS, OpenAI, Resend, tracking, admin e health check.
- P1: corrigir qualquer P0/P1 revelado por staging/producao.
- P2: refinar exemplos, templates, pricing ou CTAs somente com dados reais.
- P2: revisar UX mobile se smoke visual indicar problema.
- P3: novos nichos, planos anuais e metricas internas de custo detalhadas.
