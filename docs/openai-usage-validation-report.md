# Validacao OpenAI e Uso Mensal - AtendeZap IA

## Status

* aprovado

## Rota autenticada

* `POST /api/ai/generate-response` exige usuario autenticado via Supabase no servidor.
* A rota nao aceita `user_id` do client e usa `user.id` da sessao.
* `customerMessage` e validada, normalizada e limitada antes da geracao.
* A rota exige `user_profiles` antes de chamar a OpenAI.
* Ausencia de `OPENAI_API_KEY` retorna erro amigavel e nao chama OpenAI.

## Rota demo

* `POST /api/demo/generate-response` permanece publica e limitada por rate limit.
* Sem `OPENAI_API_KEY`, retorna status 200 com `mode: "fallback_without_openai_key"`.
* O fallback da demo e controlado e separado da rota autenticada real.

## Prompt

* O prompt usa contexto do usuario vindo de `user_profiles` e `businesses`.
* Campos vazios recebem fallback seguro.
* O prompt orienta resposta curta em portugues do Brasil para WhatsApp.
* O prompt proibe inventar preco, prazo, estoque, disponibilidade, endereco, entrega ou agenda.

## Limite mensal

* Uso mensal usa mes `YYYY-MM`.
* Registro de uso e criado quando ausente.
* Limite e validado antes da chamada OpenAI.
* Uso e incrementado somente depois de resposta gerada e salva.
* Falha da OpenAI nao incrementa uso.

## Logs e eventos

* Logs passam por sanitizacao e omitem conteudo de mensagem/resposta.
* Eventos de analytics permitem apenas metadados seguros, como plano, tipo de negocio, faixa de tamanho e uso.
* `first_response_generated` no dashboard nao envia pergunta nem resposta completa.

## Testes realizados

* `npm test -- src/app/api/ai/generate-response/route.test.ts`
* `npm test -- src/app/api/demo/generate-response/route.test.ts`
* `npm test -- src/lib/ai-response.test.ts src/lib/analytics/track-event.test.ts src/lib/usage-limits.test.ts`

## Correcoes aplicadas

* Adicionada checagem explicita de OpenAI configurada na rota autenticada.
* Rota autenticada agora exige `user_profiles` antes da geracao.
* Removido fallback falso para resposta vazia da OpenAI na geracao autenticada.
* Prompt reforcado com a regra obrigatoria sobre endereco e entrega.
* Testes adicionados para onboarding ausente, chave ausente e resposta vazia da OpenAI.

## Pendencias

* O helper legado `src/lib/mvp-openai.ts` ainda possui fallback sem OpenAI, mas nao e usado pela rota autenticada atual.

## Proximo passo recomendado

* Manter a rota autenticada sem fallback local de resposta e revisar o helper legado se ele voltar a ser usado.
