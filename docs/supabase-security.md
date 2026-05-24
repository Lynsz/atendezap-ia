# Seguranca Supabase

Este documento resume a estrutura real do Supabase usada pelo AtendeZap IA e os cuidados para manter isolamento entre usuarios em producao.

## Tabelas principais

- `profiles`: perfil do usuario autenticado. Usa `id` vinculado a `auth.users`, `email`, `name`, `created_at` e `updated_at`.
- `businesses`: equivalente ao perfil do negocio/onboarding. Usa `user_id`, dados do atendimento, tom de voz, campos do onboarding e `onboarding_completed`.
- `generated_responses`: equivalente ao historico de respostas de IA. Usa `user_id`, mensagem do cliente, resposta gerada, tipo de resposta, contexto do negocio e timestamps.
- `subscriptions`: assinatura do SaaS. Usa `user_id`, IDs Stripe, status, plano, periodo atual, limite mensal, uso mensal e metadados.
- `ebook_leads`: equivalente a leads. Guarda nome, e-mail, WhatsApp, tipo de negocio, origem e UTMs.
- `lead_email_events`: eventos de envio de e-mail ligados aos leads.
- `user_feedback`: feedback publico ou autenticado com tipo, mensagem, pagina/contexto e status.

Os nomes `business_profiles`, `ai_responses` e `leads` aparecem em checklists genericos, mas os nomes reais versionados neste projeto sao `businesses`, `generated_responses` e `ebook_leads`.

## RLS

As tabelas sensiveis devem ficar com Row Level Security habilitado em `supabase/schema.sql` e nas migrations incrementais.

- `profiles`: usuario autenticado le, insere e atualiza apenas o proprio registro via `auth.uid() = id`.
- `businesses`: usuario autenticado le, insere, atualiza e remove apenas linhas com `user_id = auth.uid()`.
- `generated_responses`: usuario autenticado le, insere e remove apenas linhas com `user_id = auth.uid()`.
- `customers`: usuario autenticado le, insere, atualiza e remove apenas linhas com `user_id = auth.uid()`.
- `subscriptions`: usuario autenticado pode apenas ler a propria assinatura. Escritas ficam em rotas server-side, webhooks ou funcoes com service role.
- `ebook_leads` e `lead_email_events`: sem acesso direto para `anon` ou `authenticated`; paginas publicas usam API controlada.
- `user_feedback`: permite insert publico/autenticado com `user_id` nulo ou do usuario atual e select apenas do proprio feedback autenticado.
- `stripe_webhook_events`, `events`, `orders`, `kits`, `purchasers` e `support_requests`: sem acesso direto por clientes anonimos/autenticados.
- `plans`: leitura publica permitida porque nao contem segredo.

Admin nao deve depender de politica aberta no client. Acesso administrativo passa por APIs server-side protegidas por Supabase Auth e `ADMIN_EMAILS`.

## Service role

`SUPABASE_SERVICE_ROLE_KEY` so pode ser usada em codigo de servidor.

- Helper permitido: `src/lib/supabase/server.ts`.
- O helper importa `server-only` para impedir import acidental em bundle client.
- Usos aceitaveis: webhooks, APIs publicas controladas, rotas admin apos `requireAdmin`, fluxo legado de token magico e operacoes que precisam ignorar RLS de forma intencional.
- Nunca usar service role em componente com `"use client"`.
- Nunca expor a service role em `NEXT_PUBLIC_*`, logs, documentacao, fixtures ou testes.

Para leituras e escritas do usuario logado, prefira client anonimo com a sessao do usuario e filtros por `user_id` quando a rota/componente ja tem sessao.

## Isolamento por usuario

As queries privadas devem derivar `user_id` da sessao autenticada, nunca de um campo livre enviado pelo client.

- Dashboard consulta `businesses`, `generated_responses`, `customers` e `subscriptions` filtrando `user_id = user.id`.
- Geracao de IA valida a sessao, consulta assinatura e historico do usuario autenticado, e grava resposta com `user_id` da sessao.
- `/assinatura` le apenas a subscription do usuario autenticado.
- Portal Stripe usa o `stripe_customer_id` encontrado na subscription do usuario autenticado.
- APIs admin agregam dados via service role apenas depois de validar admin.

Se uma API receber `user_id` no body, ela deve ignorar esse valor para autorizacao e usar o usuario da sessao.

## Teste manual de seguranca

1. Aplicar todas as migrations no Supabase de staging.
2. Criar usuario A e usuario B.
3. Fazer onboarding com A e gerar respostas.
4. Fazer onboarding com B e gerar respostas diferentes.
5. Logado como A, confirmar que dashboard, historico, assinatura e portal nao retornam dados de B.
6. Logado como B, confirmar que nao aparecem dados de A.
7. Tentar listar `ebook_leads` com anon/authenticated pelo client e confirmar bloqueio por RLS/grants.
8. Acessar `/admin` com usuario comum e confirmar bloqueio.
9. Acessar `/admin` com e-mail em `ADMIN_EMAILS` e confirmar acesso.
10. Validar que webhook Stripe atualiza apenas a subscription associada ao usuario/customer correto.

## Painel Supabase

No painel Supabase, confirmar antes da producao:

- Auth Site URL e Redirect URLs apontam para os dominios corretos.
- RLS esta habilitado nas tabelas sensiveis.
- Policies batem com `supabase/schema.sql`.
- Grants nao permitem listar tabelas administrativas pelo client.
- `SUPABASE_SERVICE_ROLE_KEY` existe apenas em ambiente seguro da Vercel e no `.env.local` local.
