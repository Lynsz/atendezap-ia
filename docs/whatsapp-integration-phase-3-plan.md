# WhatsApp — Plano da Fase 3

## Objetivo

Tornar a integração oficial da WhatsApp Cloud API resistente a reentregas, duplo clique, limites do provedor e falhas transitórias, sem transformar o produto em automação de disparos.

## Contexto encontrado

O repositório continha a Fase 1, mas não os artefatos esperados da Fase 2. A implementação inclui somente a ponte mínima necessária: ingestão de status de mensagens e cadastro/leitura/envio manual de templates oficiais. Não foi adicionada sincronização automática, campanha ou envio em lote.

## Entregas

1. Persistência idempotente de eventos inbound e status em `whatsapp_webhook_events`.
2. Status `sent`, `delivered`, `read` e `failed` aplicados sem regressão de estado.
3. Tentativas de envio em `whatsapp_send_attempts`, com fingerprint SHA-256 e sem conteúdo.
4. Rate limit por usuário, conversa e template.
5. Um retry interno, curto e limitado, somente para falhas transitórias.
6. Erros da Meta normalizados em categorias seguras.
7. Auditoria operacional mínima, sem payload, telefone, token ou corpo de mensagem.
8. Templates somente se aprovados, ligados à conexão correta, com opt-in e confirmação manual.
9. Métricas agregadas no admin e UX de falha/retry no dashboard.

## Decisão sobre fila

O webhook permanece síncrono e limitado a 500 eventos por requisição. As operações atuais são curtas e já possuem aquisição idempotente antes da lógica de negócio. Uma tabela de fila sem worker durável real criaria estados órfãos e nova superfície de ataque. Portanto, `whatsapp_processing_queue`, `/api/internal/whatsapp/process` e `INTERNAL_JOB_SECRET` não foram ativados.

Reavaliar uma fila somente quando houver trabalho demorado mensurável, timeout real ou volume que ultrapasse a execução segura da Vercel. Nesse caso, exigir autenticação interna forte, claim atômico, máximo de tentativas, dead-letter e nenhum payload bruto.

## Critérios de aceite

- webhook repetido não duplica mensagem nem atualiza contato/conversa novamente;
- mesmo request ID não chama a Meta duas vezes;
- conteúdo idêntico já enviado recentemente é bloqueado;
- sugestão `sent` não pode ser reenviada;
- falha transitória tenta no máximo duas chamadas totais;
- falha permanente não é repetida;
- template pendente/rejeitado não é enviado;
- nenhum fluxo envia mensagem automaticamente.
