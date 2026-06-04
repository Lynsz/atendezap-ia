# Release Notes - AtendeZap IA 1.2

## Tipo

Minor release

## Resumo

Versao focada em estabilidade, ativacao, conversao, billing, controle de IA, suporte e operacao.

## Adicionado

- Admin de ativacao com metricas agregadas e diagnostico simples.
- Admin de conversao com metricas agregadas e diagnostico deterministico.
- Eventos seguros para ativacao, conversao, pricing, demo, ebook, nichos e checkout.
- Documentos finais de QA, deploy, smoke test e fechamento da versao 1.2.

## Melhorado

- Onboarding e dashboard inicial para orientar a primeira resposta.
- Exemplos por nicho, templates recomendados e favoritos no dashboard.
- CTA pos-demo e CTA pos-primeira resposta.
- Pricing com Pro recomendado, primeiro mes por R$ 29 para novos usuarios e recorrencia normal depois.
- Paginas por nicho com CTAs para demo, cadastro e planos.
- Copy de FAQ para deixar claro que o AtendeZap IA nao envia mensagens automaticamente.

## Corrigido

- Tracking seguro reforcado para remover e-mail em valores genericos, telefone e WhatsApp.
- Testes reforcados para limite bloqueando IA, falha de IA sem consumo e health check sem dados sensiveis.
- Fluxos de admin, suporte e rotas privadas continuam bloqueando usuario comum.

## Seguranca

- Repositorio permanece privado.
- Sem secrets reais ou `.env.local` versionados.
- OpenAI, Stripe, Supabase service role e Resend permanecem server-side.
- Logs e analytics continuam sem pergunta, resposta, telefone, e-mail, token, secret ou dados de pagamento.
- Admin permanece protegido por `requireAdmin`.

## Billing

- Checkout, portal Stripe, webhook, status de assinatura, pagamento falho e cancelamento foram revisados localmente.
- Stripe permanece como fonte de verdade financeira.
- O app nao salva cartao.
- Validacao real/test mode de checkout, portal, webhook e dunning segue obrigatoria antes de escala.

## IA e limites

- Limite mensal e sessao sao verificados antes da chamada OpenAI.
- Falha de IA nao consome limite.
- Sucesso incrementa uso apenas depois da resposta persistida.
- Demo publica tem rate limit e fallback controlado.

## Ativacao

- Dashboard inicial orienta o usuario a gerar a primeira resposta.
- Checklist cobre onboarding, primeira resposta, copia, salvamento, templates, favoritos e planos.
- Admin acompanha ativacao apenas com agregados.

## Conversao

- Pricing, demo, dashboard, ebook e paginas por nicho foram revisados.
- Eventos de conversao usam payload minimo.
- Campanha pequena pos-1.2 foi preparada, mas depende de smoke pos-deploy e monitoramento.

## Documentacao

- Plano e relatorios das Sprints 1, 2, 3 e 4.
- QA final, checklist de deploy, smoke test e relatorio final.
- Release notes finais, changelog, auditoria e prontidao atualizados.
- Plano de campanha pos-1.2 e links UTM revisados.

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile

