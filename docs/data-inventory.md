# Inventario de Dados - AtendeZap IA

## Usuarios
- e-mail
- id interno
- data de criacao
- dados de autenticacao gerenciados pelo Supabase

Obrigatorios: e-mail, id interno e dados de autenticacao necessarios para login.

Opcionais: nome exibido no perfil, quando informado.

## Perfil/onboarding
- tipo de atuacao
- tom de atendimento
- informacoes do negocio
- preferencias de resposta
- canal principal
- horario de atendimento
- produtos, servicos e perguntas frequentes

Obrigatorios: dados minimos para gerar respostas uteis.

Opcionais: endereco, formas de pagamento, link de agendamento/pagamento e informacoes adicionais.

## Leads
- e-mail
- origem UTM
- status de envio do ebook
- nome, WhatsApp e tipo de negocio quando enviados no formulario

Obrigatorios: e-mail e campos minimos do formulario publico.

Opcionais: WhatsApp, UTMs e contexto de campanha.

## Assinaturas
- plano
- status
- customer id Stripe
- subscription id Stripe
- datas de renovacao/cancelamento
- limite mensal
- uso mensal local

Stripe e fonte de verdade para pagamentos. O Supabase guarda o estado operacional sincronizado.

## IA
- pergunta usada para gerar resposta
- resposta gerada, se o historico salvar
- tipo de resposta
- feedback da resposta
- tipo de atuacao e tom usados na geracao

Esses dados existem para historico, limite mensal, melhoria de qualidade e reutilizacao pelo usuario.

## Respostas salvas
- titulo
- conteudo
- categoria
- favorito
- origem
- contador simples de copia
- data de criacao
- data de atualizacao

Usuario deve acessar apenas as proprias respostas salvas.

## Feedbacks
- tipo de feedback
- mensagem
- pagina/origem/contexto
- e-mail ou usuario, quando informado
- status operacional

Admin usa esses dados para suporte e melhoria do produto.

## Eventos internos
- nome do evento
- origem
- metadados seguros
- data

Eventos internos nao devem armazenar prompt completo, resposta completa, payload completo, token, chave ou dado de pagamento sensivel.

## Logs
- rota
- evento
- status
- erro resumido
- id parcial de usuario, quando necessario
- metadados sanitizados

Logs nao devem conter mensagem completa do cliente, resposta completa da IA, e-mail completo, tokens, secrets ou dados de pagamento.

## Admin
- metricas agregadas
- leads capturados
- assinaturas e status
- feedbacks recentes
- solicitacoes de exportacao/exclusao

Admin deve ser acessado apenas por rota protegida e com e-mail autorizado.

## Integracoes externas
- Supabase: autenticacao, banco de dados, RLS e dados operacionais.
- Stripe: cliente, assinatura, status, pagamentos, cancelamentos e portal de cobranca.
- OpenAI: recebe contexto necessario para gerar resposta.
- Resend: recebe e-mail e conteudo necessario para envio de mensagens transacionais.
- Analytics/tracking: recebe apenas eventos e metadados seguros, como event_name, source, plan, category, businessType e UTMs.

## Dados enviados para Stripe
- id interno do usuario
- e-mail do usuario, quando usado para criar cliente
- plano escolhido
- metadata segura de checkout
- UTMs sanitizadas

Nao enviar conteudo de resposta, pergunta do cliente, secrets ou dados sensiveis desnecessarios.

## Dados enviados para Resend
- e-mail do destinatario
- nome, quando necessario para personalizacao simples
- conteudo transacional do e-mail

Nao salvar conteudo sensivel desnecessario em logs.

## Dados enviados para OpenAI
- pergunta do cliente
- contexto do negocio
- tipo de resposta
- tom/preferencias necessarias para gerar resposta

Evitar enviar dados sensiveis desnecessarios no prompt.

## Dados enviados para analytics/tracking
- event_name
- source
- plan
- category
- businessType
- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_term

Nao enviar e-mail, telefone, mensagem do cliente, resposta completa, tokens, secrets, dados de pagamento ou documentos pessoais.

## Dados que nao devem ser armazenados
- senha em texto puro
- cartao de credito
- chaves de API
- documentos pessoais desnecessarios
- conversas completas sensiveis sem necessidade
- dados de pagamento sensiveis
