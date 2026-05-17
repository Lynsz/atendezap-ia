# Release Notes MVP

## O que foi preparado nesta rodada

- Checkouts oficiais Kiwify centralizados em `src/config/checkout.ts`.
- Botões de compra apontando para os planos Starter, Pro e Premium.
- Webhook Kiwify com parse seguro, segredo opcional, idempotência e eventos padronizados.
- Criação ou atualização de customer por e-mail.
- Geração de kit com eventos de sucesso/falha e preservação do token quando a IA falha.
- Registro de eventos para suporte e download de PDF.
- Schema Supabase com RLS habilitado e acesso público direto revogado.
- Documentação operacional para Kiwify, Supabase, Vercel, testes manuais e troubleshooting.

## Como configurar produção

1. Rodar `supabase/schema.sql` no Supabase.
2. Configurar variáveis na Vercel.
3. Conferir os checkouts em `src/config/checkout.ts`.
4. Configurar webhook na Kiwify.
5. Verificar domínio do Resend.
6. Definir `NEXT_PUBLIC_APP_URL` com o domínio final.

## Como testar

1. Rodar `npm run lint`.
2. Rodar `npm run typecheck`.
3. Rodar `npm run build`.
4. Seguir `docs/manual-test-checklist.md`.
5. Conferir eventos na tabela `events`.

## Limitações restantes

- Sem integração direta com WhatsApp API.
- Sem painel administrativo.
- Sem Supabase Storage para PDFs.
- Rate limit em memória não é compartilhado entre instâncias serverless.
- Conteúdo gerado por IA deve ser revisado pelo usuário.

## Próximos passos recomendados

- Adicionar verificação de assinatura HMAC se a Kiwify disponibilizar.
- Criar painel mínimo de pedidos e kits.
- Salvar PDFs em Supabase Storage se houver necessidade de auditoria/arquivo.
- Melhorar observabilidade com alertas externos.
