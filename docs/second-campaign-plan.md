# Segunda Campanha - Plano de Ajuste

## O que aprendemos na primeira campanha

- Ainda nao ha dados reais suficientes preenchidos para uma conclusao final.
- O funil precisa separar melhor cliques da demo, pagina de obrigado e pricing para localizar gargalos.
- A segunda rodada deve testar uma hipotese por vez, sem aumentar orcamento antes de validar P0/P1.

## O que sera mantido

- Publico amplo: autonomos, prestadores de servico, pequenos negocios e pessoas que atendem pelo WhatsApp.
- Oferta do Plano Pro com primeiro mes por R$ 29 para novos usuarios.
- Rotas principais: landing, ebook e demo.
- UTMs obrigatorias em todos os links.
- Acompanhamento diario por admin, GA4/Meta, Stripe, Supabase, Resend e OpenAI.

## O que sera alterado

- headline: testar dor de tempo, profissionalismo e oferta Pro.
- criativo: separar `utm_content` por demo, ebook, landing e Pro R$ 29.
- rota de destino: comparar `/demo`, `/ebook`, `/` e `/atendimento-whatsapp-ia`.
- CTA: testar `Testar demo gratis`, `Baixar guia gratuito`, `Criar minha conta` e `Ver planos`.
- publico: manter amplo, mas separar conjuntos quando houver volume suficiente.
- oferta: manter Pro com primeiro mes por R$ 29 para novos usuarios, sem urgencia falsa.
- pagina do ebook: usar como entrada de lead e ponte para demo/cadastro.
- demo: usar como prova de valor antes do cadastro.
- pricing: usar para visitantes com maior intencao.

## Hipotese da segunda campanha

Se destacarmos a demo antes do ebook, mais pessoas vao entender o valor do produto e gerar a primeira resposta.

## Metricas principais

- custo por lead
- lead -> cadastro
- cadastro -> onboarding
- onboarding -> primeira resposta
- checkout iniciado
- assinatura

## Criterio para continuar

- leads chegando com custo aceitavel
- cadastros acontecendo
- onboarding concluido por parte dos usuarios
- primeiras respostas geradas
- tracking confiavel
- nenhum P0 aberto

## Criterio para pausar

- lead nao salva
- cadastro quebra
- IA nao gera resposta
- checkout ou webhook falha
- tracking principal fica inconfiavel
- custo consumindo sem sinal de ativacao

## Documentos de execucao

- `docs/second-campaign-execution.md`
- `docs/second-campaign-utm-links.md`
- `docs/second-campaign-creatives.md`
- `docs/second-campaign-report.md`
- `docs/second-campaign-decision-criteria.md`
