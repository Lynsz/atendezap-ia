# Checklist de Aprovacao do Go-Live - AtendeZap IA

## Codigo

- [ ] `npm run validate` passou
- [ ] GitHub Action passou
- [ ] `check:secrets` passou
- [ ] build passou
- [ ] testes passaram
- [ ] sem bugs P0
- [ ] sem bugs P1 graves

## Seguranca

- [ ] repositorio privado
- [ ] `.env.local` fora do Git
- [ ] secrets configurados apenas na Vercel
- [ ] service role apenas server-side
- [ ] OpenAI key apenas server-side
- [ ] Stripe secret apenas server-side
- [ ] logs seguros
- [ ] analytics sem dados sensiveis

## Produto

- [ ] landing validada
- [ ] paginas por nicho validadas
- [ ] demo validada
- [ ] ebook validado
- [ ] cadastro/login validado
- [ ] onboarding validado
- [ ] dashboard validado
- [ ] geracao de IA validada
- [ ] biblioteca/templates validados
- [ ] assinatura validada
- [ ] suporte validado
- [ ] privacidade validada

## Billing

- [ ] checkout validado
- [ ] portal Stripe validado
- [ ] webhook validado
- [ ] assinatura ativa reflete no Supabase
- [ ] pagamento falho tratado
- [ ] cancelamento tratado
- [ ] limites por plano funcionando

## Operacao

- [ ] health check ativo
- [ ] rollback documentado
- [ ] incident-log pronto
- [ ] suporte pronto
- [ ] admin pronto
- [ ] relatorio interno pronto
- [ ] monitoramento diario pronto

## Decisao

- [ ] aprovado para producao
- [ ] aprovado apenas para staging
- [ ] aprovado para campanha pequena
- [ ] bloqueado por bug
- [ ] pausado
