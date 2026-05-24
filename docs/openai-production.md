# OpenAI Producao

Nao coloque `OPENAI_API_KEY` real em codigo, documentacao ou variaveis publicas.

## Configuracao

1. Configurar `OPENAI_API_KEY` na Vercel Production.
2. Configurar `OPENAI_MODEL`.
3. Definir limite de custo na conta OpenAI.
4. Confirmar billing ativo.
5. Confirmar que nenhuma variavel `NEXT_PUBLIC_OPENAI_API_KEY` existe.

## Testes

- [ ] Abrir `/demo` no dominio final.
- [ ] Gerar resposta na demo publica.
- [ ] Criar conta e fazer login.
- [ ] Concluir onboarding.
- [ ] Gerar resposta no dashboard.
- [ ] Confirmar que o contexto do negocio foi usado.
- [ ] Confirmar historico salvo.
- [ ] Confirmar `usage_count` ou contagem mensal refletindo o uso.
- [ ] Confirmar limite mensal.
- [ ] Confirmar mensagem amigavel se a chave estiver ausente ou houver falha temporaria.

## Monitoramento de custo

- [ ] Revisar consumo diario na OpenAI.
- [ ] Revisar volume de respostas por usuario.
- [ ] Reduzir limites se houver uso inesperado.
- [ ] Acompanhar erros no dashboard e logs da Vercel.

## Seguranca

- `OPENAI_API_KEY` apenas no servidor.
- Nao registrar prompts completos com dados sensiveis em logs publicos.
- Nao retornar stack trace para o usuario.
- Revogar/rotacionar chave se for exposta.
