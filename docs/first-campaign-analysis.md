# Analise da Primeira Campanha - AtendeZap IA

## Status da campanha

- [x] Sem dados suficientes
- [ ] Campanha pausada
- [ ] Campanha com sinal positivo
- [ ] Campanha com gargalos claros
- [ ] Campanha pronta para nova rodada

## Resumo dos numeros

- visitantes:
- leads:
- cadastros:
- onboardings concluidos:
- primeiras respostas geradas:
- checkouts iniciados:
- assinaturas:
- feedbacks:
- bugs criticos:

## Principais taxas

- visitante -> lead:
- lead -> cadastro:
- cadastro -> onboarding:
- onboarding -> primeira resposta:
- primeira resposta -> checkout:
- checkout -> assinatura:

## Principais gargalos

- Sem dados reais preenchidos ainda. Use o admin, GA4/Meta Ads, Stripe e Supabase para preencher os numeros antes de concluir.

## Hipoteses

- Se houver poucos leads, o gargalo pode estar em publico, criativo, headline, CTA ou rota de destino.
- Se houver muitos leads e poucos cadastros, revisar a pagina de obrigado, a conexao entre ebook e produto e o CTA para criar conta.
- Se houver cadastros sem onboarding, revisar clareza do onboarding, promessa de valor e redirect apos cadastro.
- Se houver onboarding sem primeira resposta, revisar o dashboard inicial, exemplos e orientacao do campo principal.
- Se houver respostas sem checkout, revisar pricing, limite gratuito, valor percebido e CTA para plano.
- Se houver checkout sem assinatura, revisar preco, confianca, metodo de pagamento e eventos do webhook.

## Acoes recomendadas

- Preencher `docs/first-campaign-report.md` com numeros reais antes de decidir.
- Comparar UTMs no admin para identificar origem e campanha com melhor sinal.
- Priorizar P0/P1 em `docs/post-campaign-improvement-plan.md` antes de nova rodada.
- Rodar a segunda campanha com uma hipotese unica por vez.
- Para a segunda campanha, comparar variacoes por `utm_content` usando `docs/second-campaign-utm-links.md`.

## Decisao

- [ ] continuar
- [ ] pausar
- [x] ajustar e rodar nova campanha quando houver dados suficientes
- [ ] corrigir produto antes de investir mais

## Preparacao da segunda campanha

- Rota dedicada revisada: `/atendimento-whatsapp-ia`.
- Variações planejadas: demo, ebook, landing principal e Pro R$ 29.
- CTAs de campanha rastreados com eventos `campaign_*`.
- Admin passa a mostrar leads por criativo usando `utm_content`.
