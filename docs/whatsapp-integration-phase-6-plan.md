# Integração WhatsApp — Fase 6 Embedded Signup e Multiempresa

## Objetivo

Permitir que cada negócio conecte sua própria conta WhatsApp Business ao AtendeZap IA de forma segura, preparando o SaaS para uso multiempresa.

## Contexto encontrado

- As fases 1, 3, 4 e 5 estavam implementadas; plano e relatório da Fase 2 não existem no repositório.
- `whatsapp_connections` já existia com `user_id`, Phone Number ID, WABA e RLS, mas sem token por conexão.
- Envio, mídia e templates usavam exclusivamente `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` e `WHATSAPP_BUSINESS_ACCOUNT_ID` globais.
- O webhook já extraía `phone_number_id`, porém status outbound ainda não era isolado explicitamente por conexão.
- Dashboard exibia configuração global mascarada; admin já usava somente agregados.
- Idempotência, rate limit, janela de 24h, opt-in/opt-out, confirmação manual e scanner de secrets já existiam.

## Escopo

- Embedded Signup/OAuth;
- conexão por usuário;
- armazenamento seguro de credenciais;
- associação de WABA e Phone Number ID ao usuário correto;
- status, desconexão, reautorização e saúde da conexão;
- adaptação das APIs para usar conexão do usuário;
- auditoria segura, documentação e testes.

## Fora do escopo

- disparo em massa, campanha automática ou bot autônomo;
- WhatsApp Web não oficial;
- CRM completo ou suporte multiatendente completo;
- envio automático sem aprovação humana;
- importação em massa de contatos ou automação de marketing;
- billing avançado da Meta.

## Decisões técnicas

1. O usuário autenticado da sessão é a única autoridade de tenant.
2. WABA e Phone Number ID recebidos do browser são apenas seletores e precisam pertencer aos ativos retornados server-side pela Meta.
3. Tokens são criptografados com AES-256-GCM e nunca recebem grant para o client.
4. O `state` anti-CSRF é assinado, expira em dez minutos e é vinculado ao usuário.
5. `connection_id` acompanha mensagens, mídia, sugestões, auditoria, webhooks e tentativas.
6. Conexões `embedded_signup` usam o próprio token; fallback global só atende `env_global` explicitamente.
7. Desconexão invalida o token local e bloqueia novos envios, preservando histórico.
8. Healthcheck é interno, limitado e desativado por padrão.

## Riscos e controles

- Mistura entre tenants: queries exigem `user_id` e `connection_id`; webhook roteia pelo Phone Number ID.
- Token exposto: coluna sem grant, helper `server-only`, criptografia autenticada e respostas mascaradas.
- OAuth adulterado: state assinado, code trocado no backend e token validado com `/debug_token`.
- Ativo escolhido pelo client: WABA e número são reconsultados e comparados no servidor.
- Credencial expirada: status `needs_reauth`, bloqueio de envio e healthcheck seguro.
- Compatibilidade: dados antigos são backfilled e `env_global` permanece como fallback controlado.

## Critérios de sucesso

- usuário inicia conexão WhatsApp pelo dashboard;
- callback/exchange é processado server-side;
- WABA/Phone Number ID são validados no servidor;
- conexão é salva vinculada ao usuário correto;
- tokens não aparecem no client;
- APIs de envio usam a conexão do usuário;
- webhook roteia eventos para o usuário correto pelo Phone Number ID;
- usuário consegue desconectar;
- admin vê agregados seguros;
- testes e build passam.
