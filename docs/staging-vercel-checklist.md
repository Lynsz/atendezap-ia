# Checklist Vercel staging

Use antes de liberar producao controlada ou trafego pago.

## Antes do deploy

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm test`
- [ ] `npm run test:e2e`
- [ ] `npm run check:secrets`
- [ ] `.env.example` atualizado.
- [ ] `.env.local` ignorado.
- [ ] Nenhuma chave real no GitHub.
- [ ] Branch revisada sem mudancas fora de escopo.
- [ ] Migrations Supabase revisadas.

## Variaveis

- [ ] `NEXT_PUBLIC_APP_URL` aponta para a URL staging sem barra final.
- [ ] Supabase staging configurado.
- [ ] Stripe test mode configurado.
- [ ] Resend configurado ou fallback `skipped_not_configured` aceito.
- [ ] OpenAI configurada ou fallback da demo documentado.
- [ ] `ADMIN_EMAILS` contem e-mail admin de teste.
- [ ] GA4/Meta opcionais configurados apenas se forem ser testados.

## Depois do deploy

- [ ] Abrir `/`.
- [ ] Abrir `/api/health` e confirmar `status: "ok"`.
- [ ] Abrir `/ebook`.
- [ ] Enviar lead com UTMs.
- [ ] Confirmar lead no Supabase.
- [ ] Confirmar `lead_email_events`.
- [ ] Abrir `/ebook/obrigado`.
- [ ] Abrir `/ebook/guia`.
- [ ] Abrir `/demo`.
- [ ] Gerar resposta na demo.
- [ ] Criar conta.
- [ ] Fazer login.
- [ ] Concluir onboarding.
- [ ] Gerar resposta no dashboard.
- [ ] Confirmar historico e uso mensal.
- [ ] Acessar `/assinatura`.
- [ ] Iniciar checkout Starter.
- [ ] Iniciar checkout Pro com cupom.
- [ ] Iniciar checkout Premium.
- [ ] Validar webhook Stripe.
- [ ] Confirmar assinatura em `subscriptions`.
- [ ] Abrir Customer Portal.
- [ ] Voltar para `/assinatura`.
- [ ] Acessar admin como admin.
- [ ] Bloquear admin para usuario comum.
- [ ] Validar mobile em home, ebook, demo, dashboard e assinatura.

## Go/no-go

- [ ] Sem erro 500 em rotas principais.
- [ ] Sem segredo exposto no client.
- [ ] Checkout e webhook test mode funcionando.
- [ ] Supabase com RLS e isolamento validado.
- [ ] Resend envia ou registra falha controlada.
- [ ] OpenAI gera resposta ou fallback esperado esta documentado.
- [ ] Admin acessivel apenas por e-mail autorizado.
