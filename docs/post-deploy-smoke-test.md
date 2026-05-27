# Smoke Test Pos-Deploy - AtendeZap IA

## Paginas publicas

- `/`
- `/demo`
- `/ebook`
- `/obrigado`
- `/precos` ou rota equivalente
- `/termos`
- `/privacidade`

## Fluxo principal

- criar conta de teste
- concluir onboarding
- gerar resposta
- salvar resposta, se disponivel
- copiar resposta
- acessar assinatura
- iniciar checkout teste, se ambiente permitir

## Admin

- usuario comum nao acessa admin
- admin autorizado acessa admin
- metricas basicas carregam

## Integracoes

- Supabase responde
- Stripe responde
- OpenAI responde
- Resend responde
- tracking nao gera erro no console

## Criterio de sucesso

Producao so e considerada saudavel se o fluxo principal funcionar sem erro critico.
