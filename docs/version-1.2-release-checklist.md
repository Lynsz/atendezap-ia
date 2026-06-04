# Checklist de Release - Versao 1.2

## Codigo

- [x] npm run validate passou localmente
- [x] check:secrets passou localmente
- [x] lint passou localmente
- [x] typecheck passou localmente
- [x] build passou localmente
- [x] testes passaram localmente

## Seguranca

- [x] repositorio privado
- [x] .env.local fora do Git
- [x] sem secrets em arquivos versionados
- [x] logs seguros revisados localmente
- [x] analytics seguro revisado localmente
- [ ] RLS revisada com dois usuarios reais no ambiente final

## Produto

- [x] fluxo principal coberto por testes locais/e2e
- [x] onboarding coberto por testes locais
- [x] primeira resposta coberta por testes locais
- [x] biblioteca/templates cobertos por testes locais
- [ ] assinatura testada em Stripe test/live no ambiente final
- [x] suporte coberto por testes locais

## Billing

- [x] checkout exige login em teste local/e2e
- [x] portal exige login em teste local/e2e
- [ ] webhook testado no ambiente final
- [x] limite mensal testado localmente
- [x] pagamento falho revisado localmente

## Campanhas

- [x] paginas por nicho revisadas
- [x] UTMs revisadas
- [x] tracking revisado
- [x] criterios de pausa revisados

## Documentacao

- [x] CHANGELOG atualizado
- [x] release notes criadas
- [x] auditoria atualizada
- [x] QA documentado

## Decisao

- [x] liberar deploy controlado
- [ ] validar staging com `docs/version-1.2-staging-validation.md`
- [ ] validar producao com `docs/version-1.2-production-validation.md`
- [ ] monitorar pos-release com `docs/version-1.2-post-release-monitoring.md`
- [ ] preencher `docs/version-1.2-post-release-report.md`
- [ ] liberar campanha pequena somente apos smoke pos-deploy
- [ ] nao escalar sem dados agregados suficientes
