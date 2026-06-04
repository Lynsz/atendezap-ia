# Criterios de Rollback - Versao 1.2

## Aplicar rollback se:

- login/cadastro quebrar
- dashboard quebrar
- IA falhar para multiplos usuarios
- checkout quebrar
- webhook nao atualizar assinatura
- dados de usuarios forem expostos
- admin ficar acessivel para usuario comum
- build/deploy quebrar producao
- erro 500 recorrente em rota critica

## Nao precisa rollback imediato se:

- bug visual pequeno
- texto com erro simples
- metrica admin indisponivel
- relatorio interno nao carrega, sem afetar usuario final
- documentacao incompleta

## Apos rollback

- pausar campanha
- registrar incidente
- corrigir em branch separada
- validar em staging
- rodar smoke test
- redeploy apenas apos validacao

