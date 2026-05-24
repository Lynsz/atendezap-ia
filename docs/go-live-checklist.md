# Go-live Checklist

Use no dominio final antes de liberar usuarios reais.

## Build e testes

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm test`
- [ ] `npm run test:e2e`, se existir
- [ ] `npm run check:secrets`, se existir

## Publico

- [ ] Home.
- [ ] Ebook.
- [ ] Obrigado.
- [ ] Guia.
- [ ] Demo.
- [ ] Termos.
- [ ] Privacidade.
- [ ] `/api/health`.

## Auth

- [ ] Cadastro.
- [ ] Login.
- [ ] Logout.
- [ ] Redirect depois de cadastro.
- [ ] Redirect depois de login.
- [ ] Bloqueio sem login em `/dashboard`.
- [ ] Bloqueio sem login em `/assinatura`.
- [ ] Bloqueio de usuario comum em `/admin`.

## Produto

- [ ] Onboarding.
- [ ] Geracao de resposta.
- [ ] Historico.
- [ ] Uso mensal.
- [ ] Limite mensal.
- [ ] Mensagem amigavel quando limite for atingido.

## Stripe

- [ ] Checkout Starter.
- [ ] Checkout Pro.
- [ ] Checkout Premium.
- [ ] Pro mostra primeiro mes por R$ 29 para novos usuarios.
- [ ] Webhook.
- [ ] Portal.
- [ ] Cancelamento.
- [ ] Pagamento falho.
- [ ] `/assinatura` reflete plano ativo.
- [ ] Dashboard reflete limite do plano.

## Admin

- [ ] Login admin.
- [ ] Bloqueio usuario comum.
- [ ] Leads.
- [ ] Feedbacks.
- [ ] Assinaturas.
- [ ] Metricas.
- [ ] Exportacao CSV, se disponivel.

## Email

- [ ] Lead salvo.
- [ ] E-mail do ebook enviado.
- [ ] Status de envio registrado.
- [ ] Obrigado funcionando.
- [ ] Link do guia funcionando.

## Tracking

- [ ] UTMs.
- [ ] GA4.
- [ ] Meta Pixel.
- [ ] Eventos principais.
- [ ] Nenhum dado pessoal desnecessario em eventos.

## Mobile

- [ ] Landing.
- [ ] Ebook.
- [ ] Demo.
- [ ] Dashboard.
- [ ] Assinatura.
- [ ] Admin.

## Go/no-go

- [ ] Sem erro 500 nas rotas principais.
- [ ] Sem segredo exposto no GitHub.
- [ ] Sem segredo exposto no client.
- [ ] Checkout e webhook funcionando.
- [ ] Supabase com RLS e isolamento validado.
- [ ] Admin protegido.
- [ ] Suporte e rollback prontos.
