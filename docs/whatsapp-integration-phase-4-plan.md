# Integração WhatsApp — Fase 4

## Objetivo

Adicionar suporte seguro para recebimento, armazenamento, visualização e envio manual de mídias no WhatsApp.

## Escopo

- mensagens inbound com mídia;
- metadados de mídia;
- download controlado;
- armazenamento seguro;
- visualização no dashboard;
- envio manual de imagem/documento;
- bloqueio de tipos perigosos;
- limite de tamanho;
- retenção/limpeza;
- testes;
- documentação.

## Fora do escopo

- disparo em massa de mídia;
- campanha automática;
- bot autônomo;
- WhatsApp Web não oficial;
- envio automático ao receber mídia;
- OCR automático;
- transcrição automática de áudio;
- leitura automática de documentos;
- envio de mídia para contatos sem opt-in;
- envio fora das regras da Meta;
- antivírus avançado;
- storage público sem controle.

## Decisões técnicas

- O webhook apenas normaliza e salva metadados; nunca baixa arquivo.
- Um job autenticado por `INTERNAL_JOB_SECRET` processa mídias pendentes quando `WHATSAPP_MEDIA_DOWNLOAD_ENABLED=true`.
- O bucket `whatsapp-media` é criado privado pela migration. Operações de arquivo usam service role somente no servidor.
- Preview e download passam por rota autenticada que revalida `user_id` e transmite o arquivo com `no-store` e `nosniff`.
- Upload outbound aceita inicialmente JPEG, PNG, WebP, PDF e texto UTF-8; não envia automaticamente.
- Áudio, vídeo e sticker ficam somente como metadados nesta fase.
- Formatos executáveis, HTML, SVG, JavaScript e MIME desconhecido são bloqueados.
- O limite efetivo é o menor entre a configuração (máximo de 10 MB) e as regras do bucket.

## Critérios de sucesso

- mídia inbound é reconhecida;
- metadados são salvos sem payload bruto;
- arquivo é baixado apenas server-side;
- arquivo é armazenado com segurança;
- usuário vê mídia no dashboard;
- envio de mídia exige confirmação explícita;
- tipos perigosos são bloqueados;
- arquivos grandes são bloqueados;
- logs não expõem conteúdo sensível;
- testes passam;
- build passa.
