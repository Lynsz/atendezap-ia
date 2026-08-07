# WhatsApp Embedded Signup — AtendeZap IA

## Objetivo

Permitir que cada negócio conecte sua própria conta WhatsApp Business ao AtendeZap IA.

## Pré-requisitos

- Meta App e produto WhatsApp configurados;
- configuração de Embedded Signup criada;
- permissões `whatsapp_business_management` e `whatsapp_business_messaging` aprovadas para o uso aplicável;
- webhooks configurados e URL pública HTTPS;
- migration `add_whatsapp_phase_6_embedded_signup.sql` aplicada;
- chave de criptografia de 32 bytes gerada e guardada somente no ambiente.

## Variáveis

```dotenv
NEXT_PUBLIC_META_APP_ID=
NEXT_PUBLIC_META_CONFIG_ID=
META_APP_SECRET=
META_GRAPH_API_VERSION=
WHATSAPP_EMBEDDED_SIGNUP_ENABLED=false
WHATSAPP_TOKEN_ENCRYPTION_KEY=
WHATSAPP_EMBEDDED_SIGNUP_REDIRECT_URI=
WHATSAPP_CONNECTION_HEALTHCHECK_ENABLED=false
INTERNAL_JOB_SECRET=
```

`WHATSAPP_TOKEN_ENCRYPTION_KEY` aceita 32 bytes em Base64 (opcionalmente com prefixo `base64:`) ou 64 caracteres hexadecimais. Não reutilize App Secret, service role ou outra chave.

## Fluxo

1. Usuário clica em conectar.
2. Fluxo da Meta é aberto pelo SDK oficial.
3. Usuário autoriza conexão.
4. Browser envia somente code, state e seletores mínimos ao backend.
5. Backend troca code por token, valida app/permissões e consulta os ativos autorizados.
6. Backend valida WABA e phone number e assina o app na WABA.
7. Token é criptografado e a conexão é vinculada ao usuário da sessão.
8. Dashboard mostra somente resumo e identificadores mascarados.

## Segurança

- token, App Secret e chave de criptografia nunca vão para o client;
- logs não salvam code, token, resposta OAuth ou payload bruto;
- usuário só vê sua conexão por RLS e validação server-side;
- env global é fallback apenas para registros `env_global`;
- desconexão remove a credencial criptografada e bloqueia novos envios;
- reautorização só substitui o token quando o novo fluxo conclui com sucesso.

## Healthcheck

Chame `POST /api/internal/whatsapp/connection-healthcheck` com `Authorization: Bearer <INTERNAL_JOB_SECRET>`. O job processa no máximo 20 conexões e só roda quando `WHATSAPP_CONNECTION_HEALTHCHECK_ENABLED=true`.

## Limitações

- depende da configuração, revisão e disponibilidade da Meta;
- a migration precisa ser aplicada antes de ativar a flag;
- não cria disparo em massa, campanha ou envio automático;
- o smoke real exige WABA e número de teste autorizados.
