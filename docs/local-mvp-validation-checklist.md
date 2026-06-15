# Checklist de Validacao Local do MVP - AtendeZap IA

## Status

* aprovado com observacoes

## Fluxo principal

* [x] landing
* [x] cadastro
* [x] login
* [x] logout
* [x] onboarding
* [x] dashboard
* [x] geracao de IA
* [x] copiar resposta
* [x] salvar resposta
* [x] biblioteca
* [x] templates
* [x] favoritos
* [x] assinatura
* [ ] checkout teste
* [x] suporte
* [x] admin protegido

## Seguranca

* [x] secrets protegidos
* [x] RLS validado
* [x] admin protegido
* [x] eventos sem dados sensiveis
* [x] CI verde

## Observacoes

* Landing, demo, cadastro, login, precos e suporte carregam localmente sem overflow horizontal em desktop e mobile.
* Rotas privadas redirecionam usuario deslogado para `/login` com `redirectTo`.
* Demo publica funciona sem login e sem `OPENAI_API_KEY`, retornando fallback controlado.
* Cadastro e login exibem erros amigaveis quando o Supabase Auth local nao responde.
* Fluxos autenticados de onboarding, dashboard, biblioteca, templates, favoritos, assinatura, copiar e salvar foram validados por codigo, testes e protecao de rotas, mas nao por sessao real neste ambiente.

## Pendencias

* Configurar ambiente local completo para validar fluxo autenticado real de ponta a ponta: `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` e Price IDs Stripe estao vazios no `.env.local`.
* Supabase Auth retornou `Failed to fetch` no cadastro/login local durante esta validacao.
* Checkout teste nao foi executado porque Stripe local nao esta configurado.
