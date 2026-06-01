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

## Depois de pausar

- registrar incidente
- revisar logs
- corrigir causa
- validar em staging
- rodar smoke test
- so reativar campanha apos validacao
- atualizar `docs/post-go-live-72h-report.md` e `docs/post-go-live-daily-decision.md`
- atualizar `docs/optimized-campaign-analysis.md` e `docs/optimized-campaign-adjustment-plan.md`, se a pausa estiver ligada a campanha otimizada
