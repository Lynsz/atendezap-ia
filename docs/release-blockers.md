# Bugs Bloqueadores - AtendeZap IA

## P0 - Bloqueia release

- login quebrado
- cadastro quebrado
- IA quebrada
- checkout quebrado
- webhook quebrado
- dados entre usuarios expostos
- admin acessivel para usuario comum
- secrets expostos
- build quebrado

## P1 - Bloqueia campanha maior

- onboarding confuso/quebrado
- dashboard com erro critico
- limite mensal falhando
- demo publica sem rate limit
- pagina por nicho quebrada
- tracking principal quebrado
- mobile inutilizavel
- suporte indisponivel

## P2 - Pode ir para backlog

- ajuste visual pequeno
- copy secundaria
- melhoria de relatorio
- melhoria de filtro
- melhoria de documentacao

## Regra de decisao

- Qualquer P0 bloqueia release e producao.
- Qualquer P1 bloqueia campanha maior e escala cautelosa.
- P2 pode seguir para backlog se nao afetar conversao principal, seguranca, billing, privacidade ou suporte minimo.
