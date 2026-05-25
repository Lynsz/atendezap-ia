# Seguranca

Documento principal: [`../SECURITY.md`](../SECURITY.md).

Este arquivo existe para manter o indice de documentacao dentro de `docs/` simples de navegar. A fonte completa de seguranca do projeto continua sendo o arquivo raiz `SECURITY.md`.

## Complementos

- `docs/security-checklist.md`: checklist pratico de seguranca.
- `docs/supabase-security.md`: RLS, isolamento multiusuario e uso seguro do Supabase.
- `docs/stability-criteria.md`: criterios operacionais para decidir se o app esta estavel.

## Regras permanentes

- Nunca versionar `.env.local`.
- Nunca expor `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` ou `RESEND_API_KEY` no client.
- Manter webhooks com validacao de assinatura quando o segredo existir.
- Manter dados sensiveis protegidos por API backend, RLS e checagens de usuario/admin.
