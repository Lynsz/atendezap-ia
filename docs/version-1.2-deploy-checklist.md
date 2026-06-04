# Checklist de Deploy - Versao 1.2

## Antes do deploy

- [ ] npm run validate passou
- [ ] check:secrets passou
- [ ] GitHub Action passou
- [ ] QA final aprovado
- [ ] sem bugs P0
- [ ] sem bugs P1 graves
- [ ] staging validado
- [ ] rollback disponivel
- [ ] variaveis da Vercel revisadas

## Durante o deploy

- [ ] acompanhar Vercel
- [ ] validar build
- [ ] verificar logs
- [ ] nao ativar campanha antes do smoke test

## Apos o deploy

- [ ] testar landing
- [ ] testar demo
- [ ] testar cadastro
- [ ] testar onboarding
- [ ] testar geracao de resposta
- [ ] testar assinatura
- [ ] testar checkout
- [ ] testar webhook
- [ ] testar suporte
- [ ] testar admin
- [ ] revisar logs
- [ ] registrar resultado

## Guardrails

- Repositorio continua privado.
- `.env.local` e secrets reais nao entram no Git.
- Campanha pequena so pode iniciar depois do smoke pos-deploy.
- Escala continua bloqueada sem dados agregados suficientes.

