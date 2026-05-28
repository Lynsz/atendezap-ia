# Playbook Interno de Suporte — AtendeZap IA

## Problema: plano pago não liberou
- conferir Stripe
- conferir webhook
- conferir Supabase
- reenviar evento, se necessário
- documentar no incident-log

## Problema: IA não gera resposta
- conferir OpenAI
- conferir logs da rota
- conferir limite do usuário
- conferir rate limit

## Problema: usuário não consegue login
- conferir Supabase Auth
- conferir e-mail do usuário
- conferir logs
- orientar redefinição, se houver

## Problema: cobrança/cancelamento
- orientar portal Stripe
- conferir assinatura
- não solicitar dados de cartão

## Problema: exclusão/exportação
- seguir docs/data-export-process.md
- seguir docs/data-deletion-process.md
