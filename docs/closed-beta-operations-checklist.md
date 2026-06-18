# Checklist Operacional do Beta Fechado

## Antes de convidar usuarios

* [x] CI local validado com `npm run validate`
* [ ] GitHub Actions confirmado visualmente
* [ ] Vercel funcionando
* [ ] Supabase funcionando no ambiente real
* [ ] OpenAI funcionando no ambiente real
* [ ] Stripe teste funcionando no ambiente real
* [x] admin protegido por codigo/testes
* [x] suporte implementado com validacao e limites
* [x] feedback implementado com validacao e limites
* [ ] smoke test real aprovado
* [x] nenhum P0 confirmado nos documentos lidos

## Durante o beta

* [ ] acompanhar cadastros
* [ ] acompanhar onboardings
* [ ] acompanhar primeiras respostas
* [ ] acompanhar respostas copiadas
* [ ] acompanhar respostas salvas
* [ ] acompanhar acessos a assinatura
* [ ] acompanhar feedbacks negativos
* [ ] acompanhar suporte
* [ ] acompanhar erros 500
* [ ] acompanhar uso OpenAI
* [ ] acompanhar Stripe, se testado

## Depois do beta

* [x] consolidar feedback documental disponivel
* [x] listar bugs P0/P1 confirmados
* [x] priorizar correcoes
* [x] decidir proxima etapa documental
* [ ] repetir coleta com metricas reais
* [ ] atualizar relatorio com dados reais

## O que falhou ou ficou ausente

* Metricas reais do beta nao estao disponiveis no repositorio.
* Relatorios `docs/post-deploy-smoke-test-report.md` e `docs/production-smoke-test-final.md` nao existem com esse nome.
* Smoke test autenticado real ainda precisa ser repetido/confirmado.

## O que foi corrigido

* Copy de telas legadas ajustada para nao sugerir integracao WhatsApp, envio automatico ou CRM completo.
* Documentos pos-beta adicionados para decisao, analise, priorizacao e plano de correcao.

## O que precisa repetir

* Beta fechado com 3 a 10 usuarios reais e coleta de metricas.
* Smoke test real em Preview/Producao.
* Validacao de RLS no Supabase real com dois usuarios.
