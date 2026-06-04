# Checklist de Prontidao para Release - AtendeZap IA

## Codigo

- release candidate documentada
- checklist da release candidate preenchido
- QA manual planejado
- bugs P0/P1 revisados
- `npm run validate` passou
- lint passou
- typecheck passou
- build passou
- testes passaram
- sem secrets no codigo

## Produto

- fluxo principal testado
- dashboard testado
- geracao de IA testada
- assinatura testada
- suporte testado, se alterado

## Seguranca

- `.env.local` fora do Git
- service role apenas server-side
- OpenAI key apenas server-side
- Stripe secret apenas server-side
- logs sem dados sensiveis

## Producao

- staging validado
- deploy controlado planejado
- criterios de rollback definidos
- monitoramento pos-release definido
- relatorio final de QA atualizado
- checklist pre-escala revisado antes de aumentar campanhas
- rollback possivel
- health check funcionando
- smoke test pronto
- documentacao atualizada
- campanha bloqueada ate smoke pos-deploy e aprovacao operacional
