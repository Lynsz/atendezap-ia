# WhatsApp — Relatório da Fase 3

## Implementado

- Migration `add_whatsapp_phase_3_idempotency.sql` com eventos, tentativas, auditoria, templates, índices, RLS e grants explícitos.
- Parser unificado para inbound e status, preservando a API anterior de inbound.
- Aquisição idempotente antes de qualquer mutação de negócio; duplicatas recebem `ignored_duplicate` e contador.
- Reprocessamento de evento falho limitado a três aquisições.
- Status do provedor persistidos com proteção contra regressão.
- Envio de texto e template protegido por request ID, fingerprint recente e limites em camadas.
- Retry interno de uma única vez para erros transitórios, com timeout de dez segundos por chamada.
- Erros seguros `provider_rate_limited`, `provider_transient`, `provider_authentication`, `recipient_unavailable`, `template_not_available` e `provider_rejected`.
- Dashboard com templates aprovados, opt-in, confirmação manual, motivo seguro e retry condicional.
- Admin somente com contagens agregadas.
- Scanner atualizado para detectar futura exposição de `INTERNAL_JOB_SECRET`.

## Segurança preservada

- A API recebe `conversationId`, nunca telefone escolhido pelo client.
- `user_id` sempre vem da sessão.
- `WHATSAPP_ACCESS_TOKEN`, App Secret e service role permanecem server-only.
- Variáveis de template não são gravadas em tentativas, auditoria, logs ou analytics.
- O webhook não salva payload bruto nem dispara resposta.
- Não existe envio em massa, campanha, cron, worker de disparo ou WhatsApp Web não oficial.

## Validação local

- `npm run validate`: aprovado.
- Scanner de secrets, lint, TypeScript e build de produção: aprovados.
- Vitest: 72 arquivos e 316 testes aprovados.

## Pendência operacional real

A CLI do Supabase não está instalada no ambiente local. A migration foi criada e revisada, mas não aplicada a um projeto remoto. O recurso não deve ser habilitado em produção antes da aplicação da migration e do smoke test controlado.
