# Deploy com Repositorio Privado

## GitHub

- manter repositorio privado
- revisar permissoes de colaboradores
- nao tornar publico sem auditoria de secrets
- ativar secret scanning, se disponivel

## Vercel

- conectar repositorio privado
- configurar variaveis no painel da Vercel
- nao colocar secrets no codigo
- revisar Production, Preview e Development envs

## Supabase

- manter service role apenas no servidor
- revisar RLS
- nunca expor service role no browser

## Stripe

- usar webhook secret apenas no servidor
- usar secret key apenas no servidor
- usar publishable key no client quando necessario

## OpenAI

- usar API key apenas em rotas server-side
- nunca chamar OpenAI direto do client
