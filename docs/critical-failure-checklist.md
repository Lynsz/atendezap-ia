# Checklist de Falhas Criticas - AtendeZap IA

## Se checkout falhar
- pausar anuncios
- verificar Stripe
- verificar variaveis da Vercel
- verificar logs da API
- testar checkout em staging
- validar webhook
- documentar incidente

## Se IA falhar
- verificar `OPENAI_API_KEY`
- verificar limite/cota
- verificar logs da rota
- verificar rate limit
- mostrar mensagem amigavel ao usuario
- documentar incidente

## Se webhook falhar
- verificar `STRIPE_WEBHOOK_SECRET`
- verificar endpoint
- verificar eventos habilitados
- reenviar evento pelo painel Stripe
- validar assinatura no Supabase

## Se login falhar
- verificar Supabase Auth
- verificar variaveis publicas
- verificar middleware
- verificar cookies/session

## Se houver suspeita de vazamento
- pausar deploys
- remover acesso indevido
- rotacionar chaves
- revisar logs
- revisar historico Git, se necessario
- documentar incidente
