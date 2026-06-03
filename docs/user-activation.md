# Ativação de Usuários — AtendeZap IA

## Definição de usuário ativado
Um usuário pode ser considerado ativado quando:

- concluiu onboarding
- gerou pelo menos uma resposta
- copiou ou salvou uma resposta
- entendeu como reutilizar respostas/templates

## Objetivo do dashboard inicial
Levar o usuário até a primeira resposta útil no menor tempo possível.

## Não considerar ativação
- apenas criar conta
- apenas abrir dashboard
- apenas visitar pricing

## Sprint 2 da versao 1.2

- Dashboard inicial orienta o usuario a gerar a primeira resposta com o texto "Gere sua primeira resposta para cliente".
- Exemplos genericos e por nicho foram revisados para reduzir atrito antes da primeira resposta.
- Checklist de ativacao permanece visivel com onboarding, primeira resposta, copia, salvamento, templates, favoritos e planos.
- Apos a primeira resposta, o usuario recebe orientacao para copiar a resposta ou salvar na biblioteca para reutilizar.
- Templates recomendados e favoritas continuam como atalhos leves, sem CRM e sem automacao.

## Eventos de ativacao

Eventos seguros esperados:

- `activation_onboarding_completed`
- `activation_first_response_generated`
- `activation_response_copied`
- `activation_response_saved`
- `activation_template_viewed`
- `activation_template_saved`
- `activation_favorite_created`
- `activation_pricing_viewed`

Payload permitido:

- `businessType`
- `plan`
- `source`
- `category`
- `step`

Nao enviar:

- e-mail
- telefone
- pergunta do cliente
- resposta gerada
- token
- secret
- dados de pagamento

## Pendencias futuras

- Validar mobile em ambiente final.
- Medir com dados reais quantos usuarios concluem onboarding, geram primeira resposta, copiam/salvam e voltam em 7 dias.
- Ajustar textos ou exemplos apenas com evidencia agregada de gargalo.
