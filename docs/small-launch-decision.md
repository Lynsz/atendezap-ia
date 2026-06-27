# Decisao Pos-Lancamento Pequeno - AtendeZap IA

## Status

* repetir lancamento pequeno

## Motivos

* Repetir rodada pequena e a decisao operacional mais segura neste momento.
* Nao ha metricas reais suficientes para fechar MVP final.
* Nenhum P0 foi confirmado.
* Nenhum P1 critico foi confirmado.
* Smoke autenticado em Preview/Producao ainda nao esta registrado.
* Checkout Stripe teste, webhook assinado, Supabase Auth/RLS, OpenAI real, suporte, feedback, tracking e mobile ainda precisam de validacao real.

## Evidencias

* Relatorios atuais marcam metricas como `nao disponivel` ou `nao medido`.
* `docs/production-smoke-test.md` registra ambiente local aprovado com observacoes e Preview/Production bloqueado por falta de URL/credenciais reais.
* `docs/security-final-validation-report.md` registra seguranca aprovada com observacoes e pendencia de RLS no Supabase real.
* Testes e build locais foram usados como evidencia tecnica, mas nao substituem rodada real com usuarios.

## Bugs P0 pendentes

* Nenhum P0 confirmado.

## Bugs P1 pendentes

* Nenhum P1 critico confirmado.
* Pendencias operacionais nao classificadas como bug confirmado: smoke real, RLS real, Stripe teste e metricas reais.

## Riscos conhecidos

* Fechar MVP final sem validar ambiente real.
* Interpretar ausencia de dados como sucesso.
* Chamar usuarios antes de confirmar cadastro/login, onboarding, IA, copiar/salvar, biblioteca/templates, assinatura, suporte, feedback e admin.
* Alterar prompt, templates ou pricing sem evidencia real.
* Expor secrets ou dados sensiveis se processos de deploy forem feitos fora do checklist.

## Proxima etapa recomendada

* Rodar smoke autenticado em Preview/Producao.
* Corrigir qualquer P0/P1 encontrado.
* Repetir rodada pequena com poucos usuarios.
* Preencher `docs/small-launch-live-tracking.md` e relatorios diarios com dados reais.

Critérios para fechar MVP final continuam:

* nenhum P0 aberto
* P1 criticos corrigidos ou documentados
* cadastro/login/onboarding funcionando
* IA funcionando
* copiar/salvar funcionando
* biblioteca/templates funcionando
* assinatura clara
* suporte/feedback funcionando
* admin protegido
* nenhum vazamento de dados
* CI verde
* smoke test aprovado
