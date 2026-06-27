# Checklist Final do MVP - AtendeZap IA

## CI e qualidade

* [x] check:secrets passando em validacoes anteriores
* [x] lint passando em validacoes anteriores
* [x] typecheck passando em validacoes anteriores
* [x] build passando em validacoes anteriores
* [x] testes passando em validacoes anteriores
* [ ] GitHub Actions verde confirmado no GitHub
* [x] Node.js 24 configurado no CI

## Seguranca

* [ ] repositorio privado confirmado no GitHub
* [x] `.env.local` fora do Git
* [x] `.env.example` sem valores reais
* [x] nenhum secret real encontrado no codigo versionado pela auditoria local
* [x] nenhum secret real encontrado em docs/README/workflows pela auditoria local
* [x] nenhum secret real no workflow
* [x] OpenAI key apenas server-side
* [x] Stripe secret apenas server-side
* [x] Supabase service role apenas server-side
* [x] admin protegido por `requireAdmin`
* [x] RLS validado estaticamente nas migrations
* [x] logs seguros
* [x] eventos sem pergunta/resposta completa ou dados sensiveis
* [ ] RLS validado no Supabase real com dois usuarios

## Produto

* [x] landing funcionando em smoke local
* [ ] cadastro funcionando em Preview/Producao
* [ ] login funcionando em Preview/Producao
* [ ] logout funcionando em Preview/Producao
* [ ] onboarding funcionando em Preview/Producao
* [ ] dashboard funcionando em Preview/Producao
* [ ] geracao de IA funcionando em Preview/Producao
* [ ] copiar resposta funcionando em Preview/Producao
* [ ] salvar resposta funcionando em Preview/Producao
* [ ] biblioteca funcionando em Preview/Producao
* [ ] templates funcionando em Preview/Producao
* [ ] favoritos funcionando em Preview/Producao
* [ ] assinatura funcionando em Preview/Producao
* [ ] suporte funcionando em Preview/Producao
* [ ] feedback funcionando em Preview/Producao
* [x] admin protegido por codigo e testes

## Integracoes

* [ ] Supabase funcionando no ambiente real
* [ ] OpenAI funcionando no ambiente real
* [ ] Stripe checkout funcionando em teste no ambiente real
* [ ] Stripe webhook validado com assinatura no ambiente real
* [ ] Vercel funcionando com URL final testada
* [x] `/api/health` seguro

## Comunicacao

* [x] produto nao promete envio automatico
* [x] produto nao promete integracao com WhatsApp
* [x] produto nao promete CRM completo
* [x] produto nao promete resultado financeiro garantido
* [x] landing explica que a resposta deve ser copiada, ajustada e enviada manualmente

## Decisao

* [ ] MVP final aprovado
* [ ] MVP aprovado com observacoes
* [x] MVP bloqueado para fechamento final ate smoke real e validacoes externas
