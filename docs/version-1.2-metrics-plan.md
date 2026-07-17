# Plano de Métricas — Versão 1.2 AtendeZap IA

## Objetivo

Melhorar a medição do funil sem salvar dados sensíveis e sem tratar ausência de dados como resultado.

## Métricas principais

* visitantes
* cliques em cadastro
* cadastros concluídos
* onboardings iniciados
* onboardings concluídos
* dashboards visualizados
* primeiras respostas geradas
* respostas copiadas
* respostas salvas
* templates usados
* biblioteca acessada
* assinatura visualizada
* checkouts iniciados
* assinaturas concluídas por estado agregado do billing
* feedbacks enviados
* suportes abertos
* limites atingidos
* custo OpenAI na mesma janela do volume de respostas

## Eventos seguros

* `campaign_landing_viewed`
* `campaign_signup_clicked`
* `signup_completed`
* `onboarding_started`
* `onboarding_completed`
* `dashboard_viewed`
* `first_response_generated`
* `response_copied`
* `response_saved`
* `template_copied` e `template_saved`
* `library_viewed`
* `pricing_viewed`
* `checkout_started` e `checkout_completed`
* `ai_response_feedback_submitted`
* `support_request_created`
* `usage_limit_reached`

Nomes finais devem usar a allowlist já existente ou migration revisada; duplicidades e aliases devem ser normalizados antes de novos eventos.

## Metadata permitida

* utm_source
* utm_medium
* utm_campaign
* utm_content
* business_type
* plan
* page
* category
* usage_count
* usage_limit
* response_length_range
* feedback_rating
* feedback_reason

## Metadata proibida

* mensagem completa
* resposta completa
* e-mail
* telefone
* dados de pagamento
* tokens
* secrets
* payload completo Stripe

## Lacunas atuais

* Persistência dos eventos no ambiente final não comprovada.
* Métricas reais, usuários únicos, período e baseline não disponíveis.
* Abertura da biblioteca e uso de templates precisam de definição consolidada.
* Assinatura concluída e custo OpenAI não possuem análise real na mesma janela.
* Funil autenticado, RLS e admin não foram validados com usuários reais.

## Melhorias para 1.2

* Criar dicionário de métricas com evento, fonte, janela, filtro e disponibilidade.
* Validar migration/allowlist e tolerância a falhas em Production.
* Evitar dupla contagem por aliases e distinguir eventos de teste.
* Exibir `não disponível` quando uma fonte falhar ou não estiver validada.
* Consolidar agregados por período e UTM sem texto livre ou identificação pessoal.
* Medir custo OpenAI externamente e correlacionar apenas com volume agregado.
