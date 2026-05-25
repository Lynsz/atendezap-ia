# AtendeZap IA - Versao 1.0

## Status

- MVP validado.
- Pronto para producao controlada.
- Pronto para campanhas pequenas, desde que os checklists de ambiente real estejam verdes.
- Pronto para escala cautelosa apenas como plano operacional gradual.
- Ainda nao pronto para escala ampla ou aumento agressivo de midia.

## O que a versao 1.0 inclui

- Landing page.
- Demo publica.
- Ebook gratuito.
- Captura de leads.
- Envio do ebook por e-mail.
- Cadastro/login.
- Onboarding.
- Geracao de respostas com IA.
- Historico.
- Limite mensal.
- Planos Starter, Pro e Premium.
- Stripe Checkout.
- Stripe Customer Portal.
- Webhook Stripe.
- Dashboard de assinatura.
- Admin.
- Metricas basicas.
- Feedback.
- Tracking.
- Paginas legais.

## O que nao faz parte da versao 1.0

- Envio automatico direto pelo WhatsApp.
- CRM completo.
- Multiplos atendentes.
- Automacoes avancadas.
- Integracoes externas avancadas.
- Testes A/B automaticos.
- Nutricao avancada por e-mail.

## Publico-alvo

- Autonomos.
- Prestadores de servico.
- Pequenos negocios.
- Lojas pequenas.
- Delivery.
- Estetica.
- Assistencia tecnica.
- Restaurantes.
- Vendedores pelo WhatsApp.

## Oferta principal

- Starter.
- Pro recomendado.
- Premium.
- Pro com primeiro mes por R$ 29 para novos usuarios.

## Escopo operacional

A versao 1.0 deve ser operada como produto simples de respostas assistidas por IA. O usuario cadastra o negocio, cola a pergunta recebida, revisa a sugestao gerada, copia e envia manualmente pelo WhatsApp.

O produto nao promete automacao completa de atendimento, nao substitui revisao humana e nao envia mensagens diretamente pelo WhatsApp nesta versao.

## Condicoes para operar

- Build, lint, typecheck e testes passando.
- Checkout, webhook, Supabase, Resend, OpenAI, tracking e admin validados no ambiente real antes de campanhas.
- Sem bugs P0 abertos.
- Sem vazamento de dados entre usuarios.
- Sem segredo real em arquivos versionados.
- Suporte e rollback documentados.

## Pendencias conhecidas

- Validacao manual recorrente de provedores reais em producao.
- E2E autenticado completo com Supabase/Stripe reais.
- Possivel migracao futura para Supabase SSR cookies se a protecao server-side completa de paginas virar requisito.
- Reducao ou ocultacao futura de superficies legadas fora do fluxo vendavel.
- Alertas automaticos mais completos para erros de checkout, webhook, e-mail, IA e feedbacks criticos.
