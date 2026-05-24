# Checklist Supabase Producao

Use este checklist antes de liberar staging/producao com usuarios reais.

## Migrations e schema

- [ ] Aplicar migrations em ordem.
- [ ] Confirmar que nenhuma migration usa `DROP TABLE`.
- [ ] Confirmar que `profiles`, `businesses`, `generated_responses`, `subscriptions`, `ebook_leads`, `lead_email_events` e `user_feedback` existem.
- [ ] Confirmar indices em `user_id` nas tabelas por usuario.
- [ ] Confirmar indices de `subscriptions.stripe_customer_id` e `subscriptions.stripe_subscription_id`.
- [ ] Confirmar indices de `email` e `created_at` em leads.

## RLS e policies

- [ ] RLS habilitado em `profiles`.
- [ ] RLS habilitado em `businesses`.
- [ ] RLS habilitado em `generated_responses`.
- [ ] RLS habilitado em `subscriptions`.
- [ ] RLS habilitado em `ebook_leads`.
- [ ] RLS habilitado em `lead_email_events`.
- [ ] RLS habilitado em `user_feedback`.
- [ ] Usuario comum le apenas dados com o proprio `user_id`.
- [ ] Usuario comum nao lista leads.
- [ ] Usuario comum nao lista eventos internos, webhooks, pedidos ou kits.
- [ ] Admin acessa dados administrativos apenas por API protegida.

## Auth

- [ ] Site URL configurada.
- [ ] Redirect URLs configuradas para local, preview e producao.
- [ ] Cadastro e login testados.
- [ ] Usuario sem sessao nao acessa dashboard, assinatura ou admin.
- [ ] Usuario comum nao acessa admin.
- [ ] E-mail admin configurado em `ADMIN_EMAILS`.

## Variaveis e chaves

- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurada no client.
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada no client.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada apenas em `.env.local` e Vercel server/build.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` nao aparece em arquivos versionados.
- [ ] `.env.local` nao esta versionado.

## Fluxos principais

- [ ] Onboarding salva `businesses` com `user_id` correto.
- [ ] Dashboard mostra apenas dados do usuario logado.
- [ ] Geracao de IA salva historico em `generated_responses`.
- [ ] Limite mensal considera apenas uso do usuario logado.
- [ ] Stripe webhook atualiza `subscriptions`.
- [ ] `/assinatura` mostra plano, status, limite e uso reais.
- [ ] Portal Stripe abre apenas para customer do usuario logado.
- [ ] Leads do ebook sao salvos via API.
- [ ] Eventos de e-mail de lead sao salvos via API.
- [ ] Feedbacks sao salvos e admin consegue revisar.

## Teste de isolamento

- [ ] Criar usuario A.
- [ ] Criar usuario B.
- [ ] Gerar dados com A.
- [ ] Gerar dados com B.
- [ ] Confirmar que A nao ve dados de B.
- [ ] Confirmar que B nao ve dados de A.
- [ ] Testar acesso direto via Supabase client anonimo.
- [ ] Testar acesso direto via usuario autenticado comum.

## Operacao

- [ ] Backups e logs do Supabase revisados.
- [ ] Alertas de erro monitorados.
- [ ] Rotacao de chaves planejada se alguma chave foi exposta.
- [ ] Validacao repetida em staging antes de producao.
