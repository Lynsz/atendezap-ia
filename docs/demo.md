# Demo publica do AtendeZap IA

## Rotas

- Pagina publica: `/demo`
- API server-side: `/api/demo/generate-response`

A demo permite que visitantes testem uma resposta de exemplo antes de criar conta ou assinar. Ela nao exige login, nao salva historico como usuario pagante e conduz o visitante para `/cadastro` e `/precos` depois da primeira resposta.

## Como testar

1. Acesse `/demo`.
2. Escolha o tipo de atuacao.
3. Escolha o tom de voz.
4. Clique em uma pergunta pronta ou digite uma pergunta real.
5. Clique em `Gerar resposta de exemplo`.
6. Confira a resposta na tela.
7. Clique em `Criar conta` e `Ver planos`.

## Limites aplicados

- Pergunta limitada a 280 caracteres no client e na API.
- Payload limitado a 8 KB na API.
- Rate limit por IP na rota `/api/demo/generate-response`.
- Limite atual: 6 geracoes a cada 10 minutos por IP.
- Erro amigavel quando o limite e excedido.

## Rate limit e Redis

A demo usa `src/lib/rate-limit.ts`.

Se `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` estiverem configuradas, o rate limit usa Upstash Redis. Se essas variaveis nao existirem ou o Redis estiver indisponivel, o projeto usa fallback local em memoria para manter o desenvolvimento funcionando.

O fallback em memoria e suficiente para ambiente local, mas em producao o recomendado e configurar Upstash para compartilhar limites entre instancias serverless.

## Fallback sem OpenAI

Se `OPENAI_API_KEY` nao estiver configurada, a API retorna uma resposta simulada util. Esse fallback existe apenas para desenvolvimento, preview e testes locais sem quebrar a experiencia.

Com OpenAI configurada, a chamada acontece somente no servidor. A chave nunca e enviada para o navegador.

## Validacao e seguranca

A API valida:

- pergunta obrigatoria;
- tamanho maximo da pergunta;
- tipo de atuacao permitido;
- tom de voz permitido;
- payload sem campos inesperados.

Os logs nao registram a pergunta completa nem a resposta gerada. Eles registram apenas evento, rota, status, IP resumido via rate limit, tipo de atuacao e tom.

## Tracking

Eventos usados na demo:

- `demo_view`
- `demo_example_click`
- `demo_generate_click`
- `demo_response_success`
- `demo_response_error`
- `demo_signup_cta_click`
- `demo_pricing_cta_click`

Se GA4 ou Meta Pixel nao estiverem configurados, a camada de tracking funciona como no-op seguro e nao quebra a pagina.

## UTMs e funil

Ao abrir `/demo`, a pagina chama a camada existente de atribuicao para preservar UTMs no navegador. Essa atribuicao pode ser reaproveitada nos proximos passos do funil, como cadastro, lead ou checkout.

CTAs conectados a demo:

- Home: `/demo`
- Ebook: `/demo`
- Obrigado do ebook: `/demo`
- Header: `/demo`

## Checklist rapido

- [ ] `/demo` abre sem login.
- [ ] Perguntas prontas preenchem o campo.
- [ ] Geracao funciona com OpenAI configurada.
- [ ] Fallback funciona sem `OPENAI_API_KEY`.
- [ ] Rate limit retorna erro amigavel apos excesso de tentativas.
- [ ] CTAs levam para `/cadastro` e `/precos`.
- [ ] Eventos da demo aparecem no GA4/Meta quando configurados.
- [ ] A pagina funciona bem no mobile.
