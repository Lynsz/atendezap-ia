# Templates Prontos para WhatsApp

## Objetivo

Dar mensagens prontas para o usuario comecar mais rapido, mesmo antes de gerar muitas respostas com IA.

## Nichos cobertos

- Delivery
- Estetica
- Assistencia tecnica
- Loja
- Restaurante
- Prestador de servico
- Autonomo
- Outro

## O que o usuario pode fazer

- Copiar template.
- Salvar template na propria biblioteca.
- Adaptar manualmente antes de enviar.
- Editar, renomear, duplicar e categorizar depois de salvar na biblioteca.
- Usar como base para atendimento no WhatsApp.
- Filtrar por nicho, categoria e busca simples.

## O que nao faz

- Nao envia mensagem sozinho.
- Nao conecta WhatsApp.
- Nao cria CRM.
- Nao substitui revisao humana.
- Nao confirma preco, prazo ou agenda automaticamente.

## Seguranca

- Templates sao genericos e ficam versionados no codigo em `src/lib/templates/whatsapp-templates.ts`.
- Quando o usuario salva um template, o item fica em `saved_responses` vinculado ao `user_id` autenticado.
- O client nao envia `user_id`.
- `source_template_id` evita salvar o mesmo template duas vezes na biblioteca do mesmo usuario.
- Depois de salvo, a personalizacao acontece apenas no item da biblioteca do usuario.
- Conteudo completo do template nao vai para analytics.

## Personalizacao

- Template salvo pode ser editado pelo usuario na biblioteca.
- Template salvo pode ser duplicado para criar variações sem alterar o item original.
- A copia permanece privada e vinculada ao proprio usuario.
- Excluir um template salvo remove apenas o item da biblioteca, nao o catalogo estatico.

## Tracking

Eventos client-safe:

- `templates_view`
- `template_copy`
- `template_save`
- `template_filter_change`
- `template_search`

Os eventos enviam apenas `templateId`, `businessType`, `category` ou estado do filtro/busca. Nao enviam o conteudo completo da mensagem.

## Pendencias futuras

- Templates favoritos.
- Templates por campanha.
- Templates por objecao.
- Templates com variaveis automaticas.
- Metricas internas persistidas de copia de template, se a tabela `events` passar a registrar esses eventos do dashboard.
