# Otimizacao de Conversao - Sprint 3 da 1.2

## Principio

A conversao deve aumentar clareza e confianca, nao urgencia falsa. O produto continua simples: a IA gera uma resposta para o usuario copiar, ajustar e enviar manualmente pelo WhatsApp.

## Pricing

- Planos com nome, perfil indicado, limite mensal, recursos, CTA e Pro recomendado.
- Plano Pro: "Primeiro mes por R$ 29 para novos usuarios."
- Depois do primeiro mes, segue o valor normal do Plano Pro configurado na assinatura.
- Checkout e recorrencia sao processados pela Stripe.
- Cancelamento e gestao da assinatura acontecem pelo portal Stripe.

## CTAs revisados

- Pos-demo: criar conta, ver planos e baixar guia gratuito.
- Pos-primeira resposta no dashboard: ver planos, salvar resposta e ver templates prontos.
- Nichos: demo, cadastro e planos acima da dobra.
- Obrigado do ebook: demo, cadastro e planos.

## Eventos seguros

Eventos revisados:

- `pricing_page_view`
- `plan_card_view`
- `plan_cta_click`
- `checkout_started`
- `checkout_failed`
- `stripe_portal_opened`
- `demo_to_signup_click`
- `demo_to_pricing_click`
- `first_response_to_pricing_click`
- `niche_to_demo_click`
- `niche_to_signup_click`
- `niche_to_pricing_click`
- `ebook_to_signup_click`
- `ebook_to_pricing_click`

Propriedades permitidas: `plan`, `source`, `niche`, `cta`, `page`, `campaign`.

Nao registrar: e-mail, telefone, WhatsApp, pergunta, resposta, mensagem, dados de pagamento, IDs Stripe, tokens ou secrets.

## Diagnostico admin

- Muitas visitas ao pricing e poucos checkouts: revisar clareza dos planos, preco e CTA.
- Muitas primeiras respostas e poucos cliques para planos: revisar CTA pos-primeira resposta e percepcao de valor.
- Muitos checkouts e poucas assinaturas: revisar Stripe, preco, confianca e metodo de pagamento.
- Muitos leads e poucos cadastros: revisar pagina de obrigado e convite para criar conta.

## Decisao atual

Sem dados suficientes para concluir performance real. Usar a campanha pequena pos-Sprint 3 apenas para coletar sinais agregados.

