# Plano de validacao com anuncios pequenos - AtendeZap IA

## Objetivo da campanha

Validar se pessoas entendem a oferta, entram no funil e conseguem experimentar o AtendeZap IA antes de aumentar investimento em trafego pago.

A campanha inicial deve responder:

- A promessa da landing/campanha ficou clara?
- A pessoa entende que a IA gera respostas para copiar, ajustar e enviar pelo WhatsApp?
- Leads usam a demo ou baixam o guia?
- Cadastros concluem onboarding?
- Usuarios geram a primeira resposta?
- Alguem inicia checkout ou demonstra intencao real de pagar?

## Publico inicial

- Autonomos.
- Prestadores de servico.
- Pequenos negocios.
- Estetica.
- Delivery.
- Lojas pequenas.
- Assistencia tecnica.
- Vendedores pelo WhatsApp.

## Rotas para anuncio

- Landing: `/`
- Pagina direta de campanha: `/atendimento-whatsapp-ia`
- Demo: `/demo`
- Ebook: `/ebook`
- Pricing: `/precos`

Use UTMs em todos os links de anuncio:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

## Eventos para acompanhar

- Visitantes: GA4/Meta Pixel via `page_view`, `landing_view`, `campaign_view`, `pricing_view` e `demo_view`.
- Leads: `lead_submit`, `lead_success`, `lead_error`.
- Demo usada: `demo_generate_click`, `demo_response_success`, `demo_response_error`.
- Cadastro: `signup_started`, `signup_completed`.
- Onboarding: `onboarding_started`, `onboarding_completed`.
- Primeira resposta: `first_response_generated`.
- Checkout: `plan_click`, `checkout_click`, `checkout_started`, `checkout_error`.
- Assinatura: `subscription_active`.
- Feedback: `feedback_submit`, `feedback_success`, `feedback_error`.

Se `NEXT_PUBLIC_GA_MEASUREMENT_ID` ou `NEXT_PUBLIC_META_PIXEL_ID` nao estiverem configurados, o app nao deve quebrar; apenas os eventos externos nao aparecem nas plataformas.

## Metricas de atencao

- Custo por lead.
- Taxa de lead.
- Custo por cadastro.
- Taxa de cadastro.
- Taxa de onboarding.
- Taxa de primeira resposta.
- Taxa de checkout iniciado.
- Custo por checkout iniciado.
- Feedbacks de dificuldade de uso.
- Assinaturas ativas.

Custos dependem do gasto informado pela plataforma de anuncio. O admin mostra funil, UTMs, leads, checkouts aproximados, assinaturas e feedbacks; custo por etapa deve ser calculado combinando gasto da campanha com esses numeros.

## Como usar o relatorio de campanha

No admin, abra a secao "Relatorio de campanha".

Use os filtros:

- Periodo: comece por "ultimos 7 dias" durante a campanha.
- `utm_source`: separe Meta, Google, orgânico ou outros canais.
- `utm_campaign`: compare campanhas pequenas sem misturar criativos diferentes.

Olhe primeiro:

- Leads totais e leads por UTM.
- Lead -> cadastro.
- Cadastro -> onboarding.
- Onboarding -> primeira resposta.
- Checkout iniciado.
- Assinatura ativa.
- Feedbacks de dificuldade de uso.

O bloco de interpretacao do admin usa regras simples e nao substitui a leitura manual. Se aparecer "Sem dados suficientes", mantenha orcamento baixo ate ter amostra minima ou evidencias qualitativas.

## Quando pausar anuncios

- Checkout quebrado.
- Webhook Stripe sem ativar assinatura apos pagamento teste.
- Lead nao salva no Supabase.
- Cadastro ou login falhando.
- Onboarding nao salva.
- IA nao gera resposta.
- Pixel/GA4 nao registra eventos depois de configurado.
- Custo alto sem nenhum lead apos amostra minima.
- Feedback P0/P1 recorrente de usuarios novos.

## Quando ajustar copy, oferta ou produto

Ajuste copy ou criativo quando houver muitos visitantes e poucos leads.

Ajuste pagina de obrigado, CTA ou proposta de valor quando houver leads, mas poucos cadastros, visitas a demo ou cliques para planos.

Ajuste onboarding ou dashboard quando houver cadastros, mas poucos onboardings ou poucas primeiras respostas.

Ajuste preco, prova de confianca ou checkout quando houver checkouts iniciados, mas poucas assinaturas.

## Quando aumentar orcamento

So aumentar depois de alguns dias com:

- Lead chegando com UTM limpa.
- Cadastro e onboarding funcionando.
- Usuarios gerando primeira resposta.
- Nenhum bloqueador de checkout, webhook, IA ou Supabase.
- Algum sinal de intencao real de pagamento: checkout iniciado, pergunta sobre plano ou assinatura.

Mesmo com bons sinais, aumentar aos poucos. Esta etapa e de validacao comercial, nao escala.

## Rotina diaria durante a campanha

1. Conferir Vercel/Sentry para erros.
2. Conferir leads no admin e UTMs.
3. Conferir uso da demo e respostas geradas.
4. Conferir cadastros, onboarding e primeira resposta.
5. Conferir checkout iniciado e assinatura ativa.
6. Ler feedbacks recentes.
7. Pausar campanha se surgir bloqueador P0.

Use tambem `docs/campaign-daily-checklist.md` para registrar a rotina diaria e `docs/campaign-analysis.md` para interpretar a decisao pos-campanha.
