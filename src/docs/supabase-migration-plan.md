# Plano de migracao para Supabase

## Objetivo

Manter o Supabase como fonte final de verdade para usuarios, historico, planos, limites e assinaturas.

## Por que sair do localStorage

- Dados locais ficam presos ao navegador do usuario.
- Nao ha sincronizacao entre dispositivos.
- Nao ha auditoria confiavel.
- Webhooks da Stripe precisam atualizar assinaturas no servidor.
- Webhooks da Kiwify podem registrar origem do funil sem liberar assinatura recorrente.

## Estrutura das tabelas

- `profiles`: perfil do usuario.
- `businesses`: dados do negocio, servico ou atividade.
- `generated_responses`: historico de respostas.
- `customers`: clientes e leads do usuario.
- `subscriptions`: plano, status, limite e ciclo de cobranca.
- `stripe_webhook_events`: eventos idempotentes do billing principal.
- `events`: eventos internos e suporte operacional.

## Ordem de implementacao

1. Criar projeto Supabase.
2. Criar migrations das tabelas principais.
3. Configurar autenticacao.
4. Conectar `subscriptions` ao webhook da Stripe.
5. Registrar origem Kiwify em campos de aquisicao quando fizer sentido.
6. Ativar leitura/escrita via rotas seguras e service role onde necessario.

## Variaveis de ambiente

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Fluxo

1. Usuario entra pelo funil Kiwify ou pela pagina de precos.
2. Assinatura recorrente e criada na Stripe.
3. Webhook da Stripe recebe evento no backend.
4. Backend atualiza `subscriptions` no Supabase.
5. Dashboard le Supabase e aplica plano, status e limite.
