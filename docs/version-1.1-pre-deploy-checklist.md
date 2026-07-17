# Checklist Pre-Deploy - Versao 1.1

## Codigo

* [ ] branch correta
* [ ] git status revisado
* [ ] `.env.local` fora do Git
* [ ] nenhum secret real commitado
* [ ] CHANGELOG atualizado
* [ ] README atualizado
* [ ] release notes criadas

## Validacoes

* [ ] npm run check:secrets
* [ ] npm run lint
* [ ] npm run typecheck
* [ ] npm run build
* [ ] npm test
* [ ] npm run validate, se existir

## Seguranca

* [ ] RLS validado
* [ ] admin protegido
* [ ] APIs admin protegidas
* [ ] eventos sem dados sensiveis
* [ ] logs seguros
* [ ] OpenAI key server-side
* [ ] Stripe secret server-side
* [ ] Supabase service role server-side

## Producao

* [ ] variaveis da Vercel revisadas
* [ ] NEXT_PUBLIC_APP_URL correto
* [ ] Stripe webhook configurado
* [ ] Supabase migrations aplicadas
* [ ] `/api/health` seguro
* [ ] plano de rollback pronto

## Decisao

* [ ] aprovado para preview
* [ ] aprovado para producao
* [ ] bloqueado

## Observacoes atuais

* Smoke autenticado em Preview/Producao ainda precisa ser executado.
* RLS real com dois usuarios ainda precisa ser validado.
* GitHub Actions precisa de confirmacao visual no GitHub.
* Nao iniciar campanha grande antes da validacao real.

