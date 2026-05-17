# Plano de migracao para Supabase

## Objetivo

Migrar o AtendeZap IA para uma arquitetura com Supabase como fonte final de verdade para usuarios, historico, planos, limites e assinaturas.

## Por que sair do localStorage

- Dados locais ficam presos ao navegador do usuario.
- Nao ha sincronizacao entre dispositivos.
- Nao ha controle real de acesso por equipe.
- Nao ha auditoria confiavel.
- Webhooks do Asaas precisam atualizar assinaturas no servidor.
- Webhooks da Kiwify podem registrar origem do funil sem liberar assinatura recorrente.
- Integracoes futuras com WhatsApp e IA precisam de estado persistente.

## Estrutura das tabelas

- `tenants`: conta/empresa principal.
- `profiles`: usuarios vinculados ao tenant.
- `organizations`: dados comerciais e preferencias de IA.
- `leads`: clientes e oportunidades.
- `conversations`: conversas agregadas por cliente.
- `messages`: mensagens individuais.
- `automations`: regras e automacoes IA.
- `subscriptions`: plano, status e ciclo de cobranca.
- `asaas_webhook_events`: eventos idempotentes do billing principal.
- `webhook_events`: eventos recebidos de provedores externos legados ou auxiliares.
- `audit_logs`: trilha basica de acoes importantes.

## Ordem de implementacao

1. Criar projeto Supabase.
2. Criar migrations das tabelas principais.
3. Configurar autenticacao.
4. Implementar tenants e profiles.
5. Migrar organizations/settings.
6. Migrar leads, conversations e messages.
7. Migrar automations e logs.
8. Conectar `subscriptions` ao webhook do Asaas.
9. Registrar origem Kiwify em campos de aquisicao quando fizer sentido.
10. Criar processo de importacao dos dados locais.
11. Ativar leitura/escrita via servicos com fallback temporario para localStorage quando aplicavel.

## RLS basica planejada

- Usuario autenticado so acessa registros do proprio `tenant_id`.
- `profiles` restringe leitura/escrita por papel.
- Service role processa webhooks e tarefas internas.
- Eventos de webhook nao ficam abertos ao client.
- `audit_logs` sao somente leitura para administradores.

## Variaveis de ambiente

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ASAAS_API_KEY=
ASAAS_ENVIRONMENT=sandbox
ASAAS_WEBHOOK_TOKEN=
KIWIFY_WEBHOOK_SECRET=
```

## Fluxo futuro

1. Usuario entra pelo funil Kiwify ou pela pagina de precos.
2. Assinatura recorrente e criada no Asaas.
3. Webhook do Asaas recebe evento no backend.
4. Backend atualiza `subscriptions` no Supabase.
5. Usuario faz login.
6. Dashboard le Supabase e aplica plano, status e limite.
7. Atrasos, renovacoes e cancelamentos atualizam o status da assinatura.

## Checklist de migracao

- Criar schema SQL.
- Criar politicas RLS.
- Criar servicos Supabase com contratos compativeis com os adaptadores atuais.
- Criar importador de dados locais se necessario.
- Criar endpoint real de webhook Asaas.
- Manter webhook Kiwify apenas como aquisicao/funil.
- Adicionar logs e auditoria.
- Testar com usuario Starter, Pro e Premium.
- Testar bloqueio por assinatura atrasada/cancelada.
- Remover dependencia operacional de localStorage em producao.
