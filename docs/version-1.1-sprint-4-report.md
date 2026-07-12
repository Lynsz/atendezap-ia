# Relatorio da Sprint 4 - Versao 1.1 AtendeZap IA

## Status

* concluida com observacoes

## Objetivo

Melhorar billing, suporte, admin, metricas e operacao.

## Billing

* Planos e limites revisados sem hardcode de Price ID real.
* Pagina `/assinatura` mantem plano atual, status, uso, limite, cards, CTA de checkout, CTA de portal e avisos de retorno do checkout.
* Aviso de que o produto nao envia mensagens automaticamente no WhatsApp foi preservado.

## Suporte

* Categorias principais atualizadas para operacao da Sprint 4.
* Formulario continua sem pedir senha, token, chave ou dados de cartao.
* Solicitacoes associam `user_id` quando ha usuario autenticado.

## Feedback

* Feedback de IA continua com rating, motivo negativo e comentario opcional limitado.
* Teste reforca que campos de pergunta/resposta completa sao rejeitados.
* Admin usa agregados seguros de motivos negativos.

## Admin

* APIs admin seguem protegidas por `requireAdmin`.
* Metricas admin continuam agregadas.
* Texto livre completo de suporte e feedback foi ocultado no resumo admin.
* Evento `admin_dashboard_viewed` foi adicionado pela API protegida de metricas.

## Metricas

* Eventos seguros adicionados: `checkout_completed`, `checkout_cancelled`, `billing_portal_opened`, `admin_dashboard_viewed`, `openai_usage_warning` e `stripe_webhook_received`.
* Sanitizacao segue bloqueando conteudo completo, contato, tokens, secrets, pagamentos e payloads Stripe.

## Custo OpenAI

* Monitoramento documentado com estimativa por quantidade de respostas, sinais de abuso e investigacao de consumo anormal.
* Guardrail de aviso operacional acima de 80% do limite foi adicionado.

## Seguranca

* Nenhum secret real foi adicionado.
* Service role, Stripe secret, webhook secret e OpenAI key seguem server-side.
* RLS nao foi removido.
* `check:secrets` nao foi removido.

## Testes

* Testes de analytics, Stripe, suporte, feedback, admin e limites foram revisados ou reforcados.
* Validacoes finais devem ser usadas como evidencia corrente.

## Bugs corrigidos

* Eventos Sprint 4 ausentes na allowlist.
* Tracking operacional ausente para portal, webhook, checkout finalizado e aviso de uso OpenAI.
* Admin overview exibia texto livre de suporte e feedback.
* Categorias principais de suporte estavam incompletas para Sprint 4.

## Pendencias

* Rodar smoke autenticado em Preview/Producao.
* Validar RLS real com dois usuarios.
* Aplicar migrations pendentes no Supabase real.
* Validar Stripe checkout, portal e webhook assinado no ambiente final.
* Consolidar metricas reais de ativacao, suporte, billing, feedback e custo.

## Proximo passo recomendado

* Executar smoke final da versao 1.1 em ambiente real com dois usuarios, Stripe teste, Supabase/RLS, OpenAI, Resend, suporte, feedback e admin.
