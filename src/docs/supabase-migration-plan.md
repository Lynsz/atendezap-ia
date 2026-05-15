# Plano de migração para Supabase

## Objetivo

Migrar o AtendeZap IA do armazenamento local em `localStorage` para uma arquitetura multi-tenant com Supabase, mantendo o MVP funcional durante a transição.

## Por que sair do localStorage

- Dados locais ficam presos ao navegador do usuário.
- Não há sincronização entre dispositivos.
- Não há controle real de acesso por equipe.
- Não há auditoria confiável.
- Webhooks da Kiwify precisam atualizar dados no servidor.
- Integrações futuras com WhatsApp e IA precisam de estado persistente.

## Estrutura das tabelas

- `tenants`: conta/empresa principal.
- `profiles`: usuários vinculados ao tenant.
- `organizations`: dados comerciais e preferências de IA.
- `leads`: clientes e oportunidades.
- `conversations`: conversas agregadas por cliente.
- `messages`: mensagens individuais.
- `automations`: regras e automações IA.
- `subscriptions`: plano, status e ciclo de cobrança.
- `webhook_events`: eventos recebidos de provedores externos.
- `audit_logs`: trilha básica de ações importantes.

## Ordem de implementação

1. Criar projeto Supabase.
2. Criar migrations das tabelas principais.
3. Configurar autenticação.
4. Implementar tenants e profiles.
5. Migrar organizations/settings.
6. Migrar leads, conversations e messages.
7. Migrar automations e logs.
8. Conectar subscriptions ao webhook da Kiwify.
9. Criar processo de importação dos dados locais.
10. Ativar leitura/escrita via serviços com fallback temporário para localStorage.

## RLS básica planejada

- Usuário autenticado só acessa registros do próprio `tenant_id`.
- `profiles` restringe leitura/escrita por papel.
- Service role processa webhooks e tarefas internas.
- Eventos de webhook não ficam abertos ao client.
- `audit_logs` são somente leitura para administradores.

## Variáveis de ambiente futuras

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Observação: o projeto atual usa Next.js; quando a conexão real for criada, alinhar os nomes com a stack final e evitar expor service role no client.

## Fluxo futuro

1. Usuário compra na Kiwify.
2. Webhook recebe evento no backend.
3. Backend cria/atualiza tenant, assinatura e perfil.
4. Usuário faz login.
5. Dados ficam vinculados ao `tenant_id`.
6. Atrasos, renovações e cancelamentos atualizam o status da assinatura.

## Checklist de migração

- Criar schema SQL.
- Criar políticas RLS.
- Criar serviços Supabase com contratos compatíveis com os adaptadores atuais.
- Criar importador de dados locais.
- Criar endpoint real de webhook Kiwify.
- Adicionar logs e auditoria.
- Testar com usuário Básico, Starter e Premium.
- Testar bloqueio por assinatura atrasada/cancelada.
- Remover dependência operacional de localStorage em produção.
