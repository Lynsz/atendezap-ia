# Monitoramento de Custos - AtendeZap IA

## OpenAI

- Verificar uso diario.
- Verificar custo mensal.
- Revisar limites por plano.
- Revisar uso da demo publica.
- Revisar rate limit.
- Investigar picos inesperados antes de aumentar campanhas.

## Stripe

- Verificar taxas.
- Verificar assinaturas.
- Verificar pagamentos falhos.
- Verificar reembolsos, se houver.
- Comparar assinaturas ativas no Stripe com `subscriptions` no Supabase.

## Supabase

- Verificar uso do banco.
- Verificar storage, se houver.
- Verificar Auth.
- Verificar logs.
- Conferir crescimento de `generated_responses`, `events`, `ebook_leads` e `lead_email_events`.

## Vercel

- Verificar uso de bandwidth.
- Verificar funcoes.
- Verificar erros de runtime.
- Verificar timeouts e rotas API com maior volume.

## Resend

- Verificar e-mails enviados.
- Verificar falhas.
- Verificar dominio/remetente.
- Verificar bounces e reclamacoes.

## Campanhas

- Custos de midia nao sao calculados automaticamente pelo app.
- Custo por lead, cadastro, checkout e assinatura deve ser calculado com dados de GA4/Meta Ads e totais internos do admin.
- Nao aumentar investimento se tracking, checkout, webhook, leads ou IA estiverem instaveis.
