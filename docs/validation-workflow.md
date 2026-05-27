# Esteira de Validacao - AtendeZap IA

## Objetivo

Evitar que codigo quebrado, secrets ou erros criticos sejam enviados para producao.

## Comando local

```bash
npm run validate
```

## O que o validate executa

- `check:secrets`
- `lint`
- `typecheck`
- `build`
- `test`

## GitHub Actions

A validacao roda em:

- pull requests
- pushes para `main`

## Seguranca

- nao usa secrets reais
- nao le `.env.local`
- usa apenas placeholders quando necessario
- nao torna o repositorio publico

## Antes de deploy

Rodar:

```bash
npm run validate
```
