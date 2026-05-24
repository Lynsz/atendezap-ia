# Setup de Tracking - AtendeZap IA

Este documento complementa `docs/tracking.md` para a primeira campanha paga pequena.

## Variaveis

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

As variaveis sao opcionais e publicas. Se estiverem vazias, o app nao deve quebrar; os eventos continuam como no-op no navegador.

## Eventos essenciais da campanha

- `landing_view`
- `campaign_view`
- `campaign_demo_cta_click`
- `campaign_ebook_cta_click`
- `campaign_signup_cta_click`
- `campaign_pricing_cta_click`
- `campaign_pro_cta_click`
- `ebook_view`
- `lead_submit`
- `lead_success`
- `demo_view`
- `demo_response_success`
- `demo_signup_cta_click`
- `demo_pricing_cta_click`
- `demo_ebook_cta_click`
- `signup_completed`
- `onboarding_completed`
- `first_response_generated`
- `checkout_click`
- `checkout_started`
- `subscription_active`
- `feedback_submit`
- `thank_you_demo_cta_click`
- `thank_you_signup_cta_click`
- `thank_you_pricing_cta_click`

## UTMs obrigatorias nos links

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Use os modelos em `docs/campaign-utm-links.md` e `docs/second-campaign-utm-links.md`.

## Validacao antes da campanha

1. Abrir a landing com UTMs.
2. Navegar para `/ebook`, `/demo`, `/precos` e `/cadastro`.
3. Confirmar que as UTMs persistem em `localStorage`.
4. Enviar um lead de teste controlado.
5. Conferir UTMs no admin.
6. Iniciar checkout autenticado e conferir metadata da Stripe/Supabase.
7. Confirmar GA4 DebugView e Meta Events Manager, se configurados.
8. Na segunda campanha, conferir leads por `utm_content` no admin para comparar criativos e rotas.

## Limitacoes

- Visitantes anonimos dependem de GA4, Meta Pixel ou ferramenta externa.
- O admin nao recebe gasto de midia automaticamente.
- Custo por lead, cadastro, checkout e assinatura deve ser calculado manualmente no relatorio da campanha.
