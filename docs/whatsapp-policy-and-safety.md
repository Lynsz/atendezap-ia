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

## Dados

- não salvar payload bruto;
- mídia não é baixada; registra-se somente o tipo como não suportado;
- telefone completo não aparece no admin;
- tokens, assinatura completa e conteúdo não entram em logs;
- mensagem/resposta não entram em analytics;
- conteúdo necessário ao atendimento fica nas tabelas privadas com RLS.
- erros brutos da Meta não entram em banco, logs, analytics ou interface;
- auditoria contém somente ação, estado, categoria segura e referências internas.

## Pausar a integração se

- houver erro recorrente de envio ou rejeição por política;
- o volume crescer de modo anormal;
- houver opt-out recorrente;
- qualquer token for exposto;
- o webhook receber payload inválido em massa;
- a assinatura HMAC falhar repetidamente;
- a migration/RLS não estiver confirmada no ambiente.

Ao pausar, defina `WHATSAPP_ENABLED=false`, revogue/rotacione credenciais quando necessário e investigue sem registrar dados pessoais completos.
