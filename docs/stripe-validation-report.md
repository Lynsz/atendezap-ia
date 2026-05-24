# Validação Stripe — AtendeZap IA

## Status

Parcialmente validado.

O fluxo esta pronto para teste real em Stripe test mode, mas ainda nao foi validado de ponta a ponta contra Stripe CLI, painel Stripe e Supabase real neste ambiente porque as chaves/test envs nao estao disponiveis aqui.

## O que foi validado

- Checkout Starter: validado por teste automatizado com mock, usando `STRIPE_PRICE_STARTER`.
- Checkout Pro: validado por teste automatizado com mock, usando `STRIPE_PRICE_PRO`.
- Checkout Premium: validado por teste automatizado com mock, usando `STRIPE_PRICE_PREMIUM`.
- Cupom Pro: validado por teste automatizado com mock, aplicando `STRIPE_PRO_FIRST_MONTH_COUPON_ID` somente no Pro quando configurado.
- Webhook: validado por teste automatizado com mock para assinatura invalida, assinatura atualizada, cancelamento, pagamento bem-sucedido e pagamento falho.
- Supabase: validado por mocks da service role e revisao de migrations/campos esperados.
- Dashboard: revisado para leitura de assinatura real em `subscriptions`, status, limite mensal, uso mensal e periodo.
- `/assinatura`: revisada para assinatura real, cards Starter/Pro/Premium, Pro recomendado, texto de primeiro mes por R$ 29 e portal Stripe.
- Portal: validado por teste automatizado com mock para usuario sem customer e usuario com customer.
- Cancelamento: validado por teste automatizado com `customer.subscription.deleted`.
- Pagamento falho: validado por teste automatizado com `invoice.payment_failed`.

## Problemas encontrados

- Validacao real externa ainda pendente: Stripe test mode, Stripe CLI, Supabase real e dashboard com usuario real.
- O botao de checkout podia receber um segundo clique antes do estado visual atualizar em alguns cenarios rapidos.

## Correções realizadas

- `StripeCheckoutButton` agora ignora clique quando `loading` ja esta ativo.
- Teste automatizado adicionado para portal sem usuario logado retornando 401.
- Checklist manual criado em `docs/stripe-validation-checklist.md`.
- Relatorio de validacao criado neste arquivo.
- Auditoria e relatorio final atualizados com o status do fluxo Stripe.

## Pendências externas

- Criar ou reutilizar produtos no Stripe test mode.
- Copiar price IDs para `.env.local`.
- Configurar `STRIPE_PRO_FIRST_MONTH_COUPON_ID`.
- Configurar `STRIPE_WEBHOOK_SECRET` via Stripe CLI.
- Aplicar migrations Supabase no ambiente de teste.
- Configurar Customer Portal no painel Stripe, se necessario.
- Configurar Vercel Preview/Staging com as mesmas variaveis de test mode.
- Executar checkout real dos planos Starter, Pro e Premium.
- Confirmar eventos no Stripe CLI e linhas atualizadas em `subscriptions`.

## Próximo passo recomendado

Executar `docs/stripe-validation-checklist.md` em ambiente local com Stripe test mode e Supabase de teste. Depois repetir o mesmo fluxo em Vercel Preview/Staging antes de liberar primeiros usuarios pagantes.
