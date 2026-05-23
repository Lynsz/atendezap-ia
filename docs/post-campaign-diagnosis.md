# Diagnóstico Pós-Campanha — AtendeZap IA

## Objetivo

Entender onde o funil está funcionando e onde está travando.

Este diagnóstico deve ser feito depois de uma campanha pequena, usando dados reais do admin, GA4/Meta, Stripe, feedbacks e suporte. Se a amostra ainda for baixa, registrar a leitura como inconclusiva e manter o orçamento baixo.

## Etapas do funil analisadas

- visitante
- lead
- usuário cadastrado
- onboarding concluído
- primeira resposta gerada
- checkout iniciado
- assinatura ativa
- feedback enviado

## Gargalos possíveis

- baixa conversão da landing
- leads sem cadastro
- cadastro sem onboarding
- onboarding sem primeira resposta
- primeira resposta sem checkout
- checkout sem pagamento
- pagamento sem ativação correta
- feedbacks de dificuldade de uso

## Como decidir prioridade

- impacto na receita
- impacto na ativação
- frequência do problema
- esforço técnico
- risco de quebrar o produto

## Fontes para revisar

- `/admin`, seção de métricas e relatório de campanha
- `docs/campaign-analysis.md`
- `docs/campaign-daily-checklist.md`
- feedbacks recentes no admin
- leads por UTM
- subscriptions e eventos Stripe
- histórico de respostas geradas
- onboarding no dashboard
- landing, demo, ebook, obrigado e pricing

## Resultado esperado da análise

- maior gargalo identificado ou conclusão de dados insuficientes
- evidência usada para a decisão
- prioridade P0/P1/P2/P3
- primeira correção pequena a executar
- decisão sobre anúncios: continuar, ajustar ou pausar
