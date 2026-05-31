# Fluxo de Feedback - AtendeZap IA

## Objetivo

Coletar, classificar e priorizar feedbacks dos usuários para melhorar o produto com base em dados reais.

## Fontes de feedback

- avaliação de respostas da IA
- solicitações de suporte
- feedback de cancelamento
- campanhas
- métricas de ativação
- métricas de uso
- entrevistas manuais
- observações internas

## Tipos de feedback

- bug
- dúvida
- melhoria
- reclamação
- pedido de funcionalidade
- problema de preço
- problema de onboarding
- problema de qualidade da IA
- problema de assinatura
- sugestão de campanha

## Processo

- coletar
- classificar
- priorizar
- transformar em tarefa
- implementar
- validar
- documentar aprendizado

## Fontes já existentes no produto

- `user_feedback`: bugs, dúvidas, sugestões, elogios e dificuldade de uso.
- `ai_response_feedback`: qualidade percebida das respostas da IA, sem enviar conteúdo completo para analytics.
- `support_requests`: dúvidas recorrentes, bugs operacionais e problemas de cobrança ou acesso.
- `cancellation_feedback`: motivos de churn e percepção de valor.
- `campaign_experiments` e `campaign_results`: aprendizados por nicho, canal, criativo e UTM.
- `events`: eventos internos seguros sobre ativação, checkout, limites e falhas.
- admin de métricas: sinais agregados de ativação, uso, suporte, churn e campanha.
- `docs/roadmap-post-1.0.md`: decisões e limites de escopo.

## Regras de registro

- registrar apenas resumo operacional
- não copiar conversas completas
- não copiar respostas completas de IA
- não registrar e-mail, dados de pagamento, secrets ou tokens
- transformar padrões recorrentes em `product_insights`
- manter CRM, WhatsApp direto e automações complexas fora do escopo atual
