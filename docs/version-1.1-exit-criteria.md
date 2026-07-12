# Criterios de Saida da Versao 1.1 - AtendeZap IA

## Status possiveis

- `aprovada`: todos os P1 obrigatorios fechados e validacoes passando.
- `aprovada com observacoes`: sem P0/P1 grave, mas ainda com pendencias de baixo risco documentadas.
- `bloqueada`: qualquer P0 aberto ou P1 grave sem mitigacao.

## Criterios obrigatorios

- Nenhum P0 aberto.
- Nenhum P1 grave aberto sem plano de mitigacao.
- Smoke autenticado em Preview/Producao concluido ou bloqueio documentado.
- RLS validado com dois usuarios reais ou bloqueio documentado.
- Stripe Checkout, Customer Portal e webhook assinados validados ou bloqueio documentado.
- OpenAI e Resend validados no ambiente final ou bloqueio documentado.
- Funil minimo de ativacao medido ou marcado como `nao medido` com plano de coleta.
- Suporte categorizado ou marcado como `nao disponivel` com plano de coleta.
- Custo OpenAI monitorado ou marcado como `nao medido` com fonte definida.
- Documentacao, README e CHANGELOG atualizados.
- Checklist final da 1.1 criado e preenchido com evidencia real ou bloqueio explicito.
- Sprint 4 documentada como concluida localmente com observacoes.

## Validacoes obrigatorias

- `npm run check:secrets`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run validate`

## Criterios de bloqueio

- Secret versionado ou exposto no client.
- `OPENAI_API_KEY` usada no client.
- `SUPABASE_SERVICE_ROLE_KEY` usada no client.
- Evento com pergunta completa, resposta completa, e-mail, telefone, token, secret ou dado de pagamento.
- Falha de checkout/webhook sem mitigacao.
- Falha de RLS ou vazamento entre usuarios.
- IA indisponivel para usuarios reais sem fallback operacional.
- Promessa de WhatsApp automatico, CRM completo ou integracao direta fora do escopo.

## Pendencias conhecidas apos Sprint 4

- Smoke autenticado em Preview/Producao ainda precisa ser executado.
- RLS real com dois usuarios ainda precisa ser validado.
- Stripe Checkout, Customer Portal e webhook assinado ainda precisam de validacao no ambiente final.
- Migrations pendentes precisam ser aplicadas no Supabase real.
- Metricas reais de ativacao, suporte, billing, feedback e custo OpenAI ainda precisam ser consolidadas.
