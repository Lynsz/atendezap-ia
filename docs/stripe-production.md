# Stripe Producao

Nao coloque chaves live, price IDs reais ou webhook secrets neste arquivo. Configure valores reais apenas na Vercel Production e no painel Stripe.

## Troca de test mode para live mode

1. Entrar no Stripe em live mode.
2. Criar ou revisar o produto `AtendeZap IA Starter`.
3. Criar ou revisar o produto `AtendeZap IA Pro`.
4. Criar ou revisar o produto `AtendeZap IA Premium`.
5. Criar precos recorrentes mensais em BRL para Starter, Pro e Premium.
6. Configurar Pro primeiro mes por R$ 29 para novos usuarios usando cupom `duration=once`.
7. Copiar os live price IDs para a Vercel Production:
   - `STRIPE_PRICE_STARTER`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_PREMIUM`
   - `STRIPE_PRO_FIRST_MONTH_COUPON_ID`
8. Configurar `STRIPE_SECRET_KEY` live na Vercel Production.
9. Configurar `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` live na Vercel Production.
10. Configurar `STRIPE_WEBHOOK_SECRET` live na Vercel Production.
11. Confirmar que chaves test e live nao estao misturadas.

## Webhook de producao

Endpoint:

```text
https://SEU-DOMINIO.com/api/stripe/webhook
```

Eventos obrigatorios:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Depois de criar o endpoint, copiar o signing secret para `STRIPE_WEBHOOK_SECRET` na Vercel Production e fazer novo deploy se necessario.

## Testes em producao controlada

- [ ] Criar conta de teste real no dominio final.
- [ ] Iniciar checkout Starter.
- [ ] Iniciar checkout Pro.
- [ ] Confirmar que o Pro aplica o primeiro mes por R$ 29 apenas para novos usuarios elegiveis.
- [ ] Iniciar checkout Premium.
- [ ] Confirmar pagamento real ou valor controlado.
- [ ] Confirmar evento no painel Stripe.
- [ ] Confirmar webhook recebido nos logs da Vercel.
- [ ] Confirmar linha atualizada em `subscriptions` no Supabase.
- [ ] Confirmar `/assinatura` mostrando plano ativo.
- [ ] Confirmar dashboard refletindo limite mensal correto.
- [ ] Abrir Customer Portal.
- [ ] Testar cancelamento.
- [ ] Testar pagamento falho ou inadimplencia quando possivel.

## Criterio de seguranca

- `STRIPE_SECRET_KEY` nunca entra no client.
- `STRIPE_WEBHOOK_SECRET` fica somente em variavel server-side.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` pode ser publica.
- Price IDs nao sao segredo, mas devem ficar em env para separar ambientes.
- Se uma chave live for exposta em chat, commit, issue, log ou documento publico, rotacione imediatamente no Stripe.
