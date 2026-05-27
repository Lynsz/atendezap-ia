# Variaveis na Vercel - AtendeZap IA

## Production

Usar chaves de producao somente quando o produto estiver pronto.

## Preview

Usar chaves de teste/sandbox.

## Development

Usar chaves locais no `.env.local`.

## Variaveis publicas

Podem ter `NEXT_PUBLIC_`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## Variaveis privadas

Nunca devem ter `NEXT_PUBLIC_`:

- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`

## Regra

Se uma variavel e sensivel, ela deve existir apenas no servidor.
