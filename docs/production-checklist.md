# Checklist de produção

Use este checklist antes de publicar o AtendeZap IA, iniciar anúncios pagos ou enviar tráfego para o funil do ebook.

## Stripe

- [ ] Criar produtos Starter, Pro e Premium.
- [ ] Criar price IDs mensais e preencher `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO` e `STRIPE_PRICE_PREMIUM`.
- [ ] Configurar a oferta do Pro para novos usuários com cupom `duration=once` em `STRIPE_PRO_FIRST_MONTH_COUPON_ID`; manter `STRIPE_PRICE_PRO_FIRST_MONTH_29` apenas se houver price promocional legado para mapear como Pro.
- [ ] Configurar `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- [ ] Configurar webhook de assinatura e preencher `STRIPE_WEBHOOK_SECRET`.
- [ ] Testar checkout para cada plano.
- [ ] Testar retorno de checkout com assinatura ativa.
- [ ] Testar portal do cliente em `/assinatura`.
- [ ] Confirmar que checkout e portal exigem usuário autenticado.

## Supabase

- [ ] Aplicar `supabase/schema.sql` e migrations em ordem.
- [ ] Confirmar tabelas de usuários, assinaturas, uso, leads, eventos de e-mail e tracking necessário.
- [ ] Verificar RLS nas tabelas expostas ao client.
- [ ] Confirmar que dados de um usuário não aparecem para outro.
- [ ] Configurar URLs de autenticação do projeto.
- [ ] Configurar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Configurar `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor.
- [ ] Testar cadastro, login, logout e recuperação de sessão.

## Vercel

- [ ] Configurar todas as variáveis de ambiente de produção.
- [ ] Configurar domínio principal e `NEXT_PUBLIC_APP_URL`.
- [ ] Rodar `npm run lint`.
- [ ] Rodar `npm run typecheck`.
- [ ] Rodar `npm run build`.
- [ ] Testar rotas públicas: `/`, `/ebook`, `/ebook/obrigado`, `/ebook/guia`, `/precos`, `/termos`, `/privacidade`.
- [ ] Testar rotas privadas: `/dashboard`, `/onboarding`, `/assinatura`, `/admin`.
- [ ] Confirmar que páginas privadas não são indexáveis.

## E-mail

- [ ] Configurar domínio e remetente no Resend.
- [ ] Preencher `RESEND_API_KEY` e `EMAIL_FROM`.
- [ ] Preencher `SUPPORT_EMAIL` para páginas legais e suporte.
- [ ] Testar envio do ebook após cadastro do lead.
- [ ] Confirmar registro em `lead_email_events`.
- [ ] Confirmar que o lead continua salvo se o envio de e-mail falhar.

## Tracking

- [ ] Configurar `NEXT_PUBLIC_GA_MEASUREMENT_ID`, se usar GA4.
- [ ] Configurar `NEXT_PUBLIC_META_PIXEL_ID`, se usar Meta Pixel.
- [ ] Testar page views nas páginas públicas.
- [ ] Testar eventos do ebook: `ebook_view`, `lead_submit`, `lead_success` e `lead_error`.
- [ ] Testar eventos de pricing e checkout: `pricing_view`, `checkout_click`, `checkout_started` e `checkout_error`.
- [ ] Testar preservação de UTMs ao navegar entre páginas.
- [ ] Confirmar que o app funciona sem GA4 e sem Meta Pixel configurados.

## Produto

- [ ] Testar home em desktop e mobile.
- [ ] Testar página do ebook com UTMs na URL.
- [ ] Enviar lead com nome, e-mail e tipo de atuação.
- [ ] Confirmar lead salvo com UTMs.
- [ ] Acessar página de obrigado.
- [ ] Acessar o guia gratuito.
- [ ] Criar conta.
- [ ] Concluir onboarding.
- [ ] Gerar resposta com IA.
- [ ] Confirmar histórico e limite mensal.
- [ ] Iniciar checkout.
- [ ] Cancelar ou gerenciar assinatura pelo portal.
- [ ] Acessar admin com e-mail autorizado.
- [ ] Confirmar bloqueio do admin para usuário comum.

## Segurança e legal

- [ ] Confirmar que `.env`, `.env.local`, `node_modules` e `.next` estão ignorados no Git.
- [ ] Confirmar que nenhuma chave secreta aparece no front-end.
- [ ] Confirmar validação de assinatura do webhook Stripe.
- [ ] Confirmar validação de usuário nas APIs privadas.
- [ ] Confirmar bloqueio de usuário comum nas APIs administrativas.
- [ ] Revisar `/termos` e `/privacidade`.
- [ ] Confirmar que o rodapé aponta para Termos de Uso e Política de Privacidade.
- [ ] Testar página 404.
