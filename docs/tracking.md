# Tracking de marketing

Esta base mede o funil de trafego pago sem exigir Google Analytics ou Meta Pixel no ambiente local.

## Variaveis

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

As duas variaveis sao opcionais e publicas. Se estiverem vazias, o app nao carrega scripts externos e as chamadas de tracking viram no-op.

## Eventos rastreados

- `page_view`: mudanca de rota no App Router.
- `landing_view`: abertura da landing principal.
- `campaign_view`: abertura da pagina direta de campanha.
- `campaign_demo_cta_click`: clique da pagina de campanha para demo.
- `campaign_ebook_cta_click`: clique da pagina de campanha para ebook.
- `campaign_signup_cta_click`: clique da pagina de campanha para cadastro.
- `campaign_pricing_cta_click`: clique da pagina de campanha para planos.
- `campaign_pro_cta_click`: clique da pagina de campanha na oferta do Pro.
- `niche_page_view`: abertura de pagina publica por nicho.
- `niche_demo_cta_click`: clique de pagina por nicho para demo.
- `niche_signup_cta_click`: clique de pagina por nicho para cadastro.
- `niche_ebook_cta_click`: clique de pagina por nicho para ebook.
- `niche_pricing_cta_click`: clique de pagina por nicho para planos.
- `niche_faq_opened`: abertura de FAQ em pagina por nicho.
- `plan_click`: clique em um plano.
- `demo_view`: abertura da demo publica.
- `demo_response_success`: demo gerou resposta ou fallback controlado.
- `ebook_view`: abertura da pagina `/ebook`.
- `lead_submit`: envio do formulario do ebook.
- `lead_success`: lead salvo com sucesso e chegada na pagina de obrigado.
- `lead_error`: falha no envio do lead.
- `thank_you_view`: abertura de `/ebook/obrigado`.
- `thank_you_cta_click`: clique no CTA principal da pagina de obrigado.
- `thank_you_demo_cta_click`: clique da pagina de obrigado para a demo.
- `thank_you_signup_cta_click`: clique da pagina de obrigado para cadastro.
- `thank_you_pricing_cta_click`: clique da pagina de obrigado para planos.
- `demo_signup_cta_click`: clique da demo para cadastro.
- `demo_pricing_cta_click`: clique da demo para planos.
- `demo_ebook_cta_click`: clique da demo para o ebook.
- `pricing_view`: visualizacao da area/pagina de planos.
- `checkout_click`: clique em um plano.
- `checkout_started`: sessao Stripe criada com sucesso.
- `checkout_error`: falha ao iniciar checkout.
- `subscription_page_view`: visualizacao da pagina de assinatura.
- `stripe_portal_opened`: abertura do portal Stripe.
- `failed_payment_notice_viewed`: aviso de pagamento falho exibido.
- `cancellation_feedback_submitted`: feedback opcional de cancelamento enviado.
- `subscription_status_changed`: reservado para mudancas de status agregadas, sem ids Stripe.
- `plan_limit_reached`: reservado para limite mensal atingido.
- `signup_started`: inicio de cadastro.
- `signup_completed`: cadastro criado.
- `onboarding_started`: inicio do onboarding.
- `onboarding_completed`: onboarding finalizado.
- `first_response_generated`: primeira resposta gerada no dashboard.
- `activation_onboarding_completed`: etapa de onboarding concluida no checklist inicial.
- `activation_first_response_generated`: primeira resposta gerada na ativacao.
- `activation_response_copied`: usuario copiou uma resposta sem enviar conteudo da resposta.
- `activation_response_saved`: usuario salvou uma resposta na biblioteca.
- `activation_template_viewed`: usuario abriu templates prontos.
- `activation_template_saved`: usuario salvou um template na biblioteca.
- `activation_favorite_created`: usuario marcou uma resposta como favorita.
- `activation_pricing_viewed`: usuario abriu planos/pricing a partir da ativacao.
- `subscription_active`: dashboard carregado com assinatura ativa.
- `feedback_submit`: envio de feedback.
- `feedback_success`: feedback salvo.
- `feedback_error`: falha ao salvar feedback.
- `feedback_cta_click`: clique em CTA para feedback.
- `admin_campaign_created`: campanha interna criada por admin, sem payload sensivel.
- `admin_campaign_updated`: campanha interna atualizada por admin, sem observacoes completas.
- `admin_campaign_result_recorded`: resultado manual agregado registrado por admin.
- `admin_campaign_decision_updated`: decisao final da campanha atualizada por admin.
- `product_insight_created`: insight de produto criado por admin, sem descrição completa.
- `product_insight_updated`: insight de produto atualizado por admin.
- `product_insight_status_changed`: status de insight alterado por admin.
- `product_backlog_reviewed`: reservado para revisão manual do backlog.

