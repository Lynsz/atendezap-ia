# Checklist QA final

Use este roteiro antes do deploy real e antes de ligar tráfego pago. Marque cada item em ambiente local, preview e produção.

## Fluxo público

- [ ] Abrir `/demo` e confirmar headline, seletores, exemplos prontos e CTAs.
- [ ] Clicar em uma pergunta pronta da demo e confirmar preenchimento do campo.
- [ ] Gerar resposta na demo com tipo de atuação e tom de voz selecionados.
- [ ] Testar limite de 280 caracteres na pergunta da demo.
- [ ] Enviar muitas requisições para `/api/demo/generate-response` e confirmar bloqueio amigável por rate limit.
- [ ] Testar demo sem `OPENAI_API_KEY` e confirmar resposta simulada sem quebra.
- [ ] Clicar nos CTAs da demo para cadastro e preços.
- [ ] Confirmar eventos `demo_view`, `demo_example_click`, `demo_generate_click`, `demo_response_success`, `demo_response_error`, `demo_signup_cta_click` e `demo_pricing_cta_click`.

- [ ] Abrir `/` e confirmar CTAs para ebook, preços, login e cadastro.
- [ ] Abrir `/ebook?utm_source=meta&utm_medium=cpc&utm_campaign=qa_final`.
- [ ] Confirmar que as UTMs foram salvas no navegador.
- [ ] Enviar nome, e-mail, WhatsApp opcional e tipo de atuação.
- [ ] Confirmar que o lead foi salvo no Supabase com UTMs.
- [ ] Confirmar que o lead não falha para o usuário se `RESEND_API_KEY` estiver ausente.
- [ ] Confirmar redirecionamento para `/ebook/obrigado`.
- [ ] Abrir `/ebook/guia`.
- [ ] Clicar em “Conhecer o AtendeZap IA” e validar rota de preços.
- [ ] Abrir `/termos` e `/privacidade`.
- [ ] Testar home, ebook, obrigado, guia e preços no mobile sem overflow horizontal.

## Fluxo do usuário

- [ ] Criar conta em `/cadastro`.
- [ ] Confirmar evento `signup_completed`, quando tracking estiver configurado.
- [ ] Fazer login em `/login`.
- [ ] Confirmar que usuário autenticado não fica preso em login/cadastro.
- [ ] Abrir `/dashboard` sem login e confirmar redirecionamento para `/login`.
- [ ] Concluir onboarding no dashboard.
- [ ] Confirmar mensagem de sucesso ao concluir configuração.
- [ ] Editar configuração da IA depois do onboarding.
- [ ] Gerar resposta com uma pergunta real.
- [ ] Confirmar resposta salva no histórico.
- [ ] Confirmar uso mensal atualizado.
- [ ] Testar limite mensal com usuário no limite.
- [ ] Confirmar mensagem “Você atingiu o limite mensal do seu plano.”

## Assinatura e Stripe

- [ ] Abrir aba Assinatura no dashboard.
- [ ] Confirmar plano atual, status, limite mensal e uso.
- [ ] Clicar em checkout sem login e confirmar redirecionamento para cadastro.
- [ ] Clicar em checkout logado com Stripe configurado.
- [ ] Confirmar metadata com `user_id`, `plan`, `funnel` e UTMs.
- [ ] Confirmar Plano Pro com primeiro mês por R$ 29 para novos usuários.
- [ ] Confirmar erro amigável quando `STRIPE_SECRET_KEY` ou price IDs estiverem ausentes.
- [ ] Abrir portal Stripe para usuário com `stripe_customer_id`.
- [ ] Confirmar erro amigável para usuário sem assinatura Stripe.

## Webhook Stripe

- [ ] Configurar `STRIPE_WEBHOOK_SECRET`.
- [ ] Simular `checkout.session.completed`.
- [ ] Simular `customer.subscription.created`.
- [ ] Simular `customer.subscription.updated`.
- [ ] Simular `customer.subscription.deleted`.
- [ ] Simular `invoice.payment_succeeded`.
- [ ] Simular `invoice.payment_failed`.
- [ ] Confirmar atualização da tabela `subscriptions`.
- [ ] Confirmar mapeamento de plano, limite mensal e status interno.
- [ ] Confirmar que logs não exibem dados sensíveis completos.

## Admin

- [ ] Configurar `ADMIN_EMAILS` com um ou mais e-mails separados por vírgula.
- [ ] Acessar `/admin` com e-mail admin.
- [ ] Confirmar cards de métricas.
- [ ] Confirmar tabela de leads.
- [ ] Testar busca por nome/e-mail.
- [ ] Testar filtros por tipo de atuação, UTM source, UTM campaign e período.
- [ ] Exportar CSV.
- [ ] Confirmar seção de assinaturas.
- [ ] Confirmar conversão aproximada.
- [ ] Acessar `/admin` com usuário comum e confirmar bloqueio.
- [ ] Chamar `/api/admin/overview` sem token e confirmar 401.

## Tracking, e-mail e variáveis

- [ ] Confirmar que o app funciona sem `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- [ ] Confirmar que o app funciona sem `NEXT_PUBLIC_META_PIXEL_ID`.
- [ ] Confirmar eventos `ebook_view`, `lead_submit`, `lead_success`, `thank_you_view`, `pricing_view`, `checkout_click`, `checkout_started`, `signup_completed`, `onboarding_completed`.
- [ ] Confirmar e-mail do ebook com `RESEND_API_KEY` e `EMAIL_FROM`.
- [ ] Confirmar evento em `lead_email_events` com status `sent`, `failed` ou `skipped`.
- [ ] Confirmar `.env`, `.env.local`, `node_modules` e `.next` ignorados no Git.

## Build e regressão

- [ ] Rodar `npm install`.
- [ ] Rodar `npm run lint`.
- [ ] Rodar `npm run typecheck`.
- [ ] Rodar `npm run test`.
- [ ] Rodar `npm run build`.
- [ ] Rodar `npm run dev`.
- [ ] Fazer smoke test no navegador em desktop e mobile.
