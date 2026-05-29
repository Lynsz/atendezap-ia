# Métricas Internas — AtendeZap IA

Estas métricas servem para acompanhamento interno simples. Use o admin protegido para números agregados do produto e use GA4, Meta Ads, Stripe e Supabase apenas quando a informação não existir no app.

## Aquisição

- visitantes, via analytics externo
- leads capturados
- origem UTM
- cadastros

## Ativação

- onboarding concluído
- primeira resposta gerada
- resposta copiada
- resposta salva
- template salvo
- favorito criado

## Uso

- respostas geradas
- respostas salvas
- templates copiados
- usuários ativos em 7 dias
- usuários ativos em 30 dias

## Receita

- checkouts iniciados
- assinaturas ativas
- assinaturas canceladas
- plano atual
- MRR estimado, se possível

## Suporte e qualidade

- feedbacks negativos
- solicitações de suporte
- falhas de IA
- falhas de webhook
- falhas de checkout

## Privacidade

- Não exportar conteúdo completo de respostas.
- Não enviar e-mail, telefone, pergunta, resposta, token ou dados de pagamento para analytics.
- Tratar dados indisponíveis como `Não disponível`, não como falha do produto.
- Manter o admin protegido por `ADMIN_EMAILS`.
