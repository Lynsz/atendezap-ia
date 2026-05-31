# Release Candidate - AtendeZap IA

## Objetivo

Validar se o AtendeZap IA esta pronto para operacao controlada e campanhas maiores.

Esta Release Candidate deve responder:

- o produto esta pronto para receber mais visitantes?
- cadastro, onboarding e dashboard estao funcionando?
- geracao de IA esta funcionando com limites?
- Stripe esta funcionando?
- webhook esta funcionando?
- suporte, privacidade e assinatura estao claros?
- paginas publicas estao prontas para campanha?
- tracking esta seguro?
- nao ha secrets no codigo?
- nao ha bugs P0/P1 conhecidos?

## Status

- em preparacao: documentacao, checklists e criterios criados.
- em validacao: depende de staging com Supabase, Stripe, OpenAI, Resend, tracking e admin reais.
- aprovado para producao: somente depois do QA manual e smoke em staging/producao.
- bloqueado por bugs: se houver P0 ou P1 conforme `docs/release-blockers.md`.
- aprovado para campanhas pequenas: permitido apenas com checkout, webhook, tracking, suporte e logs reais validados.
- aprovado para escala cautelosa: somente depois de campanhas pequenas com dados suficientes e sem P0/P1.

Status atual em 2026-05-31: em preparacao para validacao privada.

## Escopo desta release

- landing principal
- paginas por nicho
- demo publica
- ebook
- cadastro/login
- onboarding
- dashboard
- geracao de respostas
- biblioteca
- templates
- assinatura
- Stripe
- suporte
- privacidade
- admin
- relatorios
- campanhas internas
- tracking

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile
- BI avancado

## Evidencias obrigatorias

- `npm run validate` verde.
- `npm run test:e2e` verde quando o ambiente local/staging suportar.
- `docs/release-candidate-checklist.md` preenchido.
- `docs/manual-qa-plan.md` executado em staging antes de liberar campanha maior.
- `docs/final-qa-report.md` atualizado com ambiente, bugs, pendencias e decisao.
- `docs/pre-scale-approval-checklist.md` aprovado antes de aumentar investimento em anuncios.

## Decisao recomendada

- Manter o repositorio privado.
- Validar staging antes de liberar usuarios novos.
- Executar `docs/controlled-go-live.md`, `docs/go-live-approval-checklist.md` e `docs/go-live-deploy-plan.md` antes de producao controlada.
- Rodar apenas campanha pequena apos checkout, webhook, tracking, suporte, logs e admin ficarem verdes.
- Nao escalar ainda sem dados reais suficientes.
- Escalar com cautela apenas se nao houver P0/P1 e se os criterios de pausa/escala estiverem documentados.
