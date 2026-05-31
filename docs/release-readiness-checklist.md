# Checklist de Prontidão para Release - AtendeZap IA

## Código

- npm run validate passou
- lint passou
- typecheck passou
- build passou
- testes passaram
- sem secrets no código

## Produto

- fluxo principal testado
- dashboard testado
- geração de IA testada
- assinatura testada
- suporte testado, se alterado

## Segurança

- .env.local fora do Git
- service role apenas server-side
- OpenAI key apenas server-side
- Stripe secret apenas server-side
- logs sem dados sensíveis

## Produção

- staging validado
- rollback possível
- health check funcionando
- smoke test pronto
- documentação atualizada
