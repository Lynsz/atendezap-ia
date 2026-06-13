# Proxima rodada beta ou lancamento pequeno

Data: 2026-06-12

## Caminho recomendado

Executar nova rodada beta controlada com poucos usuarios antes de lancamento pequeno.

## Plano

1. Aplicar migracoes pendentes em Supabase.
2. Validar variaveis de producao na Vercel.
3. Rodar smoke real com cadastro, onboarding, geracao, copia, feedback, suporte, checkout e portal.
4. Convidar usuarios beta de forma controlada.
5. Medir funil de ativacao.
6. Corrigir P0/P1 se aparecerem.
7. Decidir entre nova rodada beta ou lancamento pequeno com base em dados.

## Checklist de saida do beta

- Onboarding concluido sem ajuda manual.
- Primeira resposta gerada em menos de poucos minutos.
- Usuario entende que deve revisar e enviar manualmente.
- Usuario consegue copiar ou salvar resposta.
- Feedback util coletado.
- Suporte funcionando.
- Nenhum P0/P1 aberto.
- Billing real validado.

## Resultado esperado

Ao final da proxima rodada, atualizar `docs/beta-test-report.md` com metricas reais e uma decisao objetiva: continuar beta, lancar pequeno ou corrigir bloqueadores.

