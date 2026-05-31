# Plano de Deploy do Go-Live - AtendeZap IA

## Antes do deploy

- validar staging
- rodar `npm run validate`
- revisar secrets
- revisar variaveis da Vercel
- revisar Stripe
- revisar Supabase
- revisar OpenAI
- revisar Resend
- revisar tracking
- confirmar rollback

## Durante o deploy

- acompanhar Vercel
- validar build
- validar logs
- validar health check
- nao ativar campanha antes do smoke test

## Apos o deploy

- rodar smoke test
- testar demo
- testar cadastro
- testar onboarding
- testar geracao de IA
- testar checkout
- testar webhook
- testar assinatura
- testar suporte
- revisar logs
- registrar resultado no `final-qa-report`
