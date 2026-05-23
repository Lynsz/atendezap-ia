# Analise da campanha inicial

## Objetivo da campanha

Validar se o publico entende a oferta e entra no funil do AtendeZap IA.

Esta etapa nao serve para escalar anuncios. O objetivo e medir sinais comerciais com orcamento baixo, identificar onde o funil trava e decidir se a proxima acao e continuar, ajustar ou pausar.

## Metricas principais

- Custo por lead.
- Taxa de lead.
- Taxa de cadastro.
- Taxa de onboarding concluido.
- Taxa de ativacao.
- Taxa de checkout iniciado.
- Taxa de assinatura.
- Feedbacks de dificuldade.

O custo por etapa deve ser calculado fora do app combinando o gasto da plataforma de anuncios com os totais do admin. O admin nao recebe gasto de midia.

## Relatorio no admin

Use `/admin`, secao "Relatorio de campanha", para acompanhar:

- Leads totais.
- Leads por `utm_source`.
- Leads por `utm_campaign`.
- Cadastros totais.
- Onboardings concluidos.
- Usuarios ativados.
- Demo usada.
- Primeira resposta gerada.
- Checkouts iniciados.
- Assinaturas ativas.
- Feedbacks recebidos.
- Feedbacks de dificuldade de uso.
- Taxas lead -> cadastro, cadastro -> onboarding, onboarding -> primeira resposta, cadastro -> assinatura e lead -> assinatura.

Filtros disponiveis:

- `utm_source`.
- `utm_campaign`.
- Periodo: hoje, ultimos 7 dias, ultimos 30 dias ou todos.

## Limitacoes das metricas

- Cadastro por campanha e aproximado por e-mail entre `ebook_leads` e `profiles`.
- Onboarding, ativacao e primeira resposta usam usuarios associados aos leads filtrados quando ha UTM ou leads no periodo.
- Demo usada depende de eventos persistidos na tabela `events`. Se a demo estiver sendo medida apenas por GA4/Meta Pixel, essa metrica interna pode aparecer zerada.
- Checkout iniciado e aproximado por `subscriptions` pendentes ou com ids Stripe salvos.
- Visitantes anonimos continuam dependendo de GA4/Meta Pixel.
- O relatorio retorna apenas agregados e nao deve ser usado para baixar listas pessoais.

## Como interpretar resultados

Muitos visitantes e poucos leads:

- Problema provavel: landing, promessa, publico ou criativo.

Muitos leads e poucos cadastros:

- Problema provavel: pagina de obrigado, CTA, falta de urgencia legitima ou pouco valor percebido.

Muitos cadastros e pouco onboarding:

- Problema provavel: onboarding confuso ou fluxo pos-cadastro ruim.

Muito onboarding e pouca primeira resposta:

- Problema provavel: dashboard confuso ou geracao pouco visivel.

Muitos checkouts e poucas assinaturas:

- Problema provavel: preco, confianca, checkout ou metodo de pagamento.

Muitas assinaturas e muitos cancelamentos:

- Problema provavel: expectativa desalinhada, qualidade da resposta ou limite do plano.

## Metas iniciais de referencia

Estas metas nao sao promessa, apenas referencia para decisao inicial:

- Pelo menos 3% a 10% dos visitantes viram lead.
- Pelo menos 20% a 40% dos leads visitam demo, cadastro ou planos.
- Pelo menos 30% a 60% dos cadastrados concluem onboarding.
- Pelo menos 40% a 70% dos onboardings geram a primeira resposta.
- Pelo menos alguns usuarios demonstram intencao real de pagar.
- Feedbacks criticos devem ser poucos e corrigiveis.

## Decisao apos campanha

### Continuar

Quando:

- Leads estao chegando.
- Usuarios entendem o produto.
- Onboarding funciona.
- Pessoas geram respostas.
- Ha intencao de compra ou checkout iniciado.

Acao: manter orcamento baixo, corrigir pequenos atritos e coletar mais amostra.

### Ajustar antes de investir mais

Quando:

- Leads chegam, mas ninguem cadastra.
- Usuarios cadastram, mas nao usam.
- Feedback mostra confusao.
- Checkout nao inicia.
- Pricing gera duvida.

Acao: ajustar oferta, copy, pagina de obrigado, onboarding, dashboard ou preco antes de aumentar gasto.

### Pausar anuncios

Quando:

- Checkout quebra.
- Geracao de IA falha.
- Lead nao salva.
- Webhook nao libera assinatura.
- Custo sobe sem nenhum sinal de interesse.

Acao: pausar a campanha, corrigir o bloqueador e repetir smoke test antes de religar.
