# Migrations Seguras - AtendeZap IA

## Antes de criar migration
- entender tabela afetada
- verificar dados existentes
- evitar DROP
- evitar apagar colunas com dados
- preferir alteracoes incrementais
- criar campos nullable quando necessario
- preencher dados em etapa separada, se necessario
- validar RLS

## Antes de aplicar em producao
- testar localmente
- testar em staging
- rodar npm run validate
- fazer backup ou confirmar backup disponivel
- revisar impacto em APIs
- revisar impacto no dashboard/admin

## Evitar
- DROP TABLE
- DROP COLUMN sem plano
- alterar tipo de coluna critica sem migracao gradual
- remover policy sem substituta
- desativar RLS em producao
- usar service role no client
