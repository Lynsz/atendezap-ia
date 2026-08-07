# Relatório — Integração WhatsApp Fase 6

## Status

- concluída com observações operacionais

## Embedded Signup

- Config pública autenticada, SDK client seguro, state anti-CSRF, exchange, debug de token, descoberta/validação de WABA e número e assinatura da WABA implementados.

## Conexão por usuário

- Sessão define o `user_id`; client não controla tenant. Status, desconexão e reautorização preservam propriedade.

## Armazenamento seguro de token

- AES-256-GCM server-only; sem grant da coluna ao role autenticado; ausência da chave bloqueia persistência.

## Multiempresa

- `connection_id` adicionado aos fluxos críticos, com backfill e índices. Fallback global restrito a `env_global`.

## Webhook

- Inbound e status são roteados pelo Phone Number ID e associados à conexão/usuário; evento desconhecido é ignorado sem criar dados órfãos.

## Envio

- Texto, template e mídia exigem conexão ativa do usuário e usam token/Phone Number ID da conexão.

## Templates

- Sync consulta a WABA e credencial da conexão correta.

## Mídia

- Metadados, download e upload carregam `connection_id`; chamadas à Meta usam a credencial correspondente.

## Admin

- Agregados de estados de conexão, falhas de signup, healthchecks e atividade por conexão, sem telefone completo ou token.

## Segurança

- RLS preservada; state assinado; IDs revalidados server-side; OAuth bruto e tokens excluídos de logs, responses e analytics.

## Testes

- `npm run validate`: aprovado em 07/08/2026.
- `check:secrets`, lint, TypeScript e build Next.js: aprovados.
- Vitest: 88 arquivos e 398 testes aprovados.
- Cobertura nova: config pública, state anti-CSRF, permissões, AES-256-GCM, complete/exchange, isolamento da autoridade de usuário, desconexão, healthcheck e RLS/grants da migration.
- Revisão React aplicada ao SDK, estados assíncronos e navegação condicional.

## Pendências

- aplicar migration no Supabase de cada ambiente;
- validar a migration em um banco local/remoto; a Supabase CLI não está instalada neste workspace;
- configurar/revisar o Meta App e permissões;
- executar smoke real com dois usuários e contas autorizadas;
- validar a versão Graph vigente antes da ativação;
- confirmar agenda externa do healthcheck, se necessária.

## Próxima fase recomendada

- Estabilização operacional da conexão multiempresa, rotação/revogação remota de credenciais e observabilidade de falhas reais, sem ampliar automação de envio.
