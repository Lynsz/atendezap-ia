# Validacao Local do MVP - AtendeZap IA

## Status

* parcialmente funcional

## Fluxos validados

* Landing carrega e contem o texto de que o sistema gera respostas para copiar, ajustar e enviar manualmente.
* Demo publica gera fallback local sem `OPENAI_API_KEY` e retorna `mode: "fallback_without_openai_key"`.
* Cadastro e login renderizam campos, validam entradas vazias e mostram erro amigavel.
* Rotas privadas e admin redirecionam usuario deslogado para login.
* Rotas privadas de IA, biblioteca, Stripe checkout, Stripe portal e admin retornam 401 sem sessao.
* Webhook Stripe retorna erro controlado quando Stripe nao esta configurado.
* Mobile validado sem overflow horizontal nas telas publicas principais e redirects privados.

## Correcoes aplicadas

* Migrado o guard de `middleware.ts` para `src/proxy.ts`, compatvel com Next.js 16, para aplicar redirect real em paginas privadas.
* Adicionado teste de regressao para o proxy de autenticacao.
* `/api/events` agora retorna `202` com `skipped: true` quando a persistencia de analytics nao esta configurada localmente.

## Bugs encontrados

* Paginas privadas retornavam 200 sem sessao porque o guard legado em `middleware.ts` nao era aplicado no runtime atual.
* `/api/events` retornava 500 em ambiente local sem `SUPABASE_SERVICE_ROLE_KEY`.
* Supabase Auth local retornou `Failed to fetch` no cadastro/login.

## Bugs pendentes

* Fluxo autenticado real completo ainda depende de Supabase Auth local funcional.
* Geracao real com OpenAI nao foi executada porque `OPENAI_API_KEY` esta vazia.
* Checkout/portal/webhook Stripe em modo teste nao foram executados porque secrets e Price IDs Stripe estao vazios.

## Seguranca

* `.env.local` esta ignorado e nao rastreado.
* `check:secrets` passou.
* Chaves sensiveis nao aparecem em variaveis `NEXT_PUBLIC_*`.
* RLS de `saved_responses`, `ai_usage` e eventos esta coberta por migracoes e testes.
* Logs e eventos sanitizam metadados e nao devem persistir pergunta/resposta completa.

## Proximo passo recomendado

* Configurar Supabase Auth, service role, OpenAI e Stripe test mode no `.env.local`, aplicar migrations no projeto Supabase e repetir o fluxo autenticado do cadastro ate gerar, copiar e salvar uma resposta real.
