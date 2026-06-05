# Checklist de Aprovacao Pre-Escala - AtendeZap IA

## Produto

- [ ] fluxo principal funcionando
- [ ] primeira resposta funcionando
- [ ] usuarios ativam depois do cadastro
- [ ] onboarding claro
- [ ] pricing claro
- [ ] paginas por nicho funcionando
- [ ] mobile aceitavel

## Billing

- [ ] checkout funcionando
- [ ] webhook funcionando
- [ ] checkout/webhook sem falha recorrente
- [ ] assinatura atualizando
- [ ] portal funcionando
- [ ] limites funcionando

## Seguranca

- [ ] secrets protegidos
- [ ] RLS revisada
- [ ] admin protegido
- [ ] logs seguros
- [ ] analytics seguro
- [ ] tracking confiavel

## Operacao

- [ ] suporte funcionando
- [ ] rollback documentado
- [ ] incident-log pronto
- [ ] health check ativo
- [ ] admin com metricas basicas
- [ ] go-live controlado executado
- [ ] primeiras 72 horas monitoradas
- [ ] suporte sem bug critico recorrente

## Campanhas

- [ ] UTMs criadas
- [ ] criterios de pausa definidos
- [ ] criterios de pausa imediata revisados
- [ ] orcamento pequeno inicial
- [ ] monitoramento diario pronto
- [ ] `docs/daily-scale-checklist.md` pronto para uso
- [ ] `docs/ad-budget-guardrails.md` revisado
- [ ] `docs/scale-contingency-plan.md` revisado
- [ ] custo da IA controlado
- [ ] evento `optimized_campaign_page_view` validado, se aplicavel
- [ ] evento `optimized_campaign_cta_click` validado, se aplicavel
- [ ] relatorio da campanha otimizada preenchido, se aplicavel
- [ ] analise da campanha otimizada revisada, se aplicavel
- [ ] diagnostico do funil da campanha otimizada revisado, se aplicavel
- [ ] comparativo de campanhas revisado antes de escolher nicho, criativo ou CTA
- [ ] nao escalar se usuarios nao ativam
- [ ] nao escalar se checkout/webhook tem falha
- [ ] nao escalar se custo da IA esta descontrolado
- [ ] nao escalar se nao houver usuarios gerando primeira resposta
- [ ] nao escalar se tracking estiver quebrado ou incompleto
- [ ] aumento sera gradual e revisado diariamente
- [ ] suporte sera tratado como sinal de risco antes de novo aumento
- [ ] analise pos-escala anterior revisada, se existir
- [ ] `docs/cautious-scale-analysis.md` nao esta em `Sem dados suficientes`
- [ ] `docs/operational-stability-report.md` nao aponta status critico
- [ ] plano da versao 1.1 nao tem P0/P1 bloqueador aberto

## Decisao

- [ ] nao escalar
- [ ] campanha pequena liberada
- [ ] escala cautelosa liberada
- [ ] manter campanha pequena ate dados suficientes

## Aprendizado pos-escala

- A escala cautelosa so deve ser aprovada de novo se a rodada anterior tiver ativacao, primeira resposta, checkout/webhook estavel, custo de IA controlado e suporte sob controle.
- Se a rodada anterior ficou sem dados suficientes, manter baixo orcamento e registrar resultados agregados antes de qualquer novo aumento.
# Atualizacao Sprint 3 da 1.2

Para aprovar nova escala depois da Sprint 3:

- [ ] Existe amostra agregada suficiente para decisao.
- [ ] Diagnostico de conversao no admin nao aponta gargalo critico sem correcao.
- [ ] `checkout_started` e assinatura ativa batem com Stripe/Supabase.
- [ ] `checkout_failed` esta zerado ou explicado.
- [ ] Usuarios geram primeira resposta antes de serem empurrados para plano.
- [ ] Copy continua sem WhatsApp automatico, promessa de venda ou urgencia falsa.
- [ ] Repositorio permanece privado e sem secrets versionados.

## Atualizacao Sprint 4 da 1.2

- [ ] release 1.2 em producao ou staging final sem P0/P1
- [ ] `docs/version-1.2-smoke-test.md` executado no ambiente final
- [ ] `docs/version-1.2-deploy-checklist.md` preenchido
- [ ] primeiras 72h pos-release acompanhadas
- [ ] campanha pequena ainda dentro de orcamento controlado
- [ ] nenhuma escala aprovada sem dados agregados reais

## Campanha pequena pos-1.2

- [ ] campanha executada por pelo menos 72h com acompanhamento diario
- [ ] usuarios chegaram a primeira resposta
- [ ] checkout e webhook estaveis
- [ ] custo de IA estavel
- [ ] suporte sem bug critico
- [ ] `docs/post-1.2-campaign-analysis-template.md` preenchido
- [ ] `docs/post-1.2-campaign-analysis.md` revisado
- [ ] `docs/post-1.2-scale-decision.md` nao recomenda `nao escalar`

Se qualquer item estiver pendente, manter a campanha pequena ou bloqueada e nao escalar.
