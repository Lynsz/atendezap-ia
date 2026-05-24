# Liberacao para Primeiros Usuarios

Use este plano depois do go-live tecnico, antes de qualquer escala de anuncios.

## Quantidade inicial

- Liberar para 3 a 5 pessoas.
- Preferir convite direto, com acompanhamento manual.
- Evitar trafego frio em volume alto nesta fase.

## Perfil ideal

- Autonomo.
- Prestador de servico.
- Pequeno negocio.
- Pessoa que atende pelo WhatsApp.
- Usuario que responde clientes manualmente e sente demora no atendimento.

## O que observar

- Se entende a landing.
- Se cria conta sozinho.
- Se conclui onboarding.
- Se gera a primeira resposta.
- Se copia/adapta a resposta.
- Se entende os planos.
- Se considera pagar.
- Se encontra bugs.
- Se entende a oferta do Pro: primeiro mes por R$ 29 para novos usuarios.

## Como coletar feedback

- Formulario de feedback do app.
- Contato direto por WhatsApp/e-mail.
- Admin.
- Metricas de uso.
- Logs de erro da Vercel.
- Eventos de tracking, quando configurados.

## Perguntas recomendadas

- O que voce esperava que acontecesse?
- Onde voce travou?
- A primeira resposta gerada foi util?
- Voce usaria isso na rotina real de atendimento?
- Qual plano faria sentido para voce?
- O que impediria voce de pagar?

## Criterio para continuar

- Usuarios conseguem usar sem ajuda.
- Primeira resposta e gerada.
- Onboarding salva corretamente.
- Nao ha bugs criticos.
- Pelo menos um usuario demonstra intencao real de pagar.
- Admin mostra dados suficientes para acompanhar o funil.

## Criterio para pausar

- Cadastro quebra.
- Login quebra.
- IA nao responde.
- Checkout quebra.
- Webhook nao libera plano.
- E-mail do ebook falha sem registro.
- Erros criticos no dashboard.
- Usuario comum acessa admin ou dados de outro usuario.

## Rotina dos primeiros dias

1. Verificar logs da Vercel diariamente.
2. Revisar leads, feedbacks e assinaturas no admin.
3. Conferir falhas de e-mail.
4. Conferir uso OpenAI.
5. Conferir eventos Stripe.
6. Corrigir bugs P0/P1 antes de convidar mais pessoas.
