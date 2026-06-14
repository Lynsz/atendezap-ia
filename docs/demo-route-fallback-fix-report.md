# Correcao da Rota Demo sem OpenAI Key

## Status

* corrigido

## Erro

A rota `/api/demo/generate-response` retornava 500 quando `OPENAI_API_KEY` estava ausente ou configurada com placeholder de CI.

## Correcao

* Criado fallback local em `src/lib/demo/demo-fallback-response.ts`.
* A rota demo agora trata placeholders como `test-openai-key` como ausencia de chave real.
* A rota demo nao cria client OpenAI nem chama OpenAI quando a chave real nao existe.
* A rota autenticada de IA nao foi alterada.

## Testes executados

* `npm test -- src/app/api/demo/generate-response/route.test.ts`
* `OPENAI_API_KEY=test-openai-key npm test -- src/app/api/demo/generate-response/route.test.ts`

## Observacoes

* O fallback retorna status 200, `mode: "fallback_without_openai_key"` e inclui a mensagem original do usuario.
