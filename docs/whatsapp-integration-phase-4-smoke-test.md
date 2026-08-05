# Smoke Test — Integração WhatsApp Fase 4

## Status

Aprovado com observações locais. O smoke real permanece pendente até a migration ser aplicada em ambiente controlado e as flags serem habilitadas com credenciais de teste.

## Inbound

- [x] imagem inbound é reconhecida em teste automatizado;
- [x] documento inbound é reconhecido em teste automatizado;
- [x] áudio/vídeo/sticker são tratados como metadados;
- [x] tipo desconhecido vira `unsupported` sem conteúdo bruto;
- [x] payload bruto não é persistido pelo parser/processador.

## Download

- [x] mídia permitida baixa server-side em teste com mock;
- [x] tipo perigoso é bloqueado antes do binário;
- [x] arquivo grande é bloqueado antes do binário;
- [x] erro da Meta é normalizado sem token/URL;
- [ ] validar download com mídia de conta Meta de teste após deploy.

## Dashboard

- [x] card de mídia e estados foram implementados;
- [x] preview/download passa por rota autenticada;
- [x] mídia bloqueada não abre em teste automatizado;
- [x] falha de mídia não impede renderização das mensagens;
- [ ] validar visualmente em desktop/mobile no Preview.

## Envio

- [x] upload seguro prepara, mas não envia;
- [x] envio exige confirmação;
- [x] envio respeita janela de 24 horas;
- [x] envio bloqueia opt-out;
- [x] duplo clique não duplica envio;
- [x] URL externa arbitrária é rejeitada;
- [ ] validar envio de imagem/PDF com contato autorizado de teste.

## Segurança

- [x] token não aparece no client;
- [x] bucket é privado na migration;
- [x] usuário não acessa mídia de outro usuário em teste;
- [x] eventos removem arquivo, URL, legenda e telefone;
- [x] logs usam apenas categoria segura;
- [ ] confirmar RLS e bucket privado no projeto Supabase real com dois usuários.

## Bugs encontrados

- Os documentos da Fase 2 e o runbook de operações da Fase 3 citados no pedido não existem no repositório.

## Correções aplicadas

- A Fase 2 foi reconstruída a partir de rotas/testes existentes sem inventar documentação histórica.
- O scanner de secrets foi ampliado para HAR, bearer literal, tokens Supabase, URLs temporárias e dumps nomeados.

## Decisão

Código apto para validação controlada após migration e configuração de ambiente. Não habilitar as flags em produção antes do smoke real.
