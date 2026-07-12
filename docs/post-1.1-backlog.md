# Backlog Pos-1.1 - AtendeZap IA

## P0

* Nenhum P0 confirmado no fechamento local da versao 1.1.
* Se surgir vazamento de dados, secret exposto, falha de RLS, checkout/webhook indisponivel, login/cadastro indisponivel ou IA indisponivel para multiplos usuarios, pausar operacao e corrigir antes de qualquer melhoria.

## P1

* Rodar smoke autenticado em Preview/Producao.
* Validar Supabase RLS com dois usuarios reais.
* Aplicar migrations pendentes no Supabase real.
* Validar Stripe Checkout, Customer Portal e webhook assinado no ambiente final.
* Confirmar GitHub Actions verde no GitHub.
* Validar OpenAI e Resend no ambiente final sem expor secrets.
* Preencher metricas reais de ativacao, suporte, billing, feedback e custo OpenAI.

## P2

* Melhorar onboarding apenas com gargalos medidos.
* Melhorar templates por nicho apenas com uso real.
* Melhorar qualidade da IA com base em feedback agregado.
* Melhorar suporte/FAQ com base em perguntas recorrentes.
* Melhorar pricing apenas se houver duvida ou queda medida.
* Melhorar relatorios internos sem virar BI avancado.

## Ideias futuras

* melhorar relatorios
* melhorar segmentacao por nicho
* melhorar campanhas pequenas
* melhorar onboarding
* melhorar qualidade da IA
* melhorar templates
* melhorar admin
* melhorar suporte

## Nao fazer ainda

* integracao com WhatsApp
* envio automatico de mensagens
* CRM completo
* app mobile
* automacoes complexas
* campanha grande sem dados
