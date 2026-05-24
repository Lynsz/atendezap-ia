# Supabase Producao

Use um projeto Supabase de producao separado do staging. Nao aponte producao para um banco de testes.

## Preparacao

1. Criar ou selecionar o projeto Supabase de producao.
2. Aplicar migrations em ordem.
3. Confirmar que nenhuma migration destrutiva foi executada.
4. Revisar tabelas principais:
   - `profiles`
   - `businesses`
   - `generated_responses`
   - `subscriptions`
   - `ebook_leads`
   - `lead_email_events`
   - `user_feedback`
5. Confirmar indices de `user_id`, e-mail, Stripe customer/subscription e `created_at`.

## RLS e isolamento

- [ ] RLS habilitado nas tabelas com dados de usuario.
- [ ] Usuario comum le apenas os proprios dados.
- [ ] Usuario comum nao lista leads administrativos.
- [ ] Usuario comum nao acessa dados de outro usuario.
- [ ] Admin acessa dados administrativos apenas por API protegida.
- [ ] Service role usada apenas no servidor.

## Auth

- [ ] Site URL configurada com o dominio final.
- [ ] Redirect URLs configuradas com o dominio final.
- [ ] URLs locais mantidas apenas se ainda forem usadas em desenvolvimento.
- [ ] E-mails de auth revisados, se a confirmacao de e-mail estiver ativa.
- [ ] Cadastro testado.
- [ ] Login testado.
- [ ] Logout testado.
- [ ] Recuperacao de senha documentada como pendencia se nao estiver ativa.

## Variaveis na Vercel Production

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`

`SUPABASE_SERVICE_ROLE_KEY` deve ficar apenas na Vercel e em `.env.local` local. Nunca usar em componente client.

## Testes obrigatorios

- [ ] Criar usuario A.
- [ ] Criar usuario B.
- [ ] Concluir onboarding com A.
- [ ] Concluir onboarding com B.
- [ ] Gerar resposta com A.
- [ ] Gerar resposta com B.
- [ ] Confirmar que A nao ve dados de B.
- [ ] Confirmar que B nao ve dados de A.
- [ ] Confirmar que usuario comum nao acessa `/admin`.
- [ ] Confirmar que admin acessa `/admin`.
- [ ] Confirmar webhook Stripe atualizando `subscriptions`.
- [ ] Confirmar `/assinatura` lendo somente a assinatura do usuario autenticado.

## Operacao

- [ ] Backups habilitados ou revisados.
- [ ] Logs revisados apos primeiros testes.
- [ ] Chaves rotacionadas se houve exposicao previa.
- [ ] Acesso ao painel limitado a pessoas necessarias.
