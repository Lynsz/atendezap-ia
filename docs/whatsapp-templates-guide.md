# Guia de Templates Oficiais do WhatsApp

## Escopo

Templates são mensagens previamente aprovadas pela Meta. O AtendeZap IA apenas permite selecionar e enviar manualmente um template já cadastrado para a mesma conexão. Não cria campanhas nem sincroniza ou envia templates automaticamente.

## Estados

- `pending`: aguardando aprovação; envio bloqueado.
- `approved`: disponível para envio manual.
- `rejected`: rejeitado; envio bloqueado.
- `paused` ou `disabled`: indisponível; envio bloqueado.

## Regras de envio

1. Usuário autenticado escolhe uma conversa própria.
2. Backend resolve contato e telefone a partir da conversa.
3. Conexão deve estar ativa e coincidir com a do template.
4. Contato deve estar `opted_in`.
5. Template deve estar `approved`.
6. Quantidade de variáveis deve ser exata.
7. Usuário confirma explicitamente o envio.
8. Request ID, limite e duplicidade recente são verificados antes da Meta.

Variáveis podem ter no máximo 200 caracteres e não são persistidas em analytics, auditoria ou tentativas. O corpo enviado aparece apenas na requisição server-to-server necessária à Meta.

## Cadastro inicial

Enquanto não existe sincronização oficial da Meta, insira os metadados aprovados por procedimento administrativo controlado em `whatsapp_templates`: `user_id`, `connection_id`, `provider_template_id`, `name`, `language`, `category`, `status` e `variables_count`. Nunca inclua credenciais ou dados de contatos.
