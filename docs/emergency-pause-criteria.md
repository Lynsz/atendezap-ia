# Criterios de Pausa Imediata - AtendeZap IA

## Pausar anuncios imediatamente se:

- checkout quebrar
- webhook nao liberar plano
- IA falhar para multiplos usuarios
- login/cadastro quebrar
- dados de usuarios forem expostos
- admin ficar acessivel para usuario comum
- custo da IA subir de forma anormal
- pagina principal cair
- suporte receber bug critico recorrente
- tracking principal estiver quebrado
- tracking da campanha otimizada nao registrar page view ou CTA com UTM oficial
- usuarios nao conseguirem ativar apos cadastro
- custo da IA ficar descontrolado sem conversao
- campanha otimizada nao gerar primeira resposta apos cadastros/onboardings suficientes
- checkout ou webhook falhar durante qualquer teste de escala cautelosa
- recomendacao de `docs/optimized-campaign-analysis.md` continuar como `Sem dados suficientes`
- suporte aumentar por bug critico durante escala cautelosa
- checklist diario de escala indicar status critico
- relatorio de estabilidade operacional apontar checkout, webhook, IA, auth ou tracking critico
- analise pos-escala recomendar pausar ou corrigir antes de continuar

## Depois de pausar

- registrar incidente
- revisar logs
- corrigir causa
- validar em staging
- rodar smoke test
- so reativar campanha apos validacao
- atualizar `docs/post-go-live-72h-report.md` e `docs/post-go-live-daily-decision.md`
- atualizar `docs/optimized-campaign-analysis.md` e `docs/optimized-campaign-adjustment-plan.md`, se a pausa estiver ligada a campanha otimizada
- atualizar `docs/cautious-scale-report.md` e `docs/scale-contingency-plan.md`, se a pausa estiver ligada a escala
- atualizar `docs/cautious-scale-analysis.md`, `docs/post-scale-adjustment-plan.md` e `docs/operational-stability-report.md`, se a pausa ocorrer durante ou apos escala cautelosa
