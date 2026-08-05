# Política de Retenção de Mídias WhatsApp

## Objetivo

Reduzir risco de armazenamento desnecessário de arquivos recebidos e enviados.

## Regras

- armazenar apenas mídia necessária para atendimento;
- manter o bucket privado;
- servir arquivo somente após autenticação, autorização e, quando aplicável, URL temporária;
- bloquear arquivos perigosos, MIME desconhecido e arquivos acima do limite;
- definir prazo em `WHATSAPP_MEDIA_RETENTION_DAYS`;
- não remover mensagens ao remover o arquivo;
- marcar a mídia como `removed` e preservar somente metadados operacionais mínimos;
- não salvar arquivo, URL temporária, legenda completa, telefone ou payload em logs/analytics;
- executar limpeza em lotes limitados pela rota interna autenticada.

## Prazo sugerido

O fallback técnico é 30 dias e o valor configurável deve refletir necessidade real, base legal e política de privacidade. O limite aceito pela aplicação é de 1 a 365 dias.

## Limpeza

`POST /api/internal/whatsapp/cleanup-media` exige `INTERNAL_JOB_SECRET`, processa no máximo 50 objetos por execução, remove apenas o objeto do Storage e marca o registro como removido. A automação de agenda deve ser configurada externamente e monitorada; a rota não cria cron por conta própria.

## Pausar download se

- houver aumento anormal de mídia;
- ocorrerem falhas recorrentes;
- um arquivo for suspeito;
- o custo de storage crescer de forma anormal;
- houver risco de segurança.

Para pausar, defina `WHATSAPP_MEDIA_DOWNLOAD_ENABLED=false` sem remover mensagens ou metadados existentes.
