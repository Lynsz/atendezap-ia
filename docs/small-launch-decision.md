# Decisao Pos-Lancamento Pequeno - AtendeZap IA

## Status

Repetir rodada pequena, mas somente depois de smoke real e checklist pre-lancamento aprovados.

Nao preparar campanha pequena ainda e nao avancar para lancamento publico controlado enquanto os dados do lancamento pequeno estiverem vazios.

## Motivos

- Os documentos atuais indicam planejamento e preparo local, mas nao registram usuarios convidados, visitantes, cadastros, onboardings, respostas, copias, salvamentos, checkouts, assinaturas, suporte ou feedbacks reais.
- Nenhum P0/P1 foi confirmado.
- O maior risco e operacional: validar Vercel, Supabase/Auth/RLS, OpenAI, Stripe, webhook, suporte, feedback, tracking e mobile em ambiente real.
- Decisoes de pricing, prompt e templates dependem de feedback e uso reais.

## Correcoes obrigatorias

- Validar ambiente real antes de convidar usuarios.
- Corrigir qualquer P0/P1 encontrado no smoke real.
- Garantir admin bloqueado para usuario comum.
- Garantir eventos seguros sem pergunta/resposta completa ou dados sensiveis.
- Garantir checkout, portal e webhook Stripe em modo teste.

## Melhorias recomendadas

- Medir abandono entre cadastro, onboarding e primeira resposta.
- Observar se usuarios copiam ou salvam a primeira resposta.
- Coletar feedback curto sobre clareza, utilidade e tom da resposta.
- Ajustar onboarding, dashboard, prompt ou templates apenas se o gargalo aparecer nos dados.

## Riscos

- Chamar usuarios sem ambiente real validado.
- Interpretar ausencia de dados como sinal positivo.
- Ajustar produto sem evidencia e aumentar complexidade do MVP.
- Liberar campanha paga antes de provar ativacao e checkout.

## Proxima acao

Rodar smoke real, preencher `docs/small-launch-checklist.md` e iniciar nova rodada pequena com poucos usuarios somente se nao houver P0/P1.
