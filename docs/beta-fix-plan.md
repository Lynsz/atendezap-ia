# Plano de correcoes pos-beta

Data: 2026-06-12

## P0

Nenhum P0 confirmado nos documentos revisados.

Antes de qualquer lancamento pequeno, validar obrigatoriamente:

- Deploy Vercel com variaveis reais.
- Supabase Auth.
- RLS das tabelas sensiveis.
- OpenAI em rota backend.
- Stripe checkout, portal e webhooks.
- Endpoint de eventos sem dados sensiveis.

## P1

- Melhorar clareza do onboarding.
- Simplificar CTA da primeira resposta.
- Reforcar prompt contra alucinacao de preco, prazo, estoque, agenda e disponibilidade.
- Garantir templates para temas comuns: preco, entrega, agendamento, disponibilidade, pagamento, orcamento, horario e pos-venda.
- Atualizar relatorios de beta com decisao e proximas acoes.

## P2

- Acompanhar feedback qualitativo de usuarios beta.
- Revisar copy de precos apos dados de conversao.
- Priorizar melhorias com base em eventos e tickets, nao em suposicoes.

## Verificacao esperada

Executar:

```bash
npm run lint
npm run typecheck
npm run build
npm run test
```

