# Plano do Beta Fechado - AtendeZap IA

## Objetivo

Validar se usuarios reais conseguem criar conta, configurar o negocio, gerar respostas uteis, copiar, salvar e entender os planos sem ajuda manual.

## Publico do beta

* 3 a 10 usuarios reais
* autonomos
* MEIs
* pequenos negocios
* pessoas que atendem pelo WhatsApp

## O que sera testado

* clareza da landing
* cadastro
* onboarding
* dashboard
* geracao de resposta
* copiar resposta
* salvar resposta
* biblioteca
* templates
* assinatura
* suporte
* feedback

## O que NAO sera testado

* campanha grande
* escala de trafego
* integracao com WhatsApp
* envio automatico de mensagens
* CRM completo
* app mobile

## Criterios de sucesso

* usuario cria conta sem ajuda
* usuario conclui onboarding
* usuario gera pelo menos 1 resposta
* usuario copia ou salva pelo menos 1 resposta
* usuario entende que o app nao envia WhatsApp automaticamente
* usuario consegue enviar feedback
* nenhum bug P0 aparece

## Criterios de pausa

* cadastro quebrado
* login quebrado
* onboarding quebrado
* IA quebrada
* resposta nao salva
* admin acessivel para usuario comum
* vazamento de dado ou secret
* checkout quebrado de forma critica
* erro 500 recorrente em rota critica

## Decisao apos beta

* corrigir bugs
* repetir beta
* iniciar lancamento pequeno
* bloquear lancamento

## Leitura dos relatorios atuais

Arquivos lidos nesta preparacao:

* `docs/security-final-validation-report.md`
* `docs/local-mvp-validation-report.md`
* `docs/openai-usage-validation-report.md`
* `docs/stripe-billing-validation-report.md`
* `docs/supabase-rls-validation-report.md`
* `docs/ci-validation-report.md`
* `README.md`
* `CHANGELOG.md`

Arquivos solicitados que nao existem com o nome exato no repositorio atual:

* `docs/post-deploy-smoke-test-report.md`
* `docs/production-smoke-test-final.md`
* `docs/vercel-deploy-validation-report.md`

Relatorios equivalentes existentes para uso operacional antes do convite:

* `docs/post-deploy-smoke-test.md`
* `docs/production-smoke-test.md`
* `docs/vercel-deploy-checklist.md`
* `docs/deploy-readiness-report.md`

## Bloqueadores para iniciar o beta

Nao ha P0/P1 de codigo documentado como pendente nos relatorios lidos. Antes de convidar usuarios reais, validar no ambiente real:

* Supabase Auth funcionando com cadastro e login reais.
* Migrations aplicadas no Supabase de staging/producao, incluindo RLS.
* OpenAI configurada e rota autenticada gerando resposta real.
* Stripe em modo teste funcionando, caso assinatura seja testada.
* Admin acessivel apenas por `ADMIN_EMAILS`.
* Suporte e feedback gravando sem expor dados sensiveis.

## Riscos conhecidos

* `supabase/schema.sql` esta atrasado em relacao as migrations incrementais; usar migrations como fonte de deploy ate regenerar o snapshot.
* Validacao de RLS foi local/estatica e ainda precisa de smoke test com dois usuarios reais.
* Smoke test autenticado local anterior ficou pendente por falha de Supabase Auth local.
* OpenAI e Stripe dependem de secrets reais configurados somente na Vercel ou em `.env.local`.
* A rota antiga de integracao WhatsApp em modo demo pode confundir usuarios se for compartilhada; nao usar essa rota no beta fechado.

## Pontos confusos no fluxo

* Reforcar no convite, landing, dashboard e perguntas do beta que o app gera texto para copiar, ajustar e enviar manualmente.
* Nao apresentar a rota de integracao WhatsApp como parte do beta.
* Explicar que a assinatura pode ser apenas verificada ou testada em modo teste, sem campanha publica.

## Pendencias de tracking

Eventos seguros adicionados/validados para o beta:

* `beta_signup_completed`
* `beta_onboarding_completed`
* `beta_first_response_generated`
* `beta_response_copied`
* `beta_response_saved`
* `beta_template_used`
* `beta_pricing_viewed`
* `beta_feedback_submitted`
* `beta_support_request_created`

Metadata permitida:

* `business_type`
* `plan`
* `source`
* `page`
* `category`
* `usage_count`
* `usage_limit`
* `response_length_range`

Metadata proibida:

* mensagem completa do cliente
* resposta completa da IA
* e-mail
* telefone
* dados de pagamento
* tokens
* secrets

## Pendencias de suporte e feedback

* Validar em Preview/Producao que `/suporte` grava chamado e retorna sucesso amigavel.
* Validar que feedback de resposta aparece depois da IA gerar uma resposta e aceita util/nao util com comentario opcional.
* Acompanhar feedbacks negativos diariamente durante o beta.

## Pendencias de copy

* Landing ja informa que o AtendeZap IA gera respostas para copiar, ajustar e enviar, sem envio automatico.
* Pricing ja evita promessa de resultado financeiro garantido.
* Dashboard ja reforca revisao e envio manual pelo WhatsApp.
* Convite do beta deve repetir que nao ha envio automatico nem integracao direta com WhatsApp.
