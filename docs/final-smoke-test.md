# Smoke Test Final - AtendeZap IA

Use este checklist imediatamente antes de liberar os primeiros usuarios. Execute no ambiente real de staging/producao controlada, com contas e dados descartaveis.

## Publico

- [ ] Abrir home (`/`).
- [ ] Abrir ebook (`/ebook`).
- [ ] Enviar lead.
- [ ] Abrir obrigado (`/ebook/obrigado`).
- [ ] Abrir guia (`/ebook/guia`).
- [ ] Abrir demo (`/demo`).
- [ ] Abrir termos (`/termos`).
- [ ] Abrir privacidade (`/privacidade`).

## Auth

- [ ] Criar conta.
- [ ] Fazer login.
- [ ] Fazer logout.
- [ ] Bloquear dashboard sem login.
- [ ] Bloquear assinatura sem login.

## Produto

- [ ] Concluir onboarding no dashboard.
- [ ] Gerar resposta.
- [ ] Ver historico.
- [ ] Ver uso mensal.
- [ ] Bater limite mensal, se possivel testar.

## Stripe

- [ ] Abrir assinatura (`/assinatura`).
- [ ] Iniciar checkout Starter.
- [ ] Iniciar checkout Pro.
- [ ] Iniciar checkout Premium.
- [ ] Concluir pagamento teste.
- [ ] Verificar webhook.
- [ ] Verificar assinatura no Supabase.
- [ ] Abrir portal Stripe.
- [ ] Cancelar assinatura teste.

## Admin

- [ ] Acessar com admin.
- [ ] Bloquear usuario comum.
- [ ] Ver leads.
- [ ] Exportar CSV.
- [ ] Ver assinaturas.

## Tracking

- [ ] Acessar com UTMs.
- [ ] Salvar lead com UTMs.
- [ ] Confirmar evento de lead.
- [ ] Confirmar evento de checkout.

## Mobile

- [ ] Home.
- [ ] Ebook.
- [ ] Demo.
- [ ] Dashboard.
- [ ] Assinatura.
- [ ] Admin.

## Criterio de aceite

- [ ] Nenhum erro 500 em rota principal.
- [ ] Nenhum segredo aparece no HTML, bundle client, logs ou respostas de API.
- [ ] Checkout, webhook, assinatura e portal foram validados.
- [ ] Lead, e-mail, demo, geracao de IA, dashboard e admin foram validados.
- [ ] Pendencias externas foram registradas antes de liberar usuarios.
