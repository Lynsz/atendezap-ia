# Correcao da Rota Demo sem OpenAI Key

## Status

* corrigido

## Problema

A rota publica de demo retornava 500 quando `OPENAI_API_KEY` estava ausente.

## Correcao aplicada

* Criado fallback local em `src/lib/demo/demo-fallback-response.ts`.
* A rota demo valida pergunta vazia e pergunta acima de 280 caracteres.
* A rota demo retorna `mode: "fallback_without_openai_key"` quando nao existe chave OpenAI usavel.
* A rota demo nao cria client OpenAI nem chama OpenAI antes de confirmar a chave.
* O fallback e local, nao exige login, nao depende do Supabase e nao retorna stack trace.
* A rota autenticada de IA nao foi alterada.

## Teste especifico

* `npm test -- src/app/api/demo/generate-response/route.test.ts` passou.
* Cenario confirmado: status 200, `answer` contem a mensagem enviada e `mode` e `fallback_without_openai_key`.

## Testes completos

* `npm test` passou com 59 arquivos e 253 testes.

## Validacoes

* `npm run check:secrets` passou.
* `npm run lint` passou.
* `npm run typecheck` passou.
* `npm run build` passou.
* `npm run validate` passou.

## Observacoes

* Demo publica pode usar fallback controlado sem OpenAI key.
* Geracao autenticada real continua exigindo OpenAI configurada e retorna erro amigavel quando a chave falta.
