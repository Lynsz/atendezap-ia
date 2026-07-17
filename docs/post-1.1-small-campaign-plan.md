# Campanha Pequena Pós-1.1 — AtendeZap IA

## Status de execução

* Plano preparado de forma condicional.
* Campanha não iniciada e bloqueada até a validação dos critérios de início.

## Objetivo

Validar aquisição em pequena escala após a estabilidade da versão 1.1, medindo se novos usuários entendem o produto, criam conta, concluem onboarding, geram resposta e demonstram interesse nos planos.

## Público inicial

* autônomos
* MEIs
* pequenos negócios
* prestadores de serviço
* lojas pequenas
* profissionais de estética
* pessoas que atendem clientes pelo WhatsApp

## Escopo

* divulgação pequena
* convite manual
* posts orgânicos
* tráfego pago com orçamento baixo, somente depois de aprovação operacional explícita
* acompanhamento diário
* correção de P0/P1 reproduzido
* análise de ativação com dados agregados

## Fora do escopo

* campanha grande
* escala de tráfego
* automação de WhatsApp
* integração oficial com WhatsApp
* CRM completo
* app mobile
* promessa de resultado financeiro

## Critérios para iniciar

* CI verde, incluindo confirmação do GitHub Actions remoto
* produção estável e smoke autenticado aprovado
* nenhum P0 aberto
* P1 críticos controlados
* OpenAI funcionando no ambiente final
* Stripe funcionando em teste/produção conforme o ambiente
* suporte funcionando
* feedback funcionando
* admin protegido
* custo OpenAI sob controle e medido
* migration `0032_post_1_1_campaign_events.sql` aplicada

## Critérios de sucesso

* novos usuários chegam à landing
* usuários criam conta
* usuários concluem onboarding
* usuários geram primeira resposta
* usuários copiam ou salvam resposta
* usuários entendem que o app não envia WhatsApp automaticamente
* usuários acessam assinatura
* feedbacks indicam utilidade real

Os critérios são sinais a observar, não metas numéricas inventadas. Metas só devem ser definidas depois de confirmar uma linha de base real.

## Critérios de pausa

* erro 500 recorrente
* cadastro quebrado
* login quebrado
* onboarding quebrado
* dashboard quebrado
* IA falhando para múltiplos usuários
* salvar resposta quebrado
* checkout quebrado
* webhook quebrado
* admin exposto
* vazamento de dados
* custo OpenAI anormal
* feedback negativo recorrente sobre promessa ou entendimento do produto

## Sequência inicial

1. Fechar os bloqueadores de ambiente real.
2. Confirmar tracking seguro com a UTM `post_1_1_small_campaign`.
3. Começar somente com convite manual e publicações orgânicas.
4. Acompanhar diariamente produto, billing, suporte, feedback, segurança e custo.
5. Considerar tráfego pago baixo apenas após a primeira revisão sem alerta crítico.
