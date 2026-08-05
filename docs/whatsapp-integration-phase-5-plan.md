# Integração WhatsApp — Fase 5 Templates Meta

## Objetivo

Sincronizar e governar templates do WhatsApp com mais segurança, aproximando os templates locais do status real na Meta.

## Contexto encontrado

- `whatsapp_templates` já existia com nome, idioma, categoria, status e quantidade de variáveis.
- A Fase 3 já enviava template aprovado manualmente, com opt-in, confirmação, idempotência e rate limit.
- Existia somente `GET /api/whatsapp/templates`; não havia sync, histórico remoto, CRUD de rascunho ou página dedicada.
- `WHATSAPP_BUSINESS_ACCOUNT_ID` já era server-only e também era salvo na conexão.
- Erros da Meta já eram normalizados em categorias seguras por `whatsapp-errors.ts`.
- Auditoria usava `whatsapp_audit_log`; admin mostrava apenas agregados.
- Os planos/relatórios da Fase 2 e `whatsapp-integration-phase-3-operations.md` citados no pedido não existem no repositório.

## Escopo

- sincronização de templates da Meta;
- status local e status remoto;
- histórico de status;
- validação de categoria, idioma e componentes;
- variáveis de template;
- envio apenas de templates aprovados;
- UX de templates no dashboard;
- admin com agregados seguros;
- auditoria segura;
- documentação;
- testes.

## Fora do escopo

- disparo em massa;
- campanha automática;
- bot autônomo;
- WhatsApp Web não oficial;
- CRM completo;
- automação sem aprovação humana;
- envio automático de template;
- criação massiva de templates;
- importação de contatos em massa;
- marketing automation.

## Decisões

1. A Meta é a autoridade para `remote_status`; o client nunca altera esse campo.
2. Templates sincronizados não podem ser editados localmente; exclusão vira ocultação com histórico.
3. Rascunhos locais podem ser criados/editados, mas nunca são considerados aprovados.
4. Sync usa paginação por cursor, limite máximo de 200 e flag desativada por padrão.
5. Componentes remotos são reduzidos à estrutura necessária; exemplos e valores reais não são salvos.
6. Headers não textuais e botões dinâmicos ficam `unsupported` nesta fase.
7. Submissão à Meta foi adiada. A configuração global por ambiente e a ausência de smoke real ainda não oferecem governança suficiente para criação remota.

## Critérios de sucesso

- templates da Meta são sincronizados com segurança;
- status remoto é refletido localmente;
- templates rejeitados não podem ser enviados;
- templates pendentes não podem ser enviados;
- templates desativados não podem ser enviados;
- envio exige confirmação explícita;
- opt-out bloqueia envio;
- rate limit continua ativo;
- logs não expõem payload bruto;
- testes passam;
- build passa.
