# Sprint 2 — Ativação e Experiência Inicial

## Objetivo

Melhorar o caminho entre cadastro, onboarding e primeira resposta gerada.

## Evidências usadas

* `docs/post-mvp-operation-analysis.md` registra ativação como `nao medido` e risco no funil cadastro -> onboarding -> primeira resposta -> copia/salvamento.
* `docs/local-mvp-validation-report.md` registra cadastro/login com campos e erros amigáveis, mas fluxo autenticado real pendente por Supabase Auth local.
* `docs/mvp-final-report.md` registra MVP funcional, sem WhatsApp automático, com smoke autenticado real, RLS real e Stripe real ainda pendentes.
* Os arquivos `docs/version-1.1-sprint-1-plan.md`, `docs/version-1.1-sprint-1-report.md`, `docs/version-1.1-sprint-1-smoke-test.md` e `docs/version-1.1-sprint-1-bugs.md` não existem no repositório nesta execução.

## Escopo

* cadastro e login
* onboarding
* dashboard de usuário novo
* checklist de primeiros passos
* exemplos por nicho
* primeira resposta
* copiar e salvar
* estados de loading, vazio, sucesso e erro
* responsividade básica
* tracking seguro da ativação

## Fora do escopo

* integração com WhatsApp
* envio automático
* CRM
* app mobile
* redesign completo
* mudanças grandes no Stripe
* automações complexas

## Critérios de sucesso

* usuário cria conta sem ajuda
* conclui onboarding
* entende o que fazer no dashboard
* gera primeira resposta
* consegue copiar ou salvar
* erros são amigáveis
* mobile básico funciona
* CI permanece verde

## Plano de execução

1. Reforçar `/cadastro` e `/login` com textos claros, loading e erros amigáveis.
2. Simplificar `/onboarding` para nome do negócio, tipo, descrição curta e tom.
3. Extrair checklist simples de primeiros passos no dashboard.
4. Usar exemplos rápidos por nicho para preencher o campo sem gerar automaticamente.
5. Adicionar contador e limite de caracteres no campo de mensagem do cliente.
6. Melhorar feedback de primeira resposta, cópia e salvamento.
7. Registrar eventos seguros `activation_*` sem conteúdo sensível.
8. Atualizar agregados do admin existente para ativação.
9. Atualizar documentação, smoke test, relatório e backlog.
