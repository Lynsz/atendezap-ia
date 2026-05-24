# Producao Controlada - AtendeZap IA

Use este documento para sair de staging e liberar o AtendeZap IA para poucos usuarios reais. Nao use este checklist para escalar anuncios; anuncios maiores dependem de validacao comercial e tecnica no ambiente final.

## Status atual

- Pronto para staging: sim, com documentacao e validacoes locais.
- Pronto para producao controlada: sim, desde que as pendencias externas abaixo sejam configuradas e validadas no dominio final.
- Pendencias antes de anuncios: validar dominio final, Supabase producao, Stripe live/teste controlado, Resend, OpenAI, tracking, admin, suporte, webhook e monitoramento com dados reais.

## Requisitos obrigatorios antes de liberar

- Dominio final configurado na Vercel.
- SSL ativo no dominio final.
- `NEXT_PUBLIC_APP_URL` apontando para o dominio final, sem barra final.
- Supabase producao configurado com migrations aplicadas.
- RLS revisado e testado com usuario comum e admin.
- Supabase Auth Site URL e Redirect URLs apontando para o dominio final.
- Stripe producao configurado em live mode.
- Produtos Starter, Pro e Premium criados em live mode.
- Pro primeiro mes por R$ 29 configurado para novos usuarios.
- Webhook Stripe producao configurado com os eventos obrigatorios.
- Resend producao configurado com dominio/remetente validado.
- OpenAI configurada com limite de custo.
- Admin configurado em `ADMIN_EMAILS`.
- Tracking configurado para o dominio final, se GA4/Meta forem usados.
- Testes finais executados no ambiente real.
- Logs da Vercel revisados depois do deploy.
- Nenhum segredo real em arquivos versionados.

## O que ainda pode ficar para depois

- Melhorias visuais finas.
- Novas integracoes.
- Automacoes avancadas.
- Dashboards complexos.
- Testes A/B.
- Alertas automaticos mais sofisticados.
- Refatoracao de superficies legadas que nao fazem parte do fluxo vendavel principal.

## Ordem recomendada

1. Configurar dominio e `NEXT_PUBLIC_APP_URL`.
2. Configurar Vercel Production com envs reais.
3. Aplicar migrations no Supabase producao.
4. Configurar Auth URLs no Supabase.
5. Configurar Stripe live mode e webhook de producao.
6. Configurar Resend, OpenAI, admin e tracking.
7. Rodar `docs/go-live-checklist.md`.
8. Liberar para 3 a 5 usuarios seguindo `docs/first-users-launch.md`.

## Regra de go/no-go

Pode liberar producao controlada quando cadastro, login, onboarding, primeira resposta, assinatura, webhook, e-mail do ebook, admin e tracking principal funcionarem no dominio final.

Nao liberar se cadastro, IA, checkout, webhook, Supabase ou dashboard apresentarem erro critico.
