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

## Depois de pausar

- registrar incidente
- revisar logs
- corrigir causa
- validar em staging
- rodar smoke test
- so reativar campanha apos validacao
