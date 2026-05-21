# Checklist final de producao

Use este checklist antes de liberar o AtendeZap IA para primeiros usuarios reais. Nao marque itens de integracao como concluidos sem validar no ambiente final.

## Antes do deploy

- [ ] `npm run lint` executado e sem erros.
- [ ] `npm run typecheck` executado e sem erros.
- [ ] `npm run build` executado e sem erros.
- [ ] `npm test` executado e sem erros.
- [ ] `npm run test:e2e` executado, se o Playwright estiver instalado.
- [ ] `.env.example` atualizado e sem valores reais.
- [ ] Nenhuma chave real versionada no repositorio.
- [ ] `.env` e `.env.local` confirmados no `.gitignore`.
- [ ] Migrations do Supabase revisadas.
- [ ] Stripe test mode validado de ponta a ponta.
- [ ] Resend testado com remetente final ou remetente permitido.
- [ ] OpenAI testada no dashboard e na demo publica.
- [ ] Admin testado com usuario admin e usuario comum.

## Vercel

- [ ] Variaveis de ambiente configuradas no ambiente correto.
- [ ] Dominio de producao configurado.
- [ ] `NEXT_PUBLIC_APP_URL` aponta para a URL final com `https`.
- [ ] Deploy concluiu sem erro.
- [ ] Logs da Vercel nao mostram erro critico em rotas principais.
- [ ] `/api/health` retorna `200`.

## Supabase

- [ ] Migrations aplicadas no projeto correto.
- [ ] RLS revisado para tabelas com dados de usuario.
- [ ] Auth Site URL configurada para o dominio final.
- [ ] Redirect URLs configuradas para login/cadastro/recuperacao quando aplicavel.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada apenas no servidor.
- [ ] Usuario comum nao acessa dados de outro usuario.
- [ ] Usuario admin configurado em `ADMIN_EMAILS`.

## Stripe

- [ ] Produtos Starter, Pro e Premium criados.
- [ ] Precos recorrentes configurados.
- [ ] Pro primeiro mes por R$ 29 configurado para novos usuarios.
- [ ] Webhook de producao configurado.
- [ ] Eventos obrigatorios selecionados: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded` e `invoice.payment_failed`.
- [ ] Checkout Starter testado.
- [ ] Checkout Pro testado.
- [ ] Checkout Premium testado.
- [ ] Portal do cliente testado.
- [ ] Cancelamento testado.
- [ ] Pagamento falho testado.

## Resend

- [ ] Dominio ou remetente permitido configurado.
- [ ] `RESEND_API_KEY` configurada.
- [ ] `EMAIL_FROM` configurado.
- [ ] Envio do ebook testado.

## OpenAI

- [ ] `OPENAI_API_KEY` configurada.
- [ ] `OPENAI_MODEL` configurado.
- [ ] Geracao de resposta testada no dashboard.
- [ ] Demo publica testada.
- [ ] Limite mensal testado.

## Tracking

- [ ] GA4 configurado.
- [ ] Meta Pixel configurado.
- [ ] UTMs testadas no funil do ebook.
- [ ] Evento `lead_success` testado.
- [ ] Evento `checkout_started` testado.
- [ ] Assinatura/conversao testada quando possivel.
