# Criterios de Pausa - Lancamento Pequeno AtendeZap IA

## Pausar se:

- cadastro/login quebrar
- onboarding quebrar
- IA falhar para multiplos usuarios
- dashboard quebrar
- respostas nao salvarem
- biblioteca quebrar
- checkout quebrar
- webhook quebrar
- usuario comum acessar admin
- dados de usuarios forem expostos
- muitos usuarios relatarem a mesma falha critica

## Nao precisa pausar por:

- erro visual pequeno
- texto confuso corrigivel
- sugestao de melhoria
- feedback negativo isolado
- baixa conversao inicial sem bug critico

## Apos pausar

- registrar problema
- corrigir
- rodar build
- validar producao
- atualizar relatorio
- so retomar apos smoke test

