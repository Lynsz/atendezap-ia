# Revisao de APIs Criticas - AtendeZap IA

## Objetivo
Registrar a revisao operacional das rotas sensiveis ligadas a IA, dados do usuario, billing, leads e admin.

## Rotas revisadas
- `/api/ai/generate-response` e alias `/api/generate-response`
- `/api/saved-responses`
- `/api/saved-responses/[id]`
- `/api/saved-responses/[id]/duplicate`
- `/api/ai/response-feedback`
- `/api/stripe/create-checkout-session`
- `/api/stripe/create-portal-session`
- `/api/stripe/webhook`
- `/api/ebook-lead`
- `/api/feedback`
- `/api/data-requests`
- `/api/support`
- `/api/admin/overview`
- `/api/admin/metrics`
- `/api/admin/campaign-report`
- `/api/admin/data-requests`
- `/api/admin/support/[id]`

## Resultado da revisao
- Rotas de dashboard e biblioteca exigem sessao Supabase valida.
- `user_id` e derivado da sessao autenticada, nao do payload do client.
- Respostas salvas, historico e feedback filtram por `user.id`.
- Admin passa por `requireAdmin` e usa service role apenas no backend.
- Checkout e portal Stripe exigem usuario autenticado.
- Webhook Stripe valida assinatura antes de processar eventos.
- Lead/ebook e feedback publico usam Zod, rate limit e service role apenas no servidor.
- Solicitacoes de dados sao autenticadas, usam `user.id` da sessao, ficam pendentes para processo manual e possuem RLS por usuario.
- Admin de solicitacoes de dados passa por `requireAdmin`, mascara e-mail e nao retorna dados exportados ou conteudo sensivel.
- Suporte autenticado lista apenas solicitacoes do proprio usuario; criacao autenticada usa `user.id` da sessao e visitante precisa informar e-mail.
- Admin de suporte passa por `requireAdmin`, permite alterar status/prioridade/notas internas e mascara contato no painel.
- Erros retornam mensagens amigaveis; stack trace nao e enviado ao usuario.
- Logs usam `serverLog`, que mascara e-mails, user ids, secrets e campos de conteudo.

## Pontos de atencao
- Validar RLS real com dois usuarios em staging/producao.
- Manter eventos internos sem prompts, respostas completas, payloads completos ou dados de pagamento sensiveis.
- Conferir periodicamente que novas APIs nao aceitam `user_id` do client como fonte de autorizacao.
- Revisar admin para manter metricas agregadas e sem exposicao desnecessaria de conteudo sensivel.
