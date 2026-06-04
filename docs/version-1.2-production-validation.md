# Validacao em Producao - Versao 1.2

## Apos deploy

- [ ] abrir landing
- [ ] abrir demo
- [ ] abrir pagina de precos
- [ ] abrir pagina por nicho
- [ ] testar cadastro com conta de teste
- [ ] concluir onboarding
- [ ] gerar resposta
- [ ] copiar resposta
- [ ] salvar resposta
- [ ] abrir assinatura
- [ ] iniciar checkout teste, se ambiente permitir
- [ ] validar webhook, se ambiente permitir
- [ ] abrir suporte
- [ ] testar health check
- [ ] revisar logs

## Criterio de aprovacao

A producao so e considerada aprovada se:

- fluxo principal funciona
- IA funciona
- checkout/webhook funcionam ou foram validados em modo seguro
- admin segue protegido
- logs nao mostram erro critico
- nao ha bug P0/P1

## Decisao

- [ ] aprovar producao
- [ ] manter producao em observacao
- [ ] aplicar rollback
- [ ] liberar campanha pequena somente apos monitoramento inicial

