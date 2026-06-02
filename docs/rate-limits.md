# Rate Limits - AtendeZap IA

## Objetivo

Proteger APIs sensiveis contra abuso.

## Rotas protegidas

- Demo publica: `/api/demo/generate-response`.
- Geracao de IA: `/api/ai/generate-response` e compatibilidade em `/api/generate-response`.
- Leads/ebook: `/api/ebook-lead`.
- Suporte: `/api/support`.
- Checkout Stripe: `/api/stripe/create-checkout-session`.
- Portal Stripe: `/api/stripe/create-portal-session`.
- Feedbacks: `/api/feedback` e `/api/cancellation-feedback`.
- Data requests: `/api/data-requests`.
- Admin: APIs em `/api/admin/*`.

## Mensagens para usuario

- Limite temporario: "Muitas tentativas em pouco tempo. Tente novamente depois."
- Demo excedida: "Voce atingiu o limite de testes gratuitos por enquanto. Crie uma conta para continuar usando."
- Limite mensal: "Voce atingiu o limite mensal do seu plano. Aguarde a renovacao do ciclo ou altere seu plano."

## Implementacao atual

O helper `src/lib/rate-limit.ts` usa Upstash Redis quando `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` existem. Sem essas variaveis, usa fallback em memoria para ambiente local/preview.

## Revisao Sprint 1 da versao 1.2

- Demo publica permanece com limite separado por IP.
- Geracao autenticada usa rate limit por IP e por usuario.
- Checkout e portal Stripe permanecem protegidos por rate limit.
- Eventos de rate limit registram metadata segura, sem IP completo em analytics e sem conteudo de usuario.

## Pendencias futuras

- Rate limit distribuido obrigatorio em producao.
- Alertas automaticos.
- Bloqueio por abuso.
- Painel avancado de seguranca.

