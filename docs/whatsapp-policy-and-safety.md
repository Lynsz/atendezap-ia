# Políticas e Segurança WhatsApp — AtendeZap IA

## Regras do produto

- envio somente após confirmação explícita do usuário;
- nenhuma resposta automática em qualquer fase implementada;
- sem spam, envio em massa, scraping ou WhatsApp Web não oficial;
- sem promessa de entrega garantida ou automação ilimitada;
- opt-in obrigatório para iniciar conversas;
- opt-out bloqueia envios;
- janela de atendimento de 24 horas respeitada;
- fora da janela, somente template aprovado, opt-in confirmado e ação manual.
- sincronização não envia mensagens e não transforma templates em campanha ou lista de disparo;
- aprovação remota vem da Meta e nunca de um status arbitrário enviado pelo client;
- templates pendentes, rejeitados, pausados, desativados, desconhecidos ou localmente bloqueados não podem ser enviados;
- submissão via API permanece desativada até existir governança operacional validada.

## Controles técnicos

- `confirmSend: true` é validado na rota de envio;
- proprietário é derivado da sessão, nunca de `user_id` do client;
- conexão, contato, conversa e janela são revalidados no backend;
- request ID e tentativa persistida são adquiridos antes da chamada ao provedor;
- fingerprints SHA-256 bloqueiam conteúdo idêntico enviado recentemente sem armazenar o texto;
- rate limits por usuário, conversa e template reduzem abuso;
- retries são limitados a uma repetição e somente para falhas transitórias;
- eventos de webhook são adquiridos antes de alterar contato, conversa ou mensagem;
- RLS permite ao client somente leitura dos próprios dados;
- access token, App Secret, verify token, OpenAI key e service role são server-only;
- `WHATSAPP_ENABLED=false` desativa a integração.

## Conexão multiempresa

- cada conexão pertence ao usuário autenticado e é resolvida por `connection_id`;
- WABA e Phone Number ID recebidos do client nunca são autoridade e são validados server-side com a Meta;
- tokens de Embedded Signup ficam criptografados e sem grant para o navegador;
- desconexão invalida a credencial local, preserva histórico e bloqueia novos envios;
- reautorização mantém o estado `needs_reauth` até o novo token ser validado;
- healthcheck interno é limitado, autenticado e não registra resposta bruta;
- fallback por env é legado e só pode ser usado por conexão `env_global`;
- webhook roteia por Phone Number ID e não cria dados sem tenant conhecido;
- isolamento continua baseado em `user_id`, `connection_id`, RLS e validação server-side.

## Dados

- não salvar payload bruto;
- mídia inbound é registrada por metadados e só pode ser baixada server-side por job autenticado quando a flag estiver ativa;
- URLs temporárias da Meta nunca são persistidas, logadas ou enviadas a analytics;
- arquivos permitidos ficam em bucket privado e preview/download revalida sessão e propriedade;
- upload outbound não envia automaticamente; um segundo pedido confirmado revalida opt-out, janela, limite, idempotência, tipo e tamanho;
- áudio, vídeo e sticker permanecem somente como metadados nesta fase;
- telefone completo não aparece no admin;
- tokens, assinatura completa e conteúdo não entram em logs;
- mensagem/resposta não entram em analytics;
- conteúdo necessário ao atendimento fica nas tabelas privadas com RLS.
- erros brutos da Meta não entram em banco, logs, analytics ou interface;
- auditoria contém somente ação, estado, categoria segura e referências internas.
- componentes sincronizados guardam somente a estrutura necessária; exemplos da Meta e valores reais de clientes são descartados;
- histórico de template guarda apenas transição, fonte e motivo resumido, com RLS por proprietário;
- analytics de templates aceita somente status, categoria, idioma, contagem/faixa, origem e tipo de erro;
- texto completo do template, valores de variáveis, payload remoto e motivo bruto não entram em analytics ou logs.

## Pausar a integração se

- houver erro recorrente de envio ou rejeição por política;
- o volume crescer de modo anormal;
- houver opt-out recorrente;
- qualquer token for exposto;
- o webhook receber payload inválido em massa;
- a assinatura HMAC falhar repetidamente;
- a migration/RLS não estiver confirmada no ambiente.

Ao pausar, defina `WHATSAPP_ENABLED=false`, revogue/rotacione credenciais quando necessário e investigue sem registrar dados pessoais completos.