Eventos `admin_campaign_*` são eventos internos persistidos via tabela `events`, não eventos enviados ao GA4/Meta pelo client. A metadata deve ficar limitada a status, canal, nicho, ids tecnicos e flags agregadas.

Eventos `product_insight_*` também são internos/admin. Não enviar e-mail, descrição completa, resposta completa, dados de pagamento, secrets ou payload de suporte.

## Mapeamento externo

GA4 recebe eventos customizados com os mesmos nomes, exceto `checkout_started`, enviado tambem como `begin_checkout`.

Meta Pixel recebe:

- `PageView` para page views.
- `ViewContent` em `ebook_view`.
- `Lead` em `lead_success`.
- `Lead` em `demo_response_success`.
- `InitiateCheckout` em `checkout_started`.
- `CompleteRegistration` em `signup_completed`.
- `Subscribe` em `subscription_active`.

## UTMs

O app captura e preserva por ate 30 dias:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

As UTMs ficam em `localStorage` na chave `atendezap_ia_utm_attribution_v1`. O formulario do ebook e o checkout Stripe usam as UTMs atuais da URL ou, se nao houver, as UTMs salvas.

No checkout, o backend inclui em metadata da Stripe apenas campos de atribuicao seguros: UTMs, `funnel`, `source` e `plan`. Nunca envie senha, cartao, token, perguntas privadas ou conteudo gerado em metadata.

Nas paginas por nicho, os eventos enviam apenas metadados seguros como `niche`, `cta`, `source` e `faq_index`. Nao envie pergunta do cliente, resposta gerada, e-mail ou dados sensiveis.

Na segunda campanha, use `utm_content` para diferenciar variacoes como `demo_criativo_1`, `ebook_criativo_1`, `landing_criativo_1` e `pro_29_criativo_1`.

## Como testar sem GA4 ou Meta Pixel

1. Deixe `NEXT_PUBLIC_GA_MEASUREMENT_ID` e `NEXT_PUBLIC_META_PIXEL_ID` vazias.
2. Rode `npm run dev`.
3. Acesse `/ebook?utm_source=meta&utm_medium=cpc&utm_campaign=teste&utm_content=criativo_1&utm_term=whatsapp`.
4. Abra DevTools e confira `localStorage.atendezap_ia_utm_attribution_v1`.
5. Envie o formulario do ebook e confirme que a API recebe/salva as UTMs.
6. Acesse `/ebook/obrigado`, clique no CTA, abra `/precos` e clique em um plano.
7. O app deve continuar sem erros mesmo sem scripts externos.

## Como testar com GA4 e Meta Pixel

1. Configure `NEXT_PUBLIC_GA_MEASUREMENT_ID` e/ou `NEXT_PUBLIC_META_PIXEL_ID`.
2. Rode `npm run dev`.
3. No GA4, use DebugView ou Realtime para verificar `page_view`, `ebook_view`, `lead_success` e `begin_checkout`.
4. No Meta Events Manager, use Test Events para verificar `PageView`, `ViewContent`, `Lead` e `InitiateCheckout`.
5. Confirme que os payloads nao contêm dados sensiveis.

## Comandos de validacao

```bash
npm run lint
npm run typecheck
npm run build
npm run dev
```
