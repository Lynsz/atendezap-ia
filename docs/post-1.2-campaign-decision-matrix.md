# Matriz de Decisao - Campanha Pos-1.2

## Liberar campanha pequena se:

- versao 1.2 esta estavel
- sem bugs P0
- sem bugs P1 graves
- fluxo principal funciona
- IA funciona
- limite funciona
- checkout funciona
- webhook funciona
- suporte esta pronto
- tracking esta seguro
- custo da IA esta controlado

## Bloquear campanha se:

- bug P0 aberto
- bug P1 grave aberto
- checkout instavel
- webhook instavel
- IA instavel
- tracking principal quebrado
- suporte recebendo problema critico
- producao com erro recorrente
- staging/producao ainda sem validacao preenchida
- primeiras 24/72h ainda sem dados agregados suficientes

## Corrigir antes de campanha se:

- onboarding ainda confuso
- usuarios nao geram primeira resposta
- pricing gera duvida
- pagina por nicho tem baixa clareza
- CTA pos-demo fraco
- mensagens de erro confusas
- evento de conversao faltando

## Aplicar rollback se:

- producao quebra fluxo principal
- dados de usuario ficam expostos
- billing falha de forma critica
- IA falha para todos
- admin fica exposto
- erro 500 recorrente em rota critica

## Decisao atual

Bloquear campanha pequena por falta de evidencia pos-deploy preenchida. A campanha pode ser liberada somente depois de validacao de producao, monitoramento inicial, ausencia de P0/P1 e checklist final aprovado.
