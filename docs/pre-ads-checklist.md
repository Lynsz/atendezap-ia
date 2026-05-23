# Checklist antes de ligar anuncios - AtendeZap IA

## Ambiente

- [ ] Dominio funcionando com HTTPS.
- [ ] `NEXT_PUBLIC_APP_URL` aponta para o dominio correto.
- [ ] Landing `/` carregando.
- [ ] Pagina de campanha `/atendimento-whatsapp-ia` carregando.
- [ ] Politica de privacidade disponivel em `/privacidade`.
- [ ] Termos disponiveis em `/termos`.
- [ ] Suporte minimo pronto.

## Funil

- [ ] Ebook `/ebook` salvando lead.
- [ ] Obrigado `/ebook/obrigado` carregando.
- [ ] Guia `/ebook/guia` acessivel.
- [ ] Demo `/demo` funcionando.
- [ ] Cadastro funcionando.
- [ ] Login funcionando.
- [ ] Onboarding funcionando.
- [ ] Geracao de resposta funcionando.
- [ ] Feedback `/feedback` funcionando.

## Pagamento

- [ ] Checkout Stripe Starter testado.
- [ ] Checkout Stripe Pro testado.
- [ ] Checkout Stripe Premium testado.
- [ ] Webhook Stripe testado.
- [ ] Assinatura aparece como ativa no Supabase apos pagamento teste.
- [ ] Portal Stripe abre para usuario com customer.
- [ ] Cancelamento teste reflete no Supabase.

## Tracking e UTMs

- [ ] UTMs salvando no lead.
- [ ] UTMs chegando no metadata do checkout quando possivel.
- [ ] Admin mostra leads por `utm_source`.
- [ ] Admin mostra leads por `utm_campaign`.
- [ ] GA4 recebendo eventos.
- [ ] Meta Pixel recebendo eventos.
- [ ] Eventos de lead, demo, cadastro, checkout e feedback revisados.

## Admin e operacao

- [ ] Admin `/admin` funcionando com usuario admin.
- [ ] Usuario comum bloqueado no admin.
- [ ] Metricas de produto carregando.
- [ ] Relatorio de campanha carregando no admin.
- [ ] Filtros de `utm_source`, `utm_campaign` e periodo revisados.
- [ ] Exportacao CSV do resumo da campanha funcionando.
- [ ] Feedbacks recentes aparecendo.
- [ ] Exportacao CSV de leads funcionando.
- [ ] Plano de triagem de bugs revisado.
- [ ] `docs/campaign-analysis.md` revisado.
- [ ] `docs/campaign-daily-checklist.md` pronto para uso diario.

## Mobile

- [ ] Landing testada no celular.
- [ ] Campanha testada no celular.
- [ ] Ebook testado no celular.
- [ ] Demo testada no celular.
- [ ] Cadastro/login testados no celular.
- [ ] Pricing testado no celular.
- [ ] Obrigado testado no celular.

## Criterio para iniciar

Ligar apenas com orcamento baixo quando todos os itens criticos de funil, pagamento, tracking e admin estiverem validados no ambiente real.

## Durante a campanha

Use o relatorio de campanha no admin todos os dias. Olhe primeiro para leads, UTMs, cadastro, onboarding, primeira resposta, checkout, assinatura e feedbacks de dificuldade.

Pausar se lead nao salva, IA falha, checkout quebra, webhook nao ativa assinatura ou erro P0 aparecer nos logs.

Ajustar copy quando houver trafego e poucos leads. Ajustar pagina de obrigado ou CTA quando houver leads e poucos cadastros. Ajustar onboarding/dashboard quando houver cadastros e pouco uso. Ajustar preco/confianca quando houver checkouts e poucas assinaturas.

Nao aumentar orcamento sem sinais reais: usuarios entendendo o produto, gerando respostas e demonstrando intencao de compra.
