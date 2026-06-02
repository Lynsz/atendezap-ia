# Backlog da Versao 1.2 - AtendeZap IA

## Correcoes

- Corrigir qualquer P0/P1 real que aparecer em login, cadastro, admin, RLS, billing, IA, suporte ou tracking.
- Validar a correcao de suporte da 1.1 em ambiente real.

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

## IA

- Monitorar falhas, limites, usuarios perto do limite e custo agregado.
- Ajustar prompt/templates apenas com feedback agregado recorrente.
- Manter OpenAI server-side.

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

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile

