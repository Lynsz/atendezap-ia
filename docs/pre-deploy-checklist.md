# Checklist Antes do Deploy

## Codigo

- `npm run validate` passando
- branch correta
- ultimo commit revisado
- sem secrets no codigo
- sem `.env.local` no Git

## Vercel

- variaveis configuradas no painel
- ambiente correto selecionado
- dominio correto
- logs sem erro critico

## Stripe

- webhook configurado
- secret correto na Vercel
- checkout testado
- portal testado

## Supabase

- migrations aplicadas
- RLS ativa
- service role apenas server-side

## OpenAI

- API key apenas server-side
- limite/rate limit funcionando

## Resend

- API key apenas server-side
- envio do ebook validado
