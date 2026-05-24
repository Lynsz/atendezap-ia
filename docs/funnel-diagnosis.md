# Diagnostico do Funil - AtendeZap IA

Use este documento junto com `docs/first-campaign-report.md` e o admin. Nao conclua gargalo com amostra pequena demais.

## Visitante -> Lead

Possiveis problemas:

- headline fraca
- promessa pouco clara
- publico errado
- criativo desalinhado
- CTA pouco visivel
- pagina lenta
- mobile ruim

Evidencias para conferir:

- visitas, cliques, CTR e CPC no canal de anuncio
- `landing_view`, `ebook_view` e `lead_success`
- taxa visitante -> lead
- comentarios ou mensagens no anuncio

## Lead -> Cadastro

Possiveis problemas:

- pagina de obrigado fraca
- CTA para conta pouco claro
- ebook nao conecta bem com produto
- falta de prova ou confianca

Evidencias para conferir:

- leads no admin
- cadastros no admin
- cliques nos eventos `thank_you_demo_cta_click`, `thank_you_signup_cta_click` e `thank_you_pricing_cta_click`
- taxa lead -> cadastro

## Cadastro -> Onboarding

Possiveis problemas:

- redirect confuso
- onboarding parece longo
- usuario nao entende por que preencher
- erro ao salvar

Evidencias para conferir:

- `signup_completed`
- `onboarding_started`
- `onboarding_completed`
- feedbacks de dificuldade de uso
- logs de erro no dashboard

## Onboarding -> Primeira resposta

Possiveis problemas:

- dashboard nao orienta bem
- campo principal pouco visivel
- exemplos fracos
- usuario nao sabe o que digitar

Evidencias para conferir:

- usuarios com onboarding concluido
- `first_response_generated`
- historico de respostas
- feedbacks depois da primeira resposta

## Primeira resposta -> Checkout

Possiveis problemas:

- valor percebido baixo
- CTA para plano pouco claro
- limite gratuito mal explicado
- pricing confuso

Evidencias para conferir:

- `first_response_generated`
- `checkout_click`
- `checkout_started`
- visitas em `/precos` e `/assinatura`
- duvidas recorrentes sobre planos

## Checkout -> Assinatura

Possiveis problemas:

- preco
- confianca
- checkout Stripe
- metodo de pagamento
- erro no webhook
- medo de assinatura

Evidencias para conferir:

- sessoes de checkout na Stripe
- eventos de webhook
- `subscriptions` no Supabase
- plano ativo em `/assinatura`
- feedbacks sobre pagamento ou cancelamento
