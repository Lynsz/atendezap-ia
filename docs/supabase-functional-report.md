# Supabase Funcional - AtendeZap IA

## Status
- parcialmente funcional

## Tabelas verificadas
- `businesses`, `generated_responses`, `customers`, `subscriptions`, `saved_responses`
- novas tabelas MVP: `user_profiles`, `ai_usage`

## Migrations criadas/corrigidas
- `supabase/migrations/0021_create_mvp_core_tables.sql`
- cria `user_profiles` e `ai_usage`
- reforca defaults/aliases de `subscriptions`
- garante `saved_responses.title` preenchido antes de tornar obrigatorio

## RLS e policies
- `user_profiles`: usuario autenticado seleciona, cria, edita e exclui apenas o proprio perfil
- `ai_usage`: usuario autenticado apenas le o proprio uso; escrita fica para backend/service role
- `saved_responses`: mantem isolamento por usuario e CRUD autenticado
- `subscriptions`: usuario autenticado apenas le a propria assinatura; webhook/backend atualiza com service role

## Fluxos conectados ao banco
- onboarding/dashboard salva `businesses` e sincroniza `user_profiles`
- dashboard le `user_profiles`, `businesses`, `subscriptions`, `saved_responses` e `ai_usage`
- geracao de IA verifica limite em `ai_usage` antes da OpenAI
- geracao de IA incrementa `ai_usage.count` somente apos sucesso e historico salvo
- pagina de assinatura le assinatura real e uso mensal em `ai_usage`
- webhook Stripe continua atualizando `subscriptions` via service role

## Pendencias
- aplicar a migration no projeto Supabase remoto/local
- gerar tipos oficiais do Supabase, se o projeto passar a usar types gerados
- revisar dados antigos apos migration para confirmar backfill de `user_profiles`

## Como aplicar no Supabase
- Local: `supabase db reset` ou aplicar a migration conforme o fluxo local do projeto
- Remoto: aplicar `supabase/migrations/0021_create_mvp_core_tables.sql` pelo Supabase CLI ou SQL Editor
- Depois validar login, onboarding, geracao de resposta, biblioteca e assinatura
