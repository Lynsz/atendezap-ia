# Conversão da landing page

## Promessa central

O AtendeZap IA ajuda quem atende pelo WhatsApp a criar respostas rápidas, profissionais e personalizadas com inteligência artificial.

## Público-alvo da copy

- Autônomos
- Prestadores de serviço
- Pequenos negócios
- Pessoas que atendem clientes pelo WhatsApp
- Lojas pequenas, delivery, estética, restaurantes, assistência técnica e vendedores pelo WhatsApp

## Páginas do funil

- `/`: landing page principal com hero, problemas, como funciona, benefícios, perfis de público, demo, ebook, planos, comparação, objeções e FAQ.
- `/demo`: demo pública para testar uma resposta agora.
- `/ebook`: captura do guia gratuito para nutrição de leads.
- `/precos`: página dedicada de planos com comparação, objeções, FAQ, demo e ebook.
- `/cadastro`: criação de conta.

## CTAs principais

- Começar agora
- Testar demo grátis
- Ver planos
- Baixar guia gratuito
- Criar minha conta

## Oferta do Plano Pro

O Plano Pro deve continuar destacado como "Mais recomendado".

Texto obrigatório preservado:

> Primeiro mês por R$ 29 para novos usuários

Depois do primeiro mês, o plano segue por R$ 97/mês. A copy não deve usar urgência falsa, escassez artificial ou promessa de resultado financeiro garantido.

## Eventos de tracking

A landing e a página de preços usam a camada central em `src/lib/tracking.ts`. Quando GA4 ou Meta Pixel não estão configurados, os eventos devem continuar em modo no-op sem quebrar SSR ou navegação local.

- `landing_view`
- `hero_cta_click`
- `demo_cta_click`
- `ebook_cta_click`
- `pricing_cta_click`
- `plan_compare_view`
- `faq_open`
- `objection_section_view`
- `final_cta_click`

Eventos antigos de checkout, ebook, demo, cadastro e assinatura continuam preservados.

## Seções da landing page

- Hero com headline, subheadline, CTA principal, CTA secundário e mini prova.
- Problemas reais de quem atende pelo WhatsApp.
- Como funciona em quatro passos.
- Benefícios principais.
- Prova social inicial honesta por perfis de público, sem depoimentos falsos.
- Demo pública e ebook gratuito conectados.
- Planos Starter, Pro e Premium.
- Tabela comparativa responsiva.
- Objeções comuns.
- FAQ.
- CTA final para cadastro e demo.
