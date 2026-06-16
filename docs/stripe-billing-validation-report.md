# Validacao Stripe e Billing - AtendeZap IA

## Status

* aprovado

## Pagina de assinatura

* `/assinatura` exige login via `ProtectedRoute`.
* Mostra assinatura atual, status amigavel, uso mensal, limite e cards de planos.
* Exibe Pro como recomendado e informa: "Primeiro mes por R$ 29 para novos usuarios."
* Explica cancelamento pelo portal Stripe e que o produto nao envia mensagens automaticamente no WhatsApp.
* Nao quebra sem Stripe publico configurado; mostra mensagem amigavel.

## Checkout

* `POST /api/stripe/create-checkout-session` exige usuario autenticado.
* Recebe somente `planId`, valida contra `starter`, `pro` e `premium`, e rejeita `free`.
* Price id vem de variavel de ambiente, nunca do client.
* Cria ou reutiliza customer Stripe e cria Checkout Session `subscription`.
* Usa URLs `/assinatura?checkout=success` e `/assinatura?checkout=cancelled`.

## Portal

* `POST /api/stripe/create-portal-session` exige usuario autenticado.
* Busca `stripe_customer_id`/`provider_customer_id` no servidor.
* Retorna erro amigavel quando nao ha customer Stripe.
* Retorna para `/assinatura`.

## Webhook

* `POST /api/stripe/webhook` le raw body e valida assinatura com `STRIPE_WEBHOOK_SECRET`.
* Rejeita assinatura invalida.
* Processa checkout, subscription created/updated/deleted e invoice succeeded/failed.
* Salva apenas resumo seguro do evento em `stripe_webhook_events`.

## Subscriptions

* `subscriptions` possui campos de Stripe, plano, status, periodo e limite mensal.
* RLS permite SELECT apenas da propria assinatura.
* Cliente autenticado nao tem permissao de insert/update/delete.
* Atualizacoes de assinatura acontecem via backend/service role.

## Limite mensal

* Free usa 20 respostas.
* `active` e `trialing` usam limite do plano contratado.
* `canceled`, `unpaid`, `incomplete` e estados inseguros caem para limite Free.
* A rota de IA valida limite antes da OpenAI e incrementa uso somente apos sucesso.

## Testes realizados

* `npm test -- stripe`
* `npm test -- src/lib/billing/plans.test.ts src/lib/usage-limits.test.ts src/app/api/ai/generate-response/route.test.ts`

## Correcoes aplicadas

* Checkout passou a aceitar apenas `planId`.
* Adicionado teste para rejeitar checkout do plano `free`.
* Texto do Pro com primeiro mes por R$ 29 foi padronizado com ponto final.
* Mensagens da pagina de assinatura foram alinhadas aos status solicitados.
* Pagina de assinatura passou a explicitar que nao ha envio automatico pelo WhatsApp.

## Pendencias

* Nenhuma pendencia bloqueante encontrada.

## Proximo passo recomendado

* Testar manualmente um checkout Stripe em modo teste e confirmar o webhook no ambiente de staging.
