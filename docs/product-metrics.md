# Metricas internas do produto

Este documento descreve as metricas simples usadas no admin para acompanhar os primeiros usuarios do AtendeZap IA. O objetivo nao e criar analytics complexo, mas responder se as pessoas estao entendendo, ativando e usando o produto antes de aumentar trafego pago.

## Onde ver

- Admin: `/admin`
- API protegida: `/api/admin/metrics`
- A API exige usuario autenticado e e-mail autorizado em `ADMIN_EMAILS`.
- A resposta da API retorna apenas numeros agregados, sem listas de usuarios, leads ou mensagens.

## Dados usados

- `ebook_leads`: leads, UTMs e origem do guia.
- `profiles`: usuarios cadastrados.
- `businesses`: onboarding concluido via `onboarding_completed`.
- `generated_responses`: respostas geradas e atividade de uso.
- `subscriptions`: assinaturas ativas e checkout iniciado aproximado.
- `user_feedback`: feedbacks por tipo e status.
- `events`: existe para eventos server-side pontuais, mas ainda nao e a fonte principal das metricas do admin.

## Metricas existentes

### Funil e conversao

- Total de leads.
- Leads no periodo selecionado.
- Total de usuarios cadastrados.
- Usuarios que concluiram onboarding.
- Usuarios que geraram pelo menos 1 resposta.
- Usuarios ativados.
- Usuarios com checkout iniciado.
- Usuarios com assinatura ativa.
- Taxa lead -> cadastro.
- Taxa cadastro -> onboarding concluido.
- Taxa onboarding -> primeira resposta.
- Taxa cadastro -> assinatura ativa.

### Ativacao

Usuario ativado = concluiu onboarding e gerou pelo menos 1 resposta.

Metricas:

- Usuarios ativados.
- Taxa de ativacao.
- Tempo aproximado ate ativacao, quando existe amostra suficiente.

O tempo ate ativacao e aproximado: usa a data de criacao do profile e a primeira resposta gerada pelo usuario.

### Uso

Usuario ativo = gerou pelo menos uma resposta no periodo.

Metricas:

- Respostas geradas hoje.
- Respostas geradas nos ultimos 7 dias.
- Respostas geradas nos ultimos 30 dias.
- Total de respostas geradas.
- Media de respostas por usuario que ja gerou resposta.
- Usuarios ativos nos ultimos 7 dias.
- Usuarios ativos nos ultimos 30 dias.

### Feedback

- Total de feedbacks.
- Feedbacks no periodo selecionado.
- Feedbacks novos.
- Feedbacks nao resolvidos.
- Feedbacks por tipo: bug, duvida, sugestao, elogio e dificuldade de uso.

## Filtros

O admin usa os filtros:

- Hoje.
- Ultimos 7 dias.
- Ultimos 30 dias.
- Todos.

O filtro afeta os cards de periodo, como leads no periodo e feedbacks no periodo. As metricas acumuladas continuam mostrando totais gerais para contexto.

## Limitacoes atuais

- Taxa lead -> cadastro e aproximada por e-mail entre `ebook_leads` e `profiles`.
- Checkout iniciado e aproximado por assinatura pendente ou por ids Stripe salvos em `subscriptions`.
- Visitantes anonimos que nao viram lead ainda dependem de GA4/Meta Pixel; o banco local nao mede visitante unico.
- Tempo ate ativacao depende de profile criado e primeira resposta gerada; pode ficar sem amostra no inicio.
- A API calcula agregados em memoria, suficiente para primeiros usuarios. Se o volume crescer, revisar para queries agregadas, views ou tabelas materializadas.

## Metricas mais importantes no comeco

- Taxa de cadastro apos lead.
- Taxa de onboarding concluido.
- Taxa de primeira resposta gerada.
- Feedbacks de dificuldade de uso.
- Assinaturas iniciadas.
- Assinaturas ativas.

## Como interpretar

- Lead alto e cadastro baixo: landing/ebook pode estar atraindo pessoas erradas ou cadastro esta confuso.
- Cadastro alto e onboarding baixo: explicar melhor por que preencher dados do negocio.
- Onboarding alto e primeira resposta baixa: a tela de geracao ou o limite/plano pode estar bloqueando uso.
- Primeira resposta alta e retorno baixo: qualidade da resposta ou valor recorrente precisam ser revisados.
- Feedback de dificuldade de uso acima de bug: problema de clareza/copy/UX, nao necessariamente tecnologia.
- Checkout iniciado sem assinatura ativa: revisar Stripe, webhook, preco e friccao de pagamento.
