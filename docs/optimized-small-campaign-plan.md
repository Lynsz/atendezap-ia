# Plano da Campanha Pequena Otimizada

Status: pronta para validacao manual antes de ligar trafego.
Escopo: campanha pequena, privada, com orcamento baixo e sem escala automatica.

## Premissa

Os documentos pos-go-live ainda indicam `Sem dados suficientes`. Portanto, esta campanha nao parte de um nicho vencedor comprovado. Ela testa uma hipotese mais clara: pequenos negocios que recebem perguntas repetidas no WhatsApp podem perceber valor quando veem uma resposta pronta antes de comprar.

## Hipotese

Se a campanha levar visitantes para uma pagina por nicho com CTA direto para demo, entao parte dos visitantes deve:

- abrir a pagina por nicho
- clicar na demo
- gerar ou visualizar uma resposta segura
- iniciar cadastro ou abrir planos

## Publico inicial

Prioridade de teste:

1. Delivery: operacao diaria, muitas perguntas repetidas, valor facil de demonstrar.
2. Estetica: atendimento consultivo, agendamento e objecoes frequentes.

Nao declarar nicho vencedor antes de dados reais. Se so houver verba para uma variacao, iniciar por delivery como hipotese operacional, nao como conclusao.

## Oferta

Promessa permitida:

- gerar sugestoes de respostas para revisar, copiar e enviar manualmente
- reduzir tempo em perguntas repetidas
- testar pela demo antes de assinar

Promessas proibidas:

- envio automatico no WhatsApp
- chatbot conectado ao WhatsApp
- resultado garantido de vendas
- atendimento humano substituido

## Rota recomendada

Rota principal:

- `/para/delivery`

Rotas de apoio:

- `/demo`
- `/ebook`
- `/precos`

## Eventos principais

- `optimized_campaign_page_view`
- `optimized_campaign_cta_click`
- `niche_page_view`
- `niche_demo_cta_click`
- `demo_view`
- `demo_response_success`
- `demo_signup_cta_click`
- `pricing_view`
- `checkout_click`
- `checkout_started`
- `signup_completed`
- `first_response_generated`

## Criterio de sucesso

Continuar com cautela somente se houver pelo menos:

- tracking com UTMs visiveis
- cliques em CTA a partir da pagina por nicho
- visitantes chegando na demo ou planos
- nenhum erro critico em checkout, login, webhook, IA ou admin

## Criterio de pausa

Pausar se:

- `optimized_campaign_page_view` ou `optimized_campaign_cta_click` nao aparecerem quando a UTM oficial for usada
- muitos cliques nao gerarem nenhum sinal posterior
- a IA consumir custo sem ativacao
- checkout ou webhook falhar
- suporte receber bug critico recorrente
- houver qualquer suspeita de exposicao de dados

## Decisao ao final

Preencher `docs/optimized-campaign-report.md`.

Opcoes:

- manter baixo orcamento e ajustar copy
- trocar nicho mantendo estrutura
- pausar para corrigir funil
- liberar nova campanha pequena somente com dados suficientes
