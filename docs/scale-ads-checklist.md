# Checklist Antes de Aumentar Orcamento - AtendeZap IA

Nao aumente orcamento enquanto este checklist nao estiver majoritariamente verde.

Antes de qualquer aumento, conclua `docs/controlled-go-live.md`, `docs/first-72-hours-monitoring.md`, `docs/post-go-live-decision.md` e `docs/pre-scale-approval-checklist.md`.

Depois das primeiras 72 horas, revise tambem `docs/post-go-live-72h-report.md`, `docs/post-go-live-diagnosis.md`, `docs/post-go-live-decision-matrix.md` e `docs/post-go-live-learnings.md`.

Se a campanha pequena otimizada foi rodada, revise tambem `docs/optimized-campaign-analysis.md`, `docs/optimized-campaign-funnel-diagnosis.md`, `docs/optimized-campaign-decision-matrix.md`, `docs/optimized-campaign-adjustment-plan.md`, `docs/next-campaign-variation-plan.md` e `docs/campaign-comparison-report.md`.

Para escala cautelosa, revise tambem `docs/cautious-scale-execution-plan.md`, `docs/scale-control-matrix.md`, `docs/daily-scale-checklist.md`, `docs/cautious-scale-report.md`, `docs/ad-budget-guardrails.md`, `docs/scale-contingency-plan.md` e `docs/after-scale-next-step-criteria.md`.

Depois da analise pos-escala, revise tambem `docs/cautious-scale-analysis.md`, `docs/scale-health-diagnosis.md`, `docs/post-scale-decision-matrix.md`, `docs/post-scale-adjustment-plan.md` e `docs/operational-stability-report.md`.

## Sinais comerciais

- [ ] campanha pequena gerou leads
- [ ] usuarios entenderam o produto
- [ ] onboarding teve conclusao aceitavel
- [ ] usuarios geraram respostas
- [ ] checkout foi iniciado
- [ ] houve sinal de intencao real de compra
- [ ] custo por lead aceitavel para a fase
- [ ] custo por cadastro aceitavel para a fase

## Produto e funil

- [ ] tracking esta confiavel
- [ ] eventos da campanha otimizada validados, se `utm_campaign=campanha_otimizada_01` estiver em uso
- [ ] UTMs estao chegando no admin
- [ ] admin mostra campanha com melhor desempenho
- [ ] feedbacks principais foram corrigidos
- [ ] nao ha bugs P0
- [ ] nao ha bugs P1 graves
- [ ] suporte consegue responder duvidas
- [ ] mobile foi revisado no dominio final

## Integracoes

- [ ] OpenAI usage esta controlado
- [ ] Stripe esta funcionando
- [ ] webhook Stripe esta funcionando
- [ ] Resend esta funcionando ou fallback esta documentado
- [ ] Supabase esta estavel
- [ ] Vercel logs sem erro critico recorrente
- [ ] GA4 esta recebendo eventos, se configurado
- [ ] Meta Pixel esta recebendo eventos, se configurado

## Decisao

- [ ] aumentar levemente orcamento
- [ ] manter orcamento baixo
- [ ] ajustar campanha antes de aumentar
- [ ] pausar por bloqueador

## Antes de aumentar orcamento

- [ ] melhor variacao identificada
- [ ] tracking validado
- [ ] eventos principais funcionando
- [ ] custo OpenAI sob controle
- [ ] Stripe sem falhas
- [ ] Resend sem falhas criticas
- [ ] feedbacks P0/P1 resolvidos
- [ ] checkout testado
- [ ] suporte minimo pronto
- [ ] rollback pronto
- [ ] criterio de pausa imediata revisado
- [ ] decisao pos-go-live registrada
- [ ] usuarios ativam e geram primeira resposta
- [ ] checkout e webhook sem falha recorrente
- [ ] custo da IA controlado
- [ ] suporte sem bug critico recorrente
- [ ] tracking confiavel
- [ ] `docs/optimized-campaign-report.md` preenchido, se a campanha otimizada foi rodada
- [ ] `docs/optimized-campaign-analysis.md` preenchido com decisao objetiva
- [ ] usuarios da campanha otimizada geraram primeira resposta
- [ ] maior gargalo da campanha otimizada foi corrigido ou classificado como dados insuficientes
- [ ] checklist diario de escala revisado
- [ ] guardrails de orcamento revisados
- [ ] contingencia de escala pronta
- [ ] decisao diaria registrada no admin ou no relatorio

## Limite recomendado

Aumente aos poucos. Se a campanha pequena ainda nao gerou cadastros, onboarding e primeiras respostas com clareza, nao ha base suficiente para escalar.

Para a campanha otimizada, nao aumentar verba se a conclusao ainda for `Sem dados suficientes`, se o custo de IA subir sem ativacao ou se checkout/webhook nao estiverem estaveis.

Escala cautelosa so pode ser considerada quando a campanha otimizada tiver tracking confiavel, usuarios ativando, primeira resposta gerada, checkout/webhook funcionando, custo de IA sob controle e suporte sem bug critico.

