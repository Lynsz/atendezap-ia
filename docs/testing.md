# Testes do AtendeZap IA

## Comandos

- `npm run test`: roda a suite Vitest de helpers, validadores, APIs e regras criticas.
- `npm run test:e2e`: roda Playwright em Chromium contra o app local.
- `npm run test:e2e:ui`: abre a UI do Playwright para depuracao.
- `npm run test:all`: roda Vitest e Playwright em sequencia.
- `npm run lint`, `npm run typecheck` e `npm run build`: continuam obrigatorios antes de finalizar mudancas.

O Playwright sobe `npm run build && npm run start -- --port 3100` automaticamente para evitar conflito com um `localhost:3000` ja aberto e validar o app em modo de producao. Use `PORT=3000 npm run test:e2e` ou `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e` se quiser apontar para outro servidor.

## Variaveis para teste local

Os testes automatizados foram desenhados para rodar sem Stripe, OpenAI ou Resend reais:

- Demo publica: aceita fallback quando `OPENAI_API_KEY` nao existe.
- Ebook e2e: intercepta `/api/ebook-lead` no navegador para validar UX, UTMs e redirecionamento sem gravar lead real.
- APIs privadas: validam bloqueio sem sessao.
- Stripe webhook: usa mocks de Stripe e Supabase em Vitest.

Para testes reais de integracao, use `.env.local` com:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PRO`
- `STRIPE_COUPON_PRO_FIRST_MONTH_29`
- `STRIPE_PRICE_PREMIUM`
- `OPENAI_API_KEY`, opcional para testar geracao real.
- `RESEND_API_KEY` e `EMAIL_FROM`, opcionais para testar entrega real do ebook.

## Cobertura automatizada atual

- Paginas publicas: `/`, `/ebook`, `/ebook/obrigado`, `/ebook/guia`, `/demo`, `/login`, `/cadastro`, `/termos`, `/privacidade`.
- Health check: `/api/health`.
- Funil do ebook: UTMs, nome, e-mail, tipo de atuacao, envio e redirecionamento para obrigado.
- Demo publica: tipo de atuacao, tom de voz, pergunta pronta, resposta ou fallback e CTAs.
- Protecao sem login: `/dashboard`, `/assinatura`, `/admin` e APIs privadas/admin.
- Admin: normalizacao de `ADMIN_EMAILS`, usuario comum bloqueado e admin autorizado por mock.
- Isolamento multiusuario: consultas do dashboard/API usam `user_id` da sessao e nao aceitam `user_id` enviado pelo client.
- Stripe webhook: assinatura invalida, evento sem `user_id`, mapeamento de planos, cancelamento e pagamento falho.
- Validacao de APIs: lead sem e-mail, e-mail invalido, demo vazia/grande, IA vazia/grande, checkout com plano invalido.

## Stripe CLI

Para validar o webhook com assinatura real:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o secret gerado para `STRIPE_WEBHOOK_SECRET` e, em outro terminal, rode eventos de teste:

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_failed
```

O teste mais confiavel de checkout completo deve partir de uma Checkout Session criada pelo app, porque ela carrega `metadata.user_id`, `plan`, `price_id` e UTMs.

## O que ainda exige teste manual

- Cadastro e login reais com Supabase, incluindo confirmacao de e-mail se estiver ativa.
- RLS real no Supabase com dois usuarios de teste.
- Checkout real em Stripe test mode, portal e webhooks assinados.
- Entrega real do ebook pelo Resend.
- Validacao visual mobile em preview/producao.
- Eventos reais de GA4, Meta Pixel e Sentry quando configurados.
