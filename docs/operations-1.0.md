# Operacao da Versao 1.0 - AtendeZap IA

## Objetivo

Manter o AtendeZap IA estavel, seguro e utilizavel apos o lancamento.

## Rotina diaria

- Verificar logs da Vercel.
- Verificar erros no Supabase.
- Verificar eventos Stripe.
- Verificar falhas de webhook.
- Verificar falhas no envio de e-mail.
- Verificar uso/custo da OpenAI.
- Verificar feedbacks.
- Verificar novos leads.
- Verificar novos usuarios.
- Verificar assinaturas.
- Verificar bugs criticos.

## Rotina semanal

- Revisar metricas de ativacao.
- Revisar conversao do funil.
- Revisar feedbacks repetidos.
- Revisar cancelamentos.
- Revisar custos.
- Revisar bugs P0/P1.
- Revisar melhorias do roadmap.
- Revisar anuncios, se ativos.

## Rotina mensal

- Revisar precos.
- Revisar planos.
- Revisar limites mensais.
- Revisar custos de IA.
- Revisar metricas de retencao.
- Revisar documentacao.
- Revisar seguranca.
- Revisar backups/migrations.

## Fontes de acompanhamento

- Admin: leads, usuarios, assinaturas, feedbacks, metricas internas, ativacao e UTMs.
- Vercel: deploys, runtime logs, erros 500 e falhas em rotas API.
- Supabase: Auth, logs, RLS, tabelas `profiles`, `businesses`, `generated_responses`, `subscriptions`, `ebook_leads`, `lead_email_events` e `user_feedback`.
- Stripe: eventos, webhooks, assinaturas, portal, pagamentos falhos e reembolsos.
- Resend: e-mails enviados, falhas, bounce e dominio/remetente.
- OpenAI: uso, custo, erros e picos inesperados.
- GA4/Meta: visitantes, eventos, UTMs e custos de campanha.

## Regra de parada

Pausar novos convites, campanhas e aumento de orcamento se houver P0/P1 em login, checkout, webhook, geracao de IA, isolamento de dados, admin ou deploy de producao.
