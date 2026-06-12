# Validacao do MVP - AtendeZap IA

## Status
- parcialmente funcional: codigo preparado para eventos seguros, feedback, suporte e admin; depende de aplicar a migration `0024_app_events.sql` no Supabase.

## Eventos implementados
- `app_events` com RLS, allowlist de eventos e metadados seguros.
- Helper `trackSafeAppEvent` integrado ao `trackEvent` existente.
- Eventos cobertos: cadastro, onboarding, dashboard, geracao, copia, salvamento, templates, biblioteca, pricing, checkout, limite, suporte e feedback de IA.

## Feedback de IA
- Feedback positivo/negativo ja aparece apos gerar resposta.
- Comentario limitado a 500 caracteres.
- Nao salva pergunta nem resposta completa.

## Suporte
- `/suporte` publica com categoria, assunto, mensagem e e-mail quando visitante.
- `/api/support` associa `user_id` quando ha sessao e registra evento seguro.

## Admin
- `/admin` e `/api/admin/*` protegidos por login e `ADMIN_EMAILS`.
- Metricas usam `app_events` quando disponivel e mantem fallback para `events`.
- Diagnostico de funil segue regras simples, sem IA.

## Seguranca
- Service role apenas no servidor.
- Eventos bloqueiam e-mail, telefone, conteudo de pergunta/resposta, tokens, secrets, Stripe e pagamento.
- Falha ao registrar evento nao bloqueia o fluxo do usuario.

## Como testar
- Aplicar `supabase/migrations/0024_app_events.sql`.
- Definir `ADMIN_EMAILS` no ambiente.
- Criar conta, concluir onboarding, gerar resposta, copiar, salvar e avaliar.
- Abrir `/suporte` e criar uma solicitacao.
- Entrar com e-mail admin e abrir `/admin`.

## Pendencias
- Validar migration no Supabase remoto.
- Fazer smoke test real em Vercel depois do deploy.
