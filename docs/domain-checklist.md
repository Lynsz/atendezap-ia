# Checklist de Dominio

Use no dominio final antes de liberar usuarios reais.

## Dominio

- [ ] Dominio comprado/configurado.
- [ ] Dominio apontado para Vercel.
- [ ] SSL ativo.
- [ ] Dominio sem `www` funcionando.
- [ ] `www` redirecionando corretamente, se aplicavel.
- [ ] Dominio final abre a home sem erro 500.
- [ ] `/api/health` retorna `status: "ok"`.

## Variaveis e URLs

- [ ] `NEXT_PUBLIC_APP_URL` atualizado para o dominio final, sem barra final.
- [ ] Vercel Production usa as variaveis de producao, nao as de staging.
- [ ] Supabase Auth Site URL atualizado para o dominio final.
- [ ] Supabase Redirect URLs atualizadas para o dominio final.
- [ ] Stripe webhook usando o dominio final.
- [ ] Customer Portal retorna para o dominio final.
- [ ] Links do e-mail do ebook usam o dominio final.
- [ ] Resend usando dominio/remetente correto.
- [ ] GA4 usando dominio correto.
- [ ] Meta Pixel usando dominio correto.

## Conferencias manuais

- [ ] Login redireciona corretamente depois de autenticar.
- [ ] Cadastro redireciona corretamente depois de criar conta.
- [ ] Checkout volta para `/assinatura?checkout=success`.
- [ ] Cancelamento de checkout volta para `/assinatura?checkout=cancel`.
- [ ] E-mail do ebook abre `/ebook/guia` no dominio final.
- [ ] Termos e privacidade abrem no dominio final.
