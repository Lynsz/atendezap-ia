# Validacao Supabase e RLS - AtendeZap IA

## Status

Aprovado com observacoes.

Nao foi necessario criar migration nova: as tabelas obrigatorias, indices, triggers e policies RLS exigidas para o MVP ja existem nas migrations incrementais. A validacao foi estatica/local, com testes mockados; a confirmacao final de isolamento ainda deve ser feita no Supabase de staging/producao com dois usuarios reais.

## Tabelas Validadas

Tabelas obrigatorias confirmadas:

- `user_profiles`: criada em `supabase/migrations/0021_create_mvp_core_tables.sql`, com `user_id`, dados do negocio, indice unico por usuario e trigger de `updated_at`.
- `ai_usage`: criada em `supabase/migrations/0021_create_mvp_core_tables.sql`, com `user_id`, `month`, `count`, `limit`, checks de formato/nao-negatividade, indice unico por usuario/mes e trigger de `updated_at`.
- `saved_responses`: criada em `supabase/migrations/0012_saved_responses.sql` e ajustada por migrations posteriores para origem, favoritos, copias e flexibilidade da biblioteca.
- `subscriptions`: criada no schema inicial e reforcada por migrations de Stripe/billing, com leitura pelo usuario e escrita pelo backend/webhooks.

Tabelas auxiliares confirmadas:

- `app_events`: criada em `supabase/migrations/0024_app_events.sql`, com allowlist de eventos/metadados e sem leitura direta por clientes.
- `support_requests`: criada no schema inicial e evoluida em `supabase/migrations/0017_support_requests_workflow.sql`, com fluxo simples de suporte.
- `ai_response_feedback`: criada em `supabase/migrations/0011_ai_response_feedback.sql`, com feedback vinculado ao usuario e a uma resposta do proprio usuario.

Observacao: `supabase/schema.sql` esta atrasado em relacao as migrations incrementais e nao lista todas as tabelas mais recentes, como `user_profiles`, `ai_usage` e `app_events`. As migrations continuam sendo a fonte valida para o deploy, mas o snapshot deve ser regenerado quando o banco real estiver alinhado.

## Policies Validadas

- `user_profiles`: RLS habilitado; select/insert/update/delete usam `auth.uid() = user_id`.
- `ai_usage`: RLS habilitado; usuario autenticado le apenas o proprio uso; insert/update/delete do client sao bloqueados por policies `with check (false)`/`using (false)` e grants somente de `select`.
- `saved_responses`: RLS habilitado; CRUD restrito a `auth.uid() = user_id`; insert/update tambem validam que `response_id`, quando usado, pertence ao mesmo usuario.
- `subscriptions`: RLS habilitado; usuario autenticado le apenas a propria assinatura; grants de client foram reduzidos para `select`; policies antigas de insert/update/delete sao removidas.
- `app_events`: RLS habilitado; client autenticado pode inserir eventos proprios ou anonimos controlados, mas nao consegue selecionar eventos.
- `support_requests`: RLS habilitado; usuario autenticado seleciona e cria apenas chamados proprios; atualizacoes ficam para backend/admin.
- `ai_response_feedback`: RLS habilitado; usuario autenticado seleciona/insere/atualiza feedback proprio e somente para respostas geradas do mesmo usuario.

## Seguranca de Client e Backend

- `src/lib/supabase/browser.ts` usa apenas variaveis `NEXT_PUBLIC_*` e nao importa service role.
- `src/lib/supabase/server.ts` importa `server-only`, valida envs de admin e cria client com service role apenas no backend.
- `src/lib/supabase/authenticated.ts` autentica rotas privadas com token do usuario e `auth.getUser()`.
- Testes de boundary cobrem que arquivos `"use client"` nao importam service role/admin client.
- Fluxos revisados usam `user.id` da sessao autenticada para filtros e writes; nao foi identificado uso confiando em `user_id` enviado pelo client para isolamento.
- Eventos de produto passam por sanitizacao e allowlist antes de persistir metadados, bloqueando mensagens, respostas, contatos, tokens, secrets e payloads sensiveis.

## Correcoes Aplicadas

- Ampliados testes de RLS para `user_profiles`, `ai_usage` e restricao de escrita em `subscriptions`.
- Ampliados testes de sanitizacao de eventos para bloquear chaves sensiveis adicionais como `message`, `content` e `resposta`.
- Ampliados testes de isolamento do dashboard para incluir `user_profiles` e `ai_usage`.
- Adicionados tipos minimos em `src/types/mvp.ts` para `AppEvent`, `SupportRequest` e `AiResponseFeedback`.

## Testes Realizados

- `npm test -- src/lib/supabase/rls-policies.test.ts src/lib/analytics/track-event.test.ts src/components/pages/user-data-isolation.test.ts`: aprovado.
- Validacao completa do projeto executada ao fim da tarefa:
  - `npm run check:secrets`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `npm test`
  - `npm run validate`

## Riscos Encontrados

- A validacao de RLS foi feita por leitura de migrations e testes locais, nao por queries reais contra o Supabase.
- O snapshot `supabase/schema.sql` esta desatualizado em relacao as migrations mais novas.
- O ambiente local anterior nao tinha service role configurada e a autenticacao Supabase local retornou falha de rede, entao o smoke test autenticado completo ficou pendente.

## Pendencias

- Aplicar todas as migrations no Supabase de staging/producao.
- Regenerar ou atualizar `supabase/schema.sql` apos alinhar o banco real.
- Fazer smoke test com dois usuarios:
  - usuario A nao ve nem altera dados do usuario B em `user_profiles`, `saved_responses`, `ai_usage`, `subscriptions`, `support_requests` e `ai_response_feedback`;
  - usuario autenticado nao consegue escrever em `ai_usage` nem `subscriptions`;
  - eventos em `app_events` nao sao selecionaveis pelo client.

## Proximo Passo Recomendado

Rodar um smoke test SQL/API em staging com dois usuarios autenticados depois de aplicar as migrations, validando as policies no banco real alem da cobertura estatica e mockada.
