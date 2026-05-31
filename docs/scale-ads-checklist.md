# Checklist Antes de Aumentar Orcamento - AtendeZap IA

Nao aumente orcamento enquanto este checklist nao estiver majoritariamente verde.

Antes de qualquer aumento, conclua `docs/controlled-go-live.md`, `docs/first-72-hours-monitoring.md`, `docs/post-go-live-decision.md` e `docs/pre-scale-approval-checklist.md`.

Depois das primeiras 72 horas, revise tambem `docs/post-go-live-72h-report.md`, `docs/post-go-live-diagnosis.md`, `docs/post-go-live-decision-matrix.md` e `docs/post-go-live-learnings.md`.

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

## Limite recomendado

Aumente aos poucos. Se a campanha pequena ainda nao gerou cadastros, onboarding e primeiras respostas com clareza, nao ha base suficiente para escalar.

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
