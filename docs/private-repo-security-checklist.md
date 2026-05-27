# Checklist de Seguranca - Repositorio Privado

## Antes de qualquer commit

- verificar `git status`
- confirmar que `.env.local` nao aparece
- confirmar que nao ha chaves reais no codigo
- confirmar que `.env.example` nao tem valores reais
- confirmar que secrets estao apenas no `.env.local` e na Vercel

## Antes de qualquer push

- rodar `npm run lint`
- rodar `npm run typecheck`
- rodar `npm run build`
- rodar `npm run check:secrets`
- revisar arquivos alterados

## Nunca commitar

- `.env.local`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- tokens pessoais
- arquivos `.pem`, `.key`, `.cert`

## Se uma chave foi exposta

- revogar/rotacionar a chave no painel do servico
- atualizar `.env.local`
- atualizar variaveis na Vercel
- nao confiar na chave antiga
- revisar historico Git se necessario
