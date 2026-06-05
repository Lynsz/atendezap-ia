# Operacao da Campanha Pos-1.2

## Antes de ativar

- validar checklist final
- registrar campanha no admin
- revisar UTM
- revisar orcamento pequeno
- revisar criterio de pausa
- revisar suporte
- revisar tracking
- confirmar ausencia de P0/P1
- confirmar checkout, webhook, IA, limites e health check

## Durante a campanha

- revisar metricas diariamente
- revisar leads
- revisar cadastros
- revisar onboarding
- revisar primeira resposta
- revisar checkouts
- revisar assinaturas
- revisar custo da IA
- revisar suporte
- revisar logs
- pausar imediatamente diante de bug critico

## Depois da campanha

- registrar resultados
- comparar nichos
- documentar aprendizados
- criar insights
- decidir manter, pausar, ajustar ou escalar com cautela
- consolidar `docs/post-1.2-campaign-analysis.md`
- revisar `docs/post-1.2-scale-decision.md`
- planejar a proxima variacao em `docs/post-1.2-next-variation-plan.md`

## Guardrails

- Comecar pequena.
- Nao escalar antes de analisar dados iniciais.
- Nao usar dados pessoais, respostas completas, IDs Stripe ou payloads de webhook em relatorios.
- Nao prometer envio automatico pelo WhatsApp.
- Nao escalar se a analise indicar `Sem dados suficientes`.
- Nao escalar sem primeira resposta, checkout/webhook estaveis, tracking confiavel, custo de IA controlado e suporte sob controle.
