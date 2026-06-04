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

# Atualizacao pos-1.2

Pausar campanha e considerar rollback se a release 1.2 apresentar:

- bug P0/P1 em login, cadastro, dashboard, IA, checkout, webhook, privacidade ou admin
- falha de checkout ou webhook recorrente
- IA falhando para multiplos usuarios
- admin acessivel para usuario comum
- dado sensivel em log, analytics ou relatorio
- erro 500 recorrente em rota critica

Depois da pausa:

- registrar incidente
- bloquear nova campanha
- validar staging
- rodar smoke test
- liberar novamente apenas apos aprovacao operacional

## Campanha pos-1.2

Pausar ou manter bloqueada se `docs/version-1.2-post-deploy-analysis.md` ou `docs/post-1.2-campaign-decision-matrix.md` indicar atencao, correcao obrigatoria ou dados insuficientes.

Se a campanha ja estiver ativa e surgir bug P0/P1, falha de checkout, webhook, IA, suporte critico, tracking quebrado ou dado sensivel em log/analytics, pausar imediatamente, preencher o relatorio diario e avaliar rollback pelos criterios da versao 1.2.

## Checklist operacional pos-1.2

Aplicar `docs/post-1.2-campaign-pause-checklist.md`. Registrar a campanha como `paused`, revisar logs seguros, corrigir, validar em staging, rodar smoke e somente reativar com nova aprovacao operacional.
