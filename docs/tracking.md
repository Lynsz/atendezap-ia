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
- `ebook_view`: abertura da pagina `/ebook`.
- `lead_submit`: envio do formulario do ebook.
- `lead_success`: lead salvo com sucesso e chegada na pagina de obrigado.
- `lead_error`: falha no envio do lead.
- `thank_you_view`: abertura de `/ebook/obrigado`.
- `thank_you_cta_click`: clique no CTA principal da pagina de obrigado.
- `pricing_view`: visualizacao da area/pagina de planos.
- `checkout_click`: clique em um plano.
- `checkout_started`: sessao Stripe criada com sucesso.
- `checkout_error`: falha ao iniciar checkout.
- `signup_started`: inicio de cadastro.
- `signup_completed`: cadastro criado.
- `onboarding_started`: inicio do onboarding.
- `onboarding_completed`: onboarding finalizado.
- `subscription_active`: dashboard carregado com assinatura ativa.

## Mapeamento externo

GA4 recebe eventos customizados com os mesmos nomes, exceto `checkout_started`, enviado tambem como `begin_checkout`.

Meta Pixel recebe:

- `PageView` para page views.
- `ViewContent` em `ebook_view`.
- `Lead` em `lead_success`.
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
