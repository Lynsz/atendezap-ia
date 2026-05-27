# Monitoramento de Producao - AtendeZap IA

## Objetivo
Acompanhar a saude do produto em producao e detectar problemas criticos rapidamente.

## O que monitorar diariamente
- erros na Vercel
- falhas em rotas API
- falhas de login/cadastro
- falhas de geracao com IA
- falhas no Stripe Checkout
- falhas no webhook Stripe
- falhas de envio pelo Resend
- uso/custo da OpenAI
- novos leads
- novos usuarios
- novas assinaturas
- feedbacks negativos

## O que monitorar semanalmente
- conversao do funil
- uso medio por usuario
- usuarios ativos
- cancelamentos
- custo por usuario
- erros recorrentes
- feedbacks repetidos
- gargalos de onboarding

## Alertas criticos
- checkout quebrado
- webhook nao atualiza assinatura
- IA indisponivel
- login quebrado
- erro 500 recorrente
- dados de usuarios expostos
- admin acessivel indevidamente

## Fontes minimas
- Vercel Logs
- Supabase logs e tabelas administrativas protegidas
- Stripe Dashboard e eventos de webhook
- OpenAI usage/cost dashboard
- Resend logs
- `/api/health`
- painel admin em `/admin`
