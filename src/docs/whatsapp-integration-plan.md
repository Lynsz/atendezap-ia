# Plano de Integracao WhatsApp

Este documento descreve a preparacao tecnica para uma integracao futura do AtendeZap IA com WhatsApp. A implementacao atual e apenas demo/local: os dados ficam no localStorage e nenhuma mensagem real e enviada ou recebida.

## Estado atual

- Conexao visual em modo demo.
- Templates de mensagem salvos localmente.
- Historico de sincronizacao simulado.
- Importacao simulada de mensagens para alimentar o modulo de atendimento.
- Sem chamadas para WhatsApp, Meta, Z-API, Evolution API ou qualquer provedor externo.

## Opcoes futuras de provedor

- WhatsApp Cloud API: integracao oficial da Meta, exige configuracao de app, numero, token e webhooks.
- Z-API: provedor terceirizado para envio e recebimento de mensagens via API.
- Evolution API: alternativa self-hosted/terceirizada para conexao com WhatsApp.
- Outro provedor: pode ser conectado pela mesma camada de servico, desde que exponha webhooks e envio de mensagens.

## Fluxo futuro

1. Cliente envia mensagem para o numero do negocio.
2. Provedor dispara webhook para o backend.
3. Backend valida assinatura/token do provedor.
4. Backend cria ou atualiza conversa e lead no banco.
5. AtendeZap IA gera resumo e sugestao de resposta.
6. Atendente revisa e aprova a resposta.
7. Backend envia a mensagem pelo provedor configurado.
8. Status de entrega e leitura volta por webhook e atualiza a conversa.

## Requisitos tecnicos

- Backend para receber webhooks e enviar mensagens.
- Banco de dados para tenants, leads, conversas, mensagens e logs.
- Autenticacao para separar empresas e usuarios.
- Tokens e segredos guardados apenas no servidor.
- Webhook seguro com validacao de origem.
- Fila ou rotina assíncrona para processamento de mensagens, se o volume crescer.
- Politicas de privacidade e consentimento adequadas ao uso do WhatsApp.

## Checklist para implementacao real

- Escolher provedor inicial.
- Criar tabela de conexoes WhatsApp por tenant.
- Criar tabela de mensagens com direcao, status e payload bruto minimo.
- Implementar endpoint `POST /api/webhooks/whatsapp`.
- Implementar servico de envio de mensagens no backend.
- Conectar status de mensagem recebida ao modulo de atendimento.
- Conectar templates aprovados ao fluxo de resposta.
- Proteger tokens do provedor com variaveis de ambiente.
- Registrar logs tecnicos sem expor dados sensiveis completos.
- Testar envio, recebimento, erro, reconexao e pausa do canal.
