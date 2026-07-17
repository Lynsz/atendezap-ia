# Integração WhatsApp — Fase 1

## Objetivo

Preparar a base segura da integração com a API oficial do WhatsApp Business/Cloud API.

## Escopo

- variáveis de ambiente server-only;
- webhook de verificação e recebimento;
- validação opcional da assinatura HMAC;
- armazenamento seguro com RLS;
- sugestão de resposta com IA sob demanda;
- envio aprovado manualmente pelo usuário;
- janela de atendimento de 24 horas e opt-out;
- logs, tracking e admin agregados;
- testes unitários e smoke test operacional.

## Fora do escopo

- disparo em massa ou spam;
- WhatsApp Web não oficial, scraping ou simulação de navegador;
- automação sem aprovação;
- CRM completo ou bot autônomo;
- campanhas automáticas;
- envio livre fora das regras da Meta;
- templates automáticos sem aprovação.

## Fluxo

1. A Meta verifica e envia eventos para `/api/whatsapp/webhook`.
2. O backend valida a assinatura quando `WHATSAPP_APP_SECRET` existe.
3. O inbound é normalizado, deduplicado e persistido; nenhum envio ocorre no webhook.
4. O usuário abre `/dashboard/whatsapp` e solicita uma sugestão.
5. A IA usa no máximo as 12 mensagens recentes e o perfil do negócio.
6. O usuário edita e confirma explicitamente o envio.
7. O backend revalida proprietário, conexão, opt-out e janela de 24 horas antes de usar a Cloud API.

## Critérios de sucesso

- webhook verifica corretamente;
- mensagens inbound são recebidas e salvas com segurança;
- usuário vê somente as próprias conversas e mensagens;
- IA sugere, mas não envia;
- envio usa Cloud API server-side somente após `confirmSend: true`;
- tokens não aparecem no client;
- eventos não salvam conteúdo ou telefone;
- testes, lint, typecheck, scanner de secrets e build passam.

## Liberação controlada

`WHATSAPP_ENABLED=false` é o padrão. A ativação exige migration aplicada, envs configuradas, webhook real verificado e smoke test aprovado.
