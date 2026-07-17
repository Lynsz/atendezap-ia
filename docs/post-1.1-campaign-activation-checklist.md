# Checklist de Ativação — Campanha Pequena Pós-1.1

## Antes de divulgar

* [ ] CI verde — execução remota ainda não confirmada.
* [x] build passando — repetido com sucesso no fechamento desta etapa.
* [ ] produção estável — smoke autenticado e janela real de 72 horas não estão preenchidos.
* [x] `/api/health` ok — aprovado no smoke local.
* [x] nenhum P0 aberto — nenhum P0 foi confirmado nas evidências disponíveis.
* [ ] P1 críticos controlados — nenhum P1 de código foi confirmado, mas as integrações reais continuam sem validação.
* [ ] OpenAI funcionando — pendente no ambiente final.
* [ ] Stripe funcionando conforme ambiente — checkout, portal e webhook reais pendentes.
* [ ] Supabase/RLS validado — pendente aplicar migrations e testar com dois usuários reais.
* [x] admin protegido — bloqueio local sem autenticação aprovado; usuário comum autenticado em produção ainda precisa ser validado.
* [x] suporte funcionando — rota, validação, limites e mensagens aprovados localmente.
* [x] feedback funcionando — fluxo, motivo negativo e limites aprovados localmente.
* [x] tracking seguro validado — allowlist, sanitização e tolerância a falhas cobertas localmente.
* [x] landing revisada — CTAs, copy obrigatória, links legais, suporte e mobile aprovados localmente.
* [x] copy aprovada — mensagens condicionais documentadas e sem promessas proibidas.
* [x] UTMs preparadas — campanha `post_1_1_small_campaign` documentada.
* [x] plano de pausa pronto — critérios operacionais documentados.

## Durante a divulgação

Itens abaixo permanecem pendentes porque nenhuma divulgação foi autorizada ou iniciada.

* [ ] usar apenas mensagens aprovadas
* [ ] usar UTMs
* [ ] não prometer envio automático
* [ ] não prometer integração com WhatsApp
* [ ] não prometer resultado financeiro
* [ ] manter volume pequeno
* [ ] acompanhar erros críticos

## Depois da divulgação

Itens abaixo não se aplicam enquanto a campanha estiver bloqueada.

* [ ] revisar métricas
* [ ] revisar suporte
* [ ] revisar feedbacks
* [ ] revisar custo OpenAI
* [ ] revisar checkouts
* [ ] revisar erros
* [ ] decidir continuar, pausar ou corrigir

## Status

* aprovado: não
* aprovado com observações: não
* **bloqueado**

Motivo: faltam CI remoto, smoke autenticado de Preview/Production, RLS real, validações finais de OpenAI/Stripe e medição de custo e estabilidade. Nenhum canal deve ser ativado até esses bloqueadores serem resolvidos.
