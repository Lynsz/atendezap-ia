# Tracking Producao

Tracking deve ajudar a validar o funil sem coletar dados pessoais desnecessarios.

## GA4

- [ ] Criar ou revisar propriedade GA4.
- [ ] Configurar dominio final.
- [ ] Configurar `NEXT_PUBLIC_GA_MEASUREMENT_ID` na Vercel Production.
- [ ] Abrir DebugView.
- [ ] Confirmar page views.
- [ ] Confirmar eventos principais.

## Meta Pixel

- [ ] Criar ou revisar Pixel.
- [ ] Configurar dominio final no Events Manager.
- [ ] Configurar `NEXT_PUBLIC_META_PIXEL_ID` na Vercel Production.
- [ ] Testar com Meta Pixel Helper ou Events Manager.
- [ ] Confirmar `PageView`.
- [ ] Confirmar `Lead`.
- [ ] Confirmar `InitiateCheckout`.

## UTMs

- [ ] Abrir `/ebook?utm_source=meta&utm_medium=cpc&utm_campaign=producao_controlada`.
- [ ] Enviar lead.
- [ ] Confirmar UTMs salvas no Supabase.
- [ ] Iniciar checkout com UTM preservada.
- [ ] Confirmar metadata de checkout quando aplicavel.

## Eventos principais

- [ ] `lead_success`.
- [ ] `checkout_started`.
- [ ] `onboarding_completed`.
- [ ] `first_response_generated`.
- [ ] `demo_response_success`.
- [ ] `signup_started`.

## Privacidade

- Nao enviar chave secreta, token, prompt sensivel ou resposta completa para analytics.
- Evitar enviar telefone/e-mail como propriedade de evento.
- Validar Termos e Privacidade antes de anuncios.
