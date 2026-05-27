# Ambientes - AtendeZap IA

## Local

Uso:

- desenvolvimento na maquina local
- usa `.env.local`
- nunca deve ser commitado

Validacoes:

- `npm run validate`
- `npm run check:secrets`
- `npm run build`
- `npm test`

## Preview/Staging

Uso:

- testar deploy antes da producao
- validar fluxo completo
- testar Stripe em modo teste
- testar Supabase de staging, se existir
- testar OpenAI com limites controlados
- testar Resend em modo seguro

## Producao

Uso:

- ambiente real de usuarios
- somente deploy apos validacao
- variaveis configuradas na Vercel
- Stripe producao apenas quando pronto
- monitoramento ativo

## Regra principal

Nenhuma alteracao deve ir para producao sem passar por validacao local e validacao em staging.
