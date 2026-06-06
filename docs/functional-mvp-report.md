# Relatorio MVP Funcional - AtendeZap IA

## Status geral

- parcialmente funcional

O fluxo principal esta implementado e testavel localmente. A funcionalidade real de cadastro, login, onboarding, IA, biblioteca e assinatura depende das variaveis do Supabase, OpenAI e Stripe configuradas no ambiente.

## Fluxos funcionando

- Landing page publica carrega e explica que o produto gera respostas para copiar, ajustar e enviar manualmente.
- Cadastro e login usam Supabase Auth quando as variaveis publicas estao configuradas.
- Rotas privadas bloqueiam usuario anonimo: dashboard, onboarding, biblioteca, templates, assinatura e admin.
- Onboarding protegido salva o contexto do negocio em `businesses`.
- Dashboard permite preencher negocio, gerar resposta, copiar resposta, ver uso mensal e salvar resposta na biblioteca.
- API de IA roda server-side, valida sessao, aplica limite mensal antes da OpenAI e salva historico apenas apos sucesso.
- Usuario sem assinatura persistida usa limite free/trial em vez de ficar bloqueado antes da primeira resposta.
- Biblioteca lista, salva, copia, edita, duplica, favorita e exclui respostas do usuario autenticado.
- Templates por nicho aparecem na area protegida e podem ser copiados ou salvos na biblioteca.
- Assinatura mostra plano, uso, planos disponiveis, checkout Stripe e portal quando houver `stripe_customer_id`.
- Admin permanece protegido e agregado.

## Fluxos corrigidos

- `/onboarding` agora abre o onboarding protegido real em vez de redirecionar direto para `/dashboard`.
- Browser client do Supabase nao quebra o app no import quando variaveis publicas estao ausentes; a UI mostra erro amigavel de configuracao.
- Geracao autenticada com usuario novo sem linha em `subscriptions` agora usa o limite free seguro.

## Fluxos ainda pendentes

- Validar cadastro/login com Supabase real.
- Validar RLS com dois usuarios reais.
- Validar OpenAI real com `OPENAI_API_KEY`.
- Validar checkout, portal e webhook Stripe em modo teste.
- Validar envio Resend se o fluxo de e-mail for usado.
- Validar smoke manual completo no dominio local ou preview com variaveis reais.

## Variaveis necessarias

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Tabelas necessarias

- `profiles`
- `businesses`
- `generated_responses`
- `saved_responses`
- `subscriptions`
- `plans`
- `ai_response_feedback`
- `support_requests`
- `events`

O uso mensal e calculado por `generated_responses` no ciclo atual, sem tabela `ai_usage` separada.

## Como testar localmente

- Rodar `npm install`.
- Preencher `.env.local` com variaveis reais de teste, sem commitar o arquivo.
- Rodar `npm run dev`.
- Abrir `/`, criar conta, fazer login, concluir onboarding, gerar resposta, copiar, salvar, abrir `/dashboard/biblioteca`, copiar resposta salva, abrir `/assinatura`, iniciar checkout teste, voltar ao dashboard, sair e tentar acessar `/dashboard` sem login.
- Rodar `npm run validate` e `npm run test:e2e` antes de finalizar.

## Principais riscos

- Ambiente sem Supabase real impede auth, RLS e persistencia.
- Ambiente sem Stripe real impede checkout e portal, mas deve mostrar erro amigavel.
- Ambiente sem OpenAI usa fallback local; validar resposta real exige chave de teste.
- Migrations precisam estar aplicadas no Supabase de staging/producao.

## Proximo passo recomendado

- Executar smoke manual com Supabase, OpenAI e Stripe em modo teste, usando um usuario novo e um usuario admin separado.
