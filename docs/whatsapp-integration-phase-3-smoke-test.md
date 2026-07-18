# WhatsApp — Smoke Test da Fase 3

Use somente conta, número e contato de teste autorizados. Mantenha `WHATSAPP_ENABLED=false` até banco, RLS e credenciais estarem confirmados.

## Banco

- [ ] Aplicar `supabase/migrations/create_whatsapp_integration_tables.sql` se a Fase 1 ainda não estiver aplicada.
- [ ] Aplicar `supabase/migrations/add_whatsapp_phase_3_idempotency.sql`.
- [ ] Confirmar RLS nas tabelas `whatsapp_*`.
- [ ] Confirmar que `anon` não possui grants e que `authenticated` só lê as próprias linhas permitidas.

## Webhook e idempotência

- [ ] Validar challenge GET e assinatura HMAC POST.
- [ ] Entregar o mesmo inbound duas vezes.
- [ ] Confirmar uma única `whatsapp_messages`, um evento com duplicata contabilizada e nenhum novo envio.
- [ ] Entregar `sent`, `delivered`, `read` e confirmar progressão.
- [ ] Reentregar o mesmo status e confirmar ausência de duplicação.
- [ ] Entregar status antigo após `read` e confirmar que não há regressão.

## Envio manual

- [ ] Abrir conversa dentro de 24h, revisar texto e confirmar envio.
- [ ] Repetir a mesma requisição com o mesmo `clientRequestId`; confirmar uma chamada ao provedor.
- [ ] Tentar conteúdo idêntico com nova chave em menos de dois minutos; confirmar bloqueio.
- [ ] Tentar enviar sugestão já marcada `sent`; confirmar bloqueio.
- [ ] Exceder o limite apenas em ambiente de teste e confirmar HTTP 429 seguro.

## Retry e falhas

- [ ] Simular 429/5xx: confirmar no máximo duas chamadas totais e `retryable=true`.
- [ ] Simular 401/403 ou rejeição permanente: confirmar uma chamada e `retryable=false`.
- [ ] Confirmar que UI só oferece retry para falha transitória.
- [ ] Confirmar ausência de resposta bruta da Meta em UI, logs e banco.

## Templates

- [ ] Cadastrar manualmente template aprovado da conexão de teste.
- [ ] Confirmar bloqueio para `pending`, `rejected`, `paused` e `disabled`.
- [ ] Confirmar bloqueio sem opt-in.
- [ ] Confirmar contagem exata de variáveis.
- [ ] Confirmar envio somente após clique e confirmação.

## Privacidade e operação

- [ ] Admin não mostra telefone nem conteúdo.
- [ ] `whatsapp_send_attempts` contém hash, não texto ou variáveis.
- [ ] `whatsapp_webhook_events` não contém payload bruto.
- [ ] `npm run validate` aprovado.
