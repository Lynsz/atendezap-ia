# Checklist de Staging - AtendeZap IA

## Antes de testar

- `npm run validate` passou localmente
- `docs/release-candidate.md` atualizado
- `docs/release-candidate-checklist.md` iniciado
- `docs/manual-qa-plan.md` pronto para execucao
- `docs/release-blockers.md` revisado
- GitHub Action passou
- Preview deploy criado na Vercel
- variaveis de ambiente configuradas
- nenhum secret real foi commitado
- `.env.local` nao aparece no Git

## Testes publicos

- landing carrega
- demo publica carrega
- ebook carrega
- pagina de obrigado carrega
- pricing carrega
- paginas legais carregam
- mobile basico funcionando

## Testes de autenticacao

- cadastro funciona
- login funciona
- logout funciona
- rota privada bloqueia usuario sem login
- dashboard carrega para usuario autenticado

## Testes de onboarding

- onboarding salva dados
- dashboard usa dados do onboarding
- usuario sem onboarding recebe orientacao correta

## Testes de IA

- geracao de resposta funciona
- limite mensal funciona
- erro da OpenAI mostra mensagem amigavel
- resposta nao inventa preco/prazo nas instrucoes

## Testes Stripe

- checkout em modo teste abre
- portal Stripe abre
- webhook em modo teste processa evento
- assinatura atualiza no Supabase
- plano aparece corretamente em `/assinatura`

## Testes Resend

- captura de lead funciona
- envio do ebook funciona ou falha sem quebrar
- status de envio e registrado, se existir

## Testes de seguranca

- usuario nao ve dados de outro usuario
- admin nao abre para usuario comum
- service role nao aparece no client
- secrets nao aparecem no bundle

## Fechamento da Release Candidate

- preencher `docs/final-qa-report.md`
- marcar P0/P1 em `docs/release-blockers.md`
- revisar `docs/pre-scale-approval-checklist.md` antes de qualquer aumento de campanha
