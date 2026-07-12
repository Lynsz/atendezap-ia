# Relatorio Operacional - Sprint 4 Versao 1.1

## Billing

* Planos Free, Starter, Pro e Premium revisados em `src/lib/billing/plans.ts` e `src/config/plans.ts`.
* Pro mantem o texto "Primeiro mes por R$ 29 para novos usuarios.".
* Price IDs continuam vindo de variaveis de ambiente.

## Stripe checkout

* Checkout exige login, recebe apenas `planId` e rejeita payload com preco vindo do client.
* Plano `free` e plano invalido retornam erro controlado.
* Checkout iniciado continua registrado com metadata segura.
* Checkout concluido passa a registrar evento seguro `checkout_completed` via webhook e pagina de retorno.

## Stripe portal

* Portal exige login e busca customer no servidor.
* Abertura do portal passa a registrar `billing_portal_opened`.
* Erros continuam amigaveis e sem stack trace.

## Stripe webhook

* Webhook le raw body, valida assinatura e salva apenas resumo seguro em `stripe_webhook_events`.
* Evento seguro `stripe_webhook_received` foi adicionado sem payload completo.
* Eventos minimos revisados: checkout concluido, subscription created/updated/deleted, invoice succeeded/failed.

## Limites mensais

* Limite e verificado antes da OpenAI.
* Falha da OpenAI nao incrementa uso.
* Sucesso incrementa uso.
* Uso acima de 80% passa a registrar `openai_usage_warning` com contagem e limite, sem prompt ou resposta.

## Suporte

* Categorias principais alinhadas a acesso, erro de IA, assinatura, limite mensal, feedback, bug e outro.
* Categorias legadas continuam aceitas para compatibilidade.
* Mensagem segue limitada e com erro amigavel.

## Feedback

* Feedback de IA segue autenticado, com util/nao util, motivo negativo e comentario opcional limitado.
* Teste reforca rejeicao de comentario longo e campos extras com pergunta/resposta completa.
* Analytics salva apenas rating e motivo categorizado.

## Admin

* Admin continua exigindo login e e-mail autorizado em `ADMIN_EMAILS`.
* `admin_dashboard_viewed` foi adicionado na API de metricas protegida.
* Overview admin deixa de devolver texto livre completo de suporte e feedback no resumo operacional.

## Metricas

* Eventos seguros adicionados ou normalizados: `checkout_completed`, `checkout_cancelled`, `billing_portal_opened`, `admin_dashboard_viewed`, `openai_usage_warning` e `stripe_webhook_received`.
* Migration `0030_sprint4_operational_events.sql` amplia a allowlist de `app_events`.
* Metricas reais seguem pendentes ate operacao em ambiente final.

## Custo OpenAI

* Documentacao de custo foi atualizada com estimativa por volume, sinais de abuso, rotina de investigacao e validacao de limite mensal.
* Nao foi criada infraestrutura complexa de custo por token.

## Seguranca

* Nenhum secret real foi adicionado.
* `.env.local` nao foi alterado nem versionado.
* Eventos continuam sanitizados contra pergunta, resposta, suporte sensivel, e-mail, telefone, token, secret, pagamento e payload Stripe.

## Pendencias

* Rodar smoke autenticado em Preview/Producao.
* Validar RLS real com dois usuarios.
* Aplicar migrations pendentes no Supabase real, incluindo Sprint 3 e Sprint 4.
* Validar Stripe checkout, portal e webhook assinado no ambiente final.
* Confirmar GitHub Actions verde.
* Consolidar metricas reais de billing, suporte, feedback, ativacao e custo OpenAI.
