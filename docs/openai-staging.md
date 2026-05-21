# OpenAI staging

Use uma chave OpenAI de teste/operacional com limite de custo definido antes de validar staging.

## Variaveis

```text
OPENAI_API_KEY=
OPENAI_MODEL=
```

`OPENAI_API_KEY` fica somente no servidor. Nunca crie `NEXT_PUBLIC_OPENAI_API_KEY`.

Se `OPENAI_MODEL` ficar vazio, o codigo usa o modelo default definido nas rotas/libs. Em staging, configure explicitamente o modelo escolhido para evitar diferenca com producao.

## Testar dashboard

1. Configure Supabase staging e crie usuario.
2. Configure negocio no dashboard.
3. Gere resposta com uma pergunta real.
4. Confirme resposta na tela.
5. Confirme historico salvo em `generated_responses`.
6. Confirme uso mensal atualizado.
7. Teste usuario no limite mensal e confirme erro amigavel.

## Testar demo publica

1. Acesse `/demo`.
2. Escolha tipo de atuacao e tom.
3. Clique em pergunta pronta.
4. Gere resposta.
5. Confirme resposta real quando `OPENAI_API_KEY` existe.
6. Remova a chave em um ambiente separado ou use local sem chave e confirme fallback controlado.

## Monitorar custo e seguranca

- Defina limite de uso/custo na conta OpenAI.
- Acompanhe logs de erro na Vercel.
- Nao envie senha, token, cartao ou dados sensiveis em prompts.
- Confirme que a chave nao aparece no HTML, bundle client ou variaveis `NEXT_PUBLIC_*`.
- Prefira perguntas de teste sem dados reais de clientes.
