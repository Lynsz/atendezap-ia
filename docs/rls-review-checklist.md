# Checklist de RLS - AtendeZap IA

## Tabelas que devem ser protegidas
- profiles
- subscriptions
- usage
- ai_responses
- saved_responses
- ai_response_feedback
- leads
- app_events
- data_requests
- admin-related tables, se existirem

## Regras esperadas
- usuario le apenas seus proprios dados
- usuario cria apenas seus proprios dados
- usuario atualiza apenas seus proprios dados
- usuario nao acessa dados de outro usuario
- admin acessa apenas via rota protegida
- service role nunca vai para o client

## Testes necessarios
- usuario A nao le dados do usuario B
- usuario A nao edita dados do usuario B
- usuario comum nao acessa admin
- APIs nao aceitam user_id vindo do client