O aumento deve ser gradual. Se suporte subir, custo da IA sair do controle, usuarios nao ativarem ou billing oscilar, reduza ou pause antes de testar novo criativo.

## Depois da escala cautelosa

- [ ] `docs/cautious-scale-analysis.md` preenchido com dados agregados reais ou `Sem dados suficientes`
- [ ] `docs/scale-health-diagnosis.md` revisado
- [ ] `docs/post-scale-decision-matrix.md` aplicado
- [ ] `docs/post-scale-adjustment-plan.md` atualizado com P0/P1/P2/P3
- [ ] `docs/operational-stability-report.md` revisado
- [ ] decisao registrada: manter, reduzir, pausar, corrigir ou consolidar 1.1
- [ ] versao 1.1 preparada apenas se produto, billing, IA e suporte estiverem estaveis

Se a analise pos-escala permanecer como `Sem dados suficientes`, nao aumentar orcamento. Voltar para campanha pequena, preencher os campos agregados faltantes e corrigir somente gargalos comprovados.

## Antes da segunda campanha

- [ ] `docs/first-campaign-report.md` preenchido com numeros reais
- [ ] `docs/first-campaign-analysis.md` atualizado
- [ ] gargalo principal identificado ou classificado como dados insuficientes
- [ ] P0 resolvido
- [ ] P1 grave resolvido
- [ ] hipotese da segunda campanha registrada em `docs/second-campaign-plan.md`
- [ ] `docs/second-campaign-execution.md` preenchido
- [ ] `docs/second-campaign-report.md` preenchido por variacao
- [ ] CTAs da demo e obrigado rastreados separadamente
- [ ] CTAs da pagina de campanha rastreados por eventos `campaign_*`
- [ ] leads por `utm_content` conferidos no admin
- [ ] admin conferido com UTMs e diagnostico do funil

## Depois da segunda campanha

- [ ] `docs/second-campaign-analysis.md` preenchido
- [ ] `docs/scale-decision-matrix.md` revisado
- [ ] `docs/cautious-scale-plan.md` revisado
- [ ] `docs/copy-iteration-notes.md` atualizado com dados reais
- [ ] `docs/third-campaign-prep-checklist.md` pronto, se houver nova rodada
# Atualizacao Sprint 3 da 1.2

Antes de qualquer aumento alem da campanha pequena pos-Sprint 3, confirmar:

- [ ] Pricing com Pro R$ 29 primeiro mes e recorrencia normal depois.
- [ ] CTA pos-demo rastreado para cadastro, planos e ebook.
- [ ] CTA pos-primeira resposta rastreado para planos.
- [ ] Paginas de nicho deixam claro que nao ha envio automatico pelo WhatsApp.
- [ ] Admin Conversao mostra agregados ou `Nao disponivel` sem dados sensiveis.
- [ ] Checkout, webhook, assinatura ativa e portal Stripe validados no ambiente real/test mode.
- [ ] Sem dados suficientes continua sendo decisao padrao quando a amostra for baixa.

## Atualizacao Sprint 4 da 1.2

Antes da campanha pequena pos-1.2:

- [ ] deploy controlado da 1.2 concluido
- [ ] smoke test pos-deploy aprovado
- [ ] primeiras 72h monitoradas ou plano de monitoramento definido
- [ ] orcamento pequeno definido
- [ ] IA, checkout, webhook, portal Stripe, tracking e suporte sem falha critica
- [ ] rollback disponivel

Escala continua bloqueada sem dados agregados suficientes.

## Campanha pos-1.2

- [ ] `docs/version-1.2-production-validation.md` aprovado
- [ ] `docs/version-1.2-post-release-monitoring.md` em execucao
- [ ] `docs/post-1.2-campaign-approval-checklist.md` aprovado
- [ ] metricas revisadas diariamente
- [ ] nenhum P0/P1 aberto
- [ ] no minimo 72h de dados antes de qualquer aumento de orcamento

## Pos-deploy 1.2

- [ ] `docs/version-1.2-post-deploy-analysis.md` preenchido
- [ ] `docs/version-1.2-stability-diagnosis.md` revisado
- [ ] `docs/post-1.2-campaign-decision-matrix.md` aplicado
- [ ] `docs/version-1.2-post-deploy-fix-plan.md` sem P0/P1 pendente
- [ ] `docs/post-1.2-final-campaign-launch-checklist.md` aprovado
- [ ] `docs/post-1.2-campaign-operations.md` revisado
- [ ] campanha iniciada pequena, sem escala antes de dados iniciais

Se qualquer item acima estiver pendente, manter campanha bloqueada.

## Campanha pequena pos-1.2 - regra de 72h

- [ ] campanha iniciou com orcamento pequeno e fixo
- [ ] `docs/post-1.2-campaign-live-tracking.md` foi preenchido diariamente
- [ ] analise de 72h foi concluida
- [ ] usuarios geraram primeira resposta
- [ ] checkout e webhook permaneceram estaveis
- [ ] custo de IA permaneceu controlado
- [ ] nenhum P0/P1 foi aberto

Sem todos os itens acima, nao aumentar orcamento.
