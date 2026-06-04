# Plano de Correcoes Pos-Deploy - Versao 1.2

## P0 - Corrigir imediatamente

- Nenhum P0 confirmado nesta analise.
- Se surgir P0 em auth, dashboard, IA, billing, privacidade ou admin, pausar campanha, registrar incidente e considerar rollback.

## P1 - Corrigir antes de campanha

- Preencher validacao real de staging.
- Preencher validacao real de producao.
- Validar checkout, portal Stripe, webhook e assinatura em modo seguro.
- Validar OpenAI/limites e Resend no ambiente final.
- Validar tracking no dominio final sem dados sensiveis.
- Revisar logs de producao e health check.

## P2 - Corrigir na proxima sprint

- Ajustar copy de onboarding, pricing, nichos ou demo se dados agregados mostrarem gargalo real.
- Melhorar mensagens de erro apenas se suporte/feedback indicar repeticao.
- Completar relatorios diarios com dados reais das primeiras 72h.

## P3 - Backlog futuro

- Melhorar automacao de alertas externos apenas se volume justificar.
- Persistir estimativa de tokens/custo de IA apenas se o monitoramento manual ficar insuficiente.

## Billing

- Validar checkout.
- Validar Customer Portal.
- Validar webhook Stripe.
- Validar assinatura ativa/past_due/canceled no Supabase.
- Validar pagamento falho.

## IA e limites

- Confirmar limite antes da chamada OpenAI.
- Confirmar que falha antes de persistir nao conta uso.
- Monitorar custo externo da OpenAI.
- Confirmar demo protegida por rate limit.

## Ativacao

- Confirmar cadastro, onboarding e primeira resposta.
- Medir abandono entre cadastro, onboarding e primeira resposta.
- Registrar apenas agregados.

## Conversao

- Confirmar pricing views, cliques de plano, checkout iniciado e assinatura.
- Nao declarar nicho ou CTA vencedor sem dados reais.

## Suporte

- Monitorar solicitacoes abertas.
- Classificar P0/P1/P2/P3.
- Nao registrar dados sensiveis em notas internas.

## Tracking

- Confirmar UTMs.
- Confirmar eventos principais.
- Confirmar ausencia de e-mail, telefone, pergunta, resposta, pagamento, token ou secret.

## Documentacao

- Atualizar relatorio pos-release com dados agregados.
- Atualizar matriz de decisao com liberar, bloquear, corrigir ou rollback.
- Atualizar campanha apenas apos checklist final aprovado.
