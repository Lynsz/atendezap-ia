# Relatorio de Deploy - Versao 1.1 AtendeZap IA

## Status

* deploy aprovado
* deploy aprovado com observacoes
* deploy bloqueado
* rollback realizado

## Ambiente

* preview
* production

## URL

*

## Validacoes executadas

* Validacoes locais: pendente de preenchimento no momento do deploy.
* GitHub Actions: pendente de confirmacao visual no GitHub.

## Smoke test preview

*

## Smoke test producao

*

## Bugs encontrados

*

## Correcoes aplicadas

*

## Seguranca

* Repositorio deve permanecer privado.
* `.env.local` e secrets reais nao devem ser commitados.
* Eventos nao devem salvar pergunta completa, resposta completa, contato, token, secret, dado de pagamento ou payload completo Stripe.
* Admin deve continuar protegido por login e `ADMIN_EMAILS`.

## Supabase/RLS

* Migrations devem estar aplicadas no ambiente real antes da aprovacao final.
* RLS deve ser validado com dois usuarios reais.

## OpenAI

* `OPENAI_API_KEY` deve ficar server-side.
* Dashboard real nao deve fingir IA se OpenAI estiver ausente ou indisponivel.
* Custo deve ser acompanhado no monitoramento de 72 horas.

## Stripe

* `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` devem ficar server-side.
* Checkout nao pode aceitar preco vindo do client.
* Webhook deve validar assinatura e nao salvar payload completo.

## Admin

* `/admin` deve bloquear usuario comum.
* `/api/admin/*` deve bloquear usuario comum.
* Dados operacionais devem ser agregados e seguros.

## Decisao

*

