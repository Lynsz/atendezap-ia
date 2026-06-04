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

## Pos-deploy 1.2

Se a analise pos-deploy encontrar bug P0/P1, exposicao de dados, falha critica de billing, IA, auth, admin ou erro 500 recorrente, a campanha pos-1.2 fica bloqueada e o rollback deve ser avaliado antes de qualquer nova publicacao.

Se houver apenas falta de dados ou checklist incompleto, nao aplicar rollback automaticamente; manter producao em observacao e bloquear campanha.
