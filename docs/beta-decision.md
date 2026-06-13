# Decisao pos-beta

Data: 2026-06-12

## Decisao

Rodar nova rodada beta controlada antes de lancamento pequeno.

## Motivo

Os relatorios existentes nao trazem dados reais suficientes para aprovar lancamento publico. O MVP tem fluxo local e documentacao de validacao, mas ainda depende de smoke real em producao e coleta de metricas de ativacao.

## Condicoes para lancamento pequeno

- Smoke real em Vercel aprovado.
- Supabase Auth e RLS validados.
- OpenAI gerando respostas em backend.
- Stripe checkout, portal e webhooks testados.
- Eventos de ativacao chegando sem conteudo sensivel.
- Suporte e feedback recebendo registros.
- Ao menos uma rodada beta com indicadores preenchidos.

## Condicoes para nao lancar

- Erro recorrente de login, onboarding ou geracao.
- Falha de isolamento por usuario.
- Erro em checkout, portal ou webhook de pagamento.
- Prompt inventando preco, prazo, estoque, agenda ou disponibilidade.
- Falta de dados sobre primeira resposta, copia, salvamento e feedback.

