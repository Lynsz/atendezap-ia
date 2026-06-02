# Versao 1.2 - Sprint 1

## Objetivo

Estabilizar a base tecnica e operacional antes de avancar em ativacao, retencao e campanhas.

## Foco da sprint

- bugs P0/P1
- billing
- webhook Stripe
- status de assinatura
- limite de uso da IA
- rate limit
- logs seguros
- tracking seguro
- validacoes
- documentacao

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile
- funcionalidades grandes

## Itens planejados

- Auditar checkout, portal Stripe, webhook, status de assinatura e pagamentos falhos.
- Auditar geracao de IA autenticada, limite mensal, demo publica e rate limits.
- Auditar tracking para impedir envio de e-mail, telefone, pergunta, resposta, tokens, secrets ou dados de pagamento.
- Auditar logs server-side, eventos internos e health check.
- Auditar admin operacional e rotas privadas com cobertura existente.
- Corrigir P0/P1 claros e seguros encontrados na sprint.
- Atualizar docs de billing, IA/custos, logs, backlog, release notes, auditoria e prontidao.
- Rodar `npm run validate` e `npm run test:e2e`.

## Criterio de sucesso

- sem bugs P0 conhecidos
- sem bugs P1 graves conhecidos
- checkout funcionando
- webhook funcionando
- IA funcionando
- limite funcionando
- tracking seguro
- npm run validate passando

