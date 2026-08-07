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
- migration `supabase/migrations/add_whatsapp_phase_4_media.sql` aplicada antes de habilitar mídias.
- migration `supabase/migrations/add_whatsapp_phase_5_template_sync.sql` aplicada antes de habilitar sincronização de templates.
- migration `supabase/migrations/add_whatsapp_phase_6_embedded_signup.sql` aplicada antes de habilitar conexões por usuário.

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
WHATSAPP_TEMPLATE_SYNC_ENABLED=false
WHATSAPP_TEMPLATE_CREATE_ENABLED=false
WHATSAPP_TEMPLATE_SYNC_LIMIT=
WHATSAPP_MEDIA_DOWNLOAD_ENABLED=false
WHATSAPP_MEDIA_UPLOAD_ENABLED=false
WHATSAPP_MAX_MEDIA_SIZE_MB=
WHATSAPP_MEDIA_RETENTION_DAYS=
SUPABASE_STORAGE_WHATSAPP_BUCKET=
INTERNAL_JOB_SECRET=
NEXT_PUBLIC_META_APP_ID=
NEXT_PUBLIC_META_CONFIG_ID=
META_APP_SECRET=
META_GRAPH_API_VERSION=
WHATSAPP_EMBEDDED_SIGNUP_ENABLED=false
WHATSAPP_TOKEN_ENCRYPTION_KEY=
WHATSAPP_EMBEDDED_SIGNUP_REDIRECT_URI=
WHATSAPP_CONNECTION_HEALTHCHECK_ENABLED=false
```

Não use prefixo `NEXT_PUBLIC_`. Defina explicitamente a versão Graph suportada pela sua conta, por exemplo no formato `vXX.X`, depois de confirmar a versão vigente na documentação oficial.

## Banco e RLS

1. Revise a migration.
2. Aplique-a no projeto Supabase do ambiente.
3. Confirme que todas as tabelas `whatsapp_*` têm RLS ativo.
4. Confirme que `authenticated` tem somente `SELECT`; escritas críticas usam service role em rotas server-side.
5. Confirme que o bucket configurado em `SUPABASE_STORAGE_WHATSAPP_BUCKET` existe e está privado.

## Mídias da Fase 4

- As flags de upload/download devem permanecer `false` até a migration, bucket privado e smoke estarem confirmados.
- O webhook nunca baixa arquivos. Um job controlado chama `POST /api/internal/whatsapp/download-media` com `Authorization: Bearer <INTERNAL_JOB_SECRET>`.
- A limpeza usa `POST /api/internal/whatsapp/cleanup-media` com o mesmo segredo e prazo de retenção configurado.
- Não registre o header Authorization, a URL temporária da Meta, o arquivo ou o payload do job.
- O bucket padrão criado pela migration chama-se `whatsapp-media`; configure o mesmo valor em runtime ou revise migration/env de forma coordenada.

## Templates Meta da Fase 5

- `WHATSAPP_TEMPLATE_SYNC_ENABLED` deve permanecer `false` até a migration, as permissões da WABA e o smoke controlado estarem confirmados.
- `WHATSAPP_TEMPLATE_SYNC_LIMIT` limita cada execução entre 1 e 200 templates; o fallback é 100.
- O dashboard usa `POST /api/whatsapp/templates/sync`; jobs controlados usam `POST /api/internal/whatsapp/sync-templates` com `INTERNAL_JOB_SECRET`.
- A sincronização usa `WHATSAPP_BUSINESS_ACCOUNT_ID` e `WHATSAPP_ACCESS_TOKEN` somente no servidor e não registra resposta bruta da Meta.
- `WHATSAPP_TEMPLATE_CREATE_ENABLED` deve permanecer `false`. A submissão via API não foi implementada; crie e aprove templates no WhatsApp Manager e depois sincronize.
- Templates pendentes, rejeitados, pausados, desativados, desconhecidos ou localmente ocultos/incompatíveis não podem ser enviados.

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
