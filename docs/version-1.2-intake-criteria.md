# Critérios de Entrada — Versão 1.2 AtendeZap IA

## Pode iniciar a versão 1.2 se

* versão 1.1 estável em ambiente real
* nenhum P0 aberto
* P1 críticos controlados
* campanha pequena analisada
* backlog pós-1.1 priorizado
* CI remoto verde
* produção estável e smoke autenticado aprovado
* custo OpenAI medido e sob controle
* suporte controlado
* segurança e RLS real validados

## Não iniciar se

* login/cadastro quebrado
* onboarding quebrado
* dashboard quebrado
* IA instável
* Stripe instável
* RLS inseguro
* admin exposto
* custo OpenAI anormal
* bugs P0 abertos
* dados insuficientes para priorizar implementação de produto

## Pendências permitidas

* Hipóteses P2 sem impacto crítico, desde que não sejam tratadas como fatos.
* Metas numéricas ainda sem baseline, desde que a Sprint 1 crie a medição necessária.
* Melhorias cosméticas adiadas e documentadas.
* Candidatos de produto condicionados à evidência coletada na Sprint 1.

## Bloqueadores

* GitHub Actions remoto não confirmado.
* Smoke autenticado de Preview/Production não preenchido.
* Migrations e RLS com dois usuários reais pendentes.
* OpenAI, Stripe Checkout, portal e webhook no ambiente final pendentes.
* Custo OpenAI e métricas reais do funil não medidos.

## Decisão atual

* Planejamento pode ser concluído.
* Execução da versão 1.2 permanece bloqueada até resolver os bloqueadores acima.
