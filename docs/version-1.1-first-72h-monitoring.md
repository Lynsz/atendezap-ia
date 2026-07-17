# Monitoramento 72h - Versao 1.1

## Objetivo

Acompanhar estabilidade, uso, suporte, IA, billing, custo e seguranca nas primeiras 72 horas apos o deploy.

## Monitorar diariamente

* `/api/health`
* erros 500
* cadastro
* login
* onboarding
* geracao de IA
* respostas copiadas
* respostas salvas
* uso de templates
* feedbacks negativos
* suporte aberto
* acessos a assinatura
* checkouts iniciados
* webhooks Stripe
* limites mensais atingidos
* custo estimado OpenAI
* tentativas de acesso ao admin
* logs com erro critico

## Pausar ou fazer rollback se

* cadastro quebrar
* login quebrar
* onboarding quebrar
* dashboard quebrar
* IA falhar para multiplos usuarios
* checkout quebrar
* webhook quebrar
* admin ficar acessivel para usuario comum
* vazamento de dados
* vazamento de secret
* erro 500 recorrente em rota critica
* custo OpenAI subir de forma anormal

## Fontes sugeridas

* Vercel Runtime Logs e status de deploy.
* Supabase Auth, Database logs e tabelas agregadas.
* Stripe Dashboard e eventos de webhook.
* OpenAI usage dashboard.
* Admin protegido do AtendeZap IA.
* Tickets de suporte e feedbacks recebidos.

## Decisao apos 72h

* manter operacao
* corrigir e continuar
* rollback
* preparar campanha pequena
* planejar versao 1.2

