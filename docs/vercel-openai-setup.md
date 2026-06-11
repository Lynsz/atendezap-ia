# Setup OpenAI na Vercel

## Variaveis

Configure na Vercel:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=
```

`OPENAI_MODEL` e opcional. Sem valor, o app usa o modelo padrao definido no backend.

## Regras

- Nunca usar `OPENAI_API_KEY` no client.
- Chamadas OpenAI devem ficar em rotas API ou libs server-side.
- Nao registrar prompts completos, respostas completas ou dados sensiveis em logs.
- Monitorar custo no painel da OpenAI apos liberar usuarios reais.

## Validacao

- Gerar uma resposta no dashboard com usuario autenticado.
- Confirmar que a resposta foi salva no historico.
- Confirmar que limite mensal foi respeitado.
- Remover temporariamente a chave em Preview deve exibir erro amigavel, sem nome de secret sensivel para o usuario.
