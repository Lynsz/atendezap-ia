# Health Check - AtendeZap IA

## Endpoint

`/api/health`

## Objetivo

Validar se a aplicacao esta online.

## O que retorna

- status
- timestamp
- ambiente
- versao, se disponivel

## O que nao deve retornar

- secrets
- dados de usuario
- dados internos sensiveis
- chaves de API

## Uso

- validar deploy
- smoke test
- monitoramento simples
