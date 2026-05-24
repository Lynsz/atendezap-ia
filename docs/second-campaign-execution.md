# Segunda Campanha - Execucao

## Objetivo

Validar qual rota de entrada gera melhor ativacao:

- demo
- ebook
- landing principal

Esta campanha nao usa A/B testing automatico. A comparacao deve ser feita por UTMs, principalmente `utm_campaign=segunda_campanha` e `utm_content` para identificar a variacao.

## Hipoteses

### Hipotese 1 - Demo primeiro

Se o visitante testar uma resposta antes de cadastrar, ele entende mais rapido o valor do produto.

### Hipotese 2 - Ebook primeiro

Se o visitante baixar o guia antes, ele entra como lead mais barato e pode ser nutrido.

### Hipotese 3 - Landing principal

Se o visitante receber a explicacao completa do produto, pode entender melhor os planos e a oferta.

## Variacoes controladas

- Demo: foco em `Testar demo gratis`.
- Ebook: foco em `Baixar guia gratuito`.
- Landing principal: foco em explicacao completa do produto.
- Pro R$ 29: foco na oferta do Plano Pro para novos usuarios.

## Metricas principais

- visitantes
- leads
- uso da demo
- cadastros
- onboarding concluido
- primeira resposta gerada
- checkout iniciado
- assinatura ativa
- feedbacks

## Onde medir

- Visitantes, alcance, cliques, CTR, CPC e gasto: Meta Ads, GA4 ou ferramenta externa.
- Leads, UTMs, cadastros aproximados, onboarding, primeira resposta, checkout, assinatura e feedbacks: admin do AtendeZap IA.
- Checkout e assinatura: Stripe e Supabase.
- Bugs de runtime: Vercel logs e feedbacks.

## Decisao esperada

- qual rota manter
- qual rota pausar
- qual CTA melhorar
- se pode aumentar orcamento

## Regras de seguranca

- Nao usar dominio real obrigatorio em docs versionados.
- Nao colocar chaves, tokens ou dados pessoais em UTMs.
- Nao prometer envio automatico no WhatsApp.
- Nao aumentar orcamento se tracking, checkout, lead, cadastro ou IA estiverem instaveis.
