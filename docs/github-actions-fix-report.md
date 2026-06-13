# Correcao do GitHub Actions - AtendeZap IA

## Status

- corrigido

## Erro real encontrado

- `npm ci` falhava antes dos checks com `package.json` e `package-lock.json` fora de sincronia.
- Erro especifico: entradas `@emnapi/core`, `@emnapi/runtime` e `@emnapi/wasi-threads` estavam inconsistentes no lockfile.
- Corrigido com atualizacao do `package-lock.json` via `npm install`, preservando `npm ci` no workflow.
- O workflow tambem recebeu envs de placeholder para nao depender de `.env.local` no CI.
- O secret scan foi ajustado para aceitar placeholders artificiais de CI como `sk_test_placeholder` e `whsec_placeholder` sem enfraquecer a deteccao de chaves reais.

## Warning Node.js 20

- Mitigado com `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`.
- Runtime do projeto atualizado para Node.js `24.x` no GitHub Actions.
- `actions/checkout` atualizado para `@v6`, versao oficial atual com suporte Node 24.
- `actions/setup-node` atualizado para `@v5`, versao oficial atual com runtime Node 24.

## Workflows alterados

- `.github/workflows/validate.yml`

## Comandos validados

- `npm ci`
- `npm run check:secrets`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run validate`

## Pendencias

- Confirmar a proxima execucao do job no GitHub Actions.

## Proximo passo

- Abrir novo push/PR e verificar se o job `Quality and security checks` passa sem warning de Node.js 20 e sem exit code 1.
