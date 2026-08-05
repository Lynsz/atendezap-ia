# Integração WhatsApp — Fase 4 Mídias

## Objetivo

Receber, armazenar, visualizar e enviar mídias de forma segura e sempre assistida pelo usuário.

## Tipos suportados

- imagens: `image/jpeg`, `image/png` e `image/webp`;
- documentos: `application/pdf` e `text/plain` UTF-8;
- áudio, vídeo e sticker: identificação e metadados somente.

## Tipos bloqueados

- executáveis, scripts e extensões perigosas;
- `application/x-msdownload`, `application/x-sh`, `application/x-bat` e `application/javascript`;
- `text/html` e `image/svg+xml`;
- MIME desconhecido ou incompatível com extensão/assinatura do arquivo;
- formatos Office nesta fase, pois o projeto não possui antivírus/inspeção avançada;
- arquivo acima do limite configurado, limitado tecnicamente a 10 MB.

## Download

O webhook não baixa mídia. Ele cria `whatsapp_media` com `pending`. O job `POST /api/internal/whatsapp/download-media`, autenticado por segredo interno, adquire atomicamente o estado `downloading`, consulta metadados da Meta, valida tipo e tamanho antes do binário, baixa server-side e nunca persiste a URL temporária.

Mídias de áudio, vídeo e sticker recebem `skipped_unsupported`; arquivos perigosos recebem `blocked_type`; arquivos grandes recebem `blocked_size`.

## Storage

A migration cria o bucket privado `whatsapp-media`. O nome utilizado em runtime deve ser configurado em `SUPABASE_STORAGE_WHATSAPP_BUCKET`. Caminhos são gerados no servidor e nunca retornados ao dashboard. A service role permanece exclusivamente no backend.

## Preview

`GET /api/whatsapp/conversations/[id]/media` retorna somente metadados seguros e uma URL interna. `GET /api/whatsapp/media/[id]` exige login, revalida propriedade e transmite o arquivo com headers seguros. Imagens podem abrir em preview sob demanda; documentos são baixados como attachment. Arquivos bloqueados não abrem.

## Envio

1. O usuário escolhe uma conversa própria e prepara o upload em `POST /api/whatsapp/media/upload`.
2. O backend valida conteúdo, tipo, tamanho, extensão e propriedade e salva no bucket privado.
3. Nenhum envio ocorre no upload.
4. O usuário revisa uma legenda opcional, clica em enviar e confirma explicitamente.
5. `POST /api/whatsapp/conversations/[id]/send-media` revalida login, propriedade, conexão, opt-out, janela de 24 horas, arquivo, rate limit e idempotência.
6. O backend envia o arquivo ao endpoint de mídia da Cloud API e usa o media ID retornado para enviar imagem/documento.

Não é aceita URL externa escolhida pelo client nem número de telefone arbitrário.

## Segurança

- flags de download/upload começam desativadas;
- token Meta e service role ficam server-only;
- payload bruto, arquivo, URL temporária, legenda, telefone e caminho de storage não entram em logs, auditoria ou analytics;
- auditoria contém apenas ação, status, categoria segura e IDs internos;
- analytics aceita somente tipo, grupo MIME, faixa de tamanho, status, erro seguro e estado da janela;
- não há resposta automática, lote, campanha ou envio ao receber inbound.

## Retenção

Consulte `docs/whatsapp-media-retention-policy.md`. O fallback é 30 dias, com limpeza interna em lotes de até 50 arquivos.

## Fora do escopo

- OCR;
- transcrição automática;
- análise automática de documentos;
- antivírus avançado;
- disparo em massa;
- mídia em campanhas automáticas;
- template com header de mídia fora da janela.

## Referências técnicas

- [Coleção oficial da Meta — Media](https://www.postman.com/meta/whatsapp-business-platform/folder/ouu8ypo/media)
- [Supabase — buckets privados](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Supabase — controle de acesso no Storage](https://supabase.com/docs/guides/storage/security/access-control)
