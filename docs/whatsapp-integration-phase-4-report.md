# Relatório — Integração WhatsApp Fase 4

## Status

Concluída com observações operacionais.

## Mídia inbound

O parser reconhece image, document, audio, video e sticker, extrai somente IDs/metadados/caption permitida e normaliza desconhecidos como `unsupported`. O processador salva a mensagem, cria `whatsapp_media` pendente e não baixa nem chama IA com o arquivo.

## Download

Foi criado job interno autenticado, limitado a 20 itens por execução (10 por padrão). Ele consulta metadados da Meta, valida tipo/tamanho antes do binário, valida assinatura do arquivo e não persiste a URL temporária. Áudio, vídeo e sticker permanecem somente como metadados.

## Storage

A migration cria `whatsapp_media`, RLS por usuário, índices, relações de auditoria/tentativa e bucket privado de até 10 MB. Objetos ficam fora do banco e caminhos não são retornados ao client.

## Preview

As APIs de conversa e mídia revalidam sessão/propriedade. O arquivo é transmitido server-side com `private, no-store`, `nosniff`, CSP restritiva e bloqueio para estado suspicious/blocked.

## Envio de mídia

Upload outbound seguro e envio manual de imagem/documento foram implementados. O upload não envia. O envio exige confirmação, conversa/mídia do usuário, opt-out ausente, janela aberta, conexão ativa, validação repetida, rate limit e idempotência. A Cloud API recebe upload server-side e o envio usa media ID, nunca URL arbitrária do client.

## Segurança

Auditoria e tracking usam somente agregados/categorias. Admin exibe contagens e tipos agregados. Scanner cobre tokens Meta/Supabase/OpenAI/Stripe, bearer literal, HAR, URLs temporárias e dumps nomeados. Não há envio automático, lote, campanha, OCR ou transcrição.

## Retenção

Foi implementada rota interna de limpeza, com fallback de 30 dias e máximo de 50 objetos por execução. Ela remove o objeto, mantém a mensagem e marca a mídia como removida.

## Testes

Foram adicionados testes de parser, MIME/tamanho/assinatura, erro seguro da Meta, RLS/bucket privado, isolamento de preview/listagem, metadados de analytics e controles de envio. Em 18/07/2026, `npm run validate` passou: scanner de secrets, lint, TypeScript, build de produção com 74 páginas/rotas geradas e Vitest com 76 arquivos e 340 testes aprovados.

## Pendências

- aplicar `add_whatsapp_phase_4_media.sql` em cada ambiente;
- definir bucket/envs e segredos somente na Vercel/.env.local;
- confirmar bucket privado e RLS com dois usuários reais;
- executar smoke com conta Meta e contatos autorizados;
- configurar agenda externa controlada para download/limpeza, se necessária;
- avaliar antivírus antes de liberar Office, áudio, vídeo ou outros documentos;
- os arquivos de plano/relatório da Fase 2 e operações da Fase 3 citados no pedido estão ausentes.

## Próxima fase recomendada

Estabilização operacional com smoke real, métricas agregadas, monitoramento de custo/volume e eventual integração de inspeção antimalware. Não ampliar tipos nem automatizar envios sem evidência e revisão de política.
