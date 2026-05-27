# Checklist Antes do Push

## Antes de enviar codigo

- rodar `git status`
- confirmar que `.env.local` nao aparece
- rodar `npm run check:secrets`
- rodar `npm run validate`
- revisar arquivos alterados
- confirmar que nao ha chave real em codigo
- confirmar que migrations estao corretas
- confirmar que build passou

## Nao fazer push se:

- `check:secrets` falhar
- build falhar
- test falhar
- `.env.local` aparecer
- houver chave real em qualquer arquivo
- houver erro de TypeScript
