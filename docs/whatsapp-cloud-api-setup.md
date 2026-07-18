# Setup WhatsApp Cloud API — AtendeZap IA

## Objetivo

Configurar a integração oficial com WhatsApp Cloud API sem expor credenciais no navegador ou no repositório.

## Pré-requisitos

- Conta Meta Business e app Meta com o produto WhatsApp;
- Phone Number ID e WhatsApp Business Account ID;
- Access Token com permissões mínimas necessárias;
- Webhook Verify Token forte e exclusivo;
- App Secret para validação HMAC em produção;
- URL HTTPS pública do app;
- migrations `supabase/migrations/create_whatsapp_integration_tables.sql` e `supabase/migrations/add_whatsapp_phase_3_idempotency.sql` aplicadas.

## Variáveis

Configure somente na Vercel ou em `.env.local`:

```dotenv
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
WHATSAPP_API_VERSION=
WHATSAPP_ENABLED=false
```

Não use prefixo `NEXT_PUBLIC_`. Defina explicitamente a versão Graph suportada pela sua conta, por exemplo no formato `vXX.X`, depois de confirmar a versão vigente na documentação oficial.

## Banco e RLS

1. Revise a migration.
2. Aplique-a no projeto Supabase do ambiente.
3. Confirme que todas as tabelas `whatsapp_*` têm RLS ativo.
4. Confirme que `authenticated` tem somente `SELECT`; escritas críticas usam service role em rotas server-side.

## Webhook

Endpoint público:

```text
https://SEU_DOMINIO/api/whatsapp/webhook
```

Na Meta, use o mesmo valor de `WHATSAPP_VERIFY_TOKEN` e assine o campo `messages`. O GET devolve o challenge apenas quando modo e token conferem. O POST valida `X-Hub-Signature-256` quando `WHATSAPP_APP_SECRET` está presente.

Sem App Secret, a validação HMAC fica explicitamente desativada para desenvolvimento/teste. Em produção, configure o segredo antes de habilitar o recurso.

## Ativar a conexão

1. Defina as envs e faça novo deploy.
2. Acesse `/dashboard/whatsapp/configuracao`.
3. Informe o nome do negócio e clique em “Ativar conexão”.
4. A tela mostra somente identificadores mascarados; tokens nunca são retornados.

## Regras importantes

- não fazer disparos em massa;
- não iniciar conversa sem opt-in;
- respeitar a janela de atendimento de 24 horas;
- fora da janela, usar somente template aprovado, da mesma conexão, com opt-in e confirmação manual;
- não configurar cron, fila ou endpoint interno: a Fase 3 usa processamento síncrono idempotente;
- não usar WhatsApp Web não oficial;
- não expor tokens, payloads brutos ou conteúdo em logs/analytics.

## Teste

- verificar o webhook;
- enviar uma mensagem inbound de um contato de teste autorizado;
- confirmar mensagem e janela no banco/dashboard;
- gerar e editar uma sugestão;
- aprovar manualmente o envio;
- confirmar status no banco e no aparelho de teste.

Referências: [coleção oficial da Meta para WhatsApp Cloud API](https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api) e [RLS no Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).
