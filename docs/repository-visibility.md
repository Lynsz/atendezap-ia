# Visibilidade do Repositorio

## Decisao atual

O AtendeZap IA deve permanecer privado no GitHub.

## Motivos

- projeto usa chaves sensiveis
- integracoes de pagamento
- banco de dados com usuarios
- regras internas de negocio
- admin e webhooks
- produto ainda em evolucao

## Quando considerar tornar publico

Somente depois de:

- auditoria completa de secrets
- rotacao de chaves expostas
- remocao de arquivos sensiveis
- revisao do historico Git
- separacao de codigo sensivel
- versao preparada para portfolio

## Alternativa para portfolio

Criar um repositorio separado, limpo, sem secrets e sem logica sensivel.
