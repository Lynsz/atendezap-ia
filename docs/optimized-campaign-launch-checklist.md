# Checklist de Lancamento da Campanha Otimizada

## Antes de ligar

- [ ] `npm run validate` passou
- [ ] `npm run test:e2e` passou
- [ ] pagina por nicho abre no dominio final
- [ ] `/demo` abre no dominio final
- [ ] `/precos` abre no dominio final
- [ ] checkout testado em ambiente correto
- [ ] webhook validado
- [ ] admin acessivel apenas para admin
- [ ] eventos `optimized_campaign_page_view` e `optimized_campaign_cta_click` validados com UTM oficial
- [ ] UTMs aparecem no armazenamento/local ou relatorio esperado
- [ ] custo OpenAI monitorado
- [ ] suporte pronto para duvidas simples

## Durante

- [ ] revisar gasto diariamente
- [ ] conferir erros de Vercel/Supabase
- [ ] conferir eventos principais
- [ ] registrar resultados em `docs/optimized-campaign-report.md`
- [ ] pausar ao encontrar P0/P1

## Depois

- [ ] consolidar resultados
- [ ] classificar decisao
- [ ] atualizar aprendizados
- [ ] nao escalar se a conclusao for `Sem dados suficientes`
