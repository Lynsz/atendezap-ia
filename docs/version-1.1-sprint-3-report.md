# Relatorio da Sprint 3 - Versao 1.1 AtendeZap IA

## Status

* concluida com observacoes

## Melhorias da IA

* Prompt de resposta para WhatsApp centralizado em `src/lib/ai/build-whatsapp-response-prompt.ts`.
* Resposta orientada a ser curta, natural, em portugues do Brasil e sem markdown pesado.
* Prompt inclui contexto do negocio, tipo, tom, dados comerciais disponiveis e tipo de resposta.
* System prompt reforcado para usar apenas negocio, template e orientacao do nicho.

## Regras contra informacoes inventadas

* Prompt bloqueia preco, desconto, estoque, prazo, entrega, endereco, horario, agenda, disponibilidade, link, garantia, servico e forma de pagamento inventados.
* Prompt bloqueia confirmacao de pedido, pagamento, agendamento, reserva, entrega ou atendimento sem dados suficientes.
* Quando faltar informacao comercial, a IA deve pedir o detalhe necessario ou dizer que sera verificado.

## Orientacoes por nicho

* Criado `src/lib/ai/business-niche-guidance.ts`.
* Nichos cobertos: delivery, restaurante, estetica, loja, assistencia tecnica, prestador de servico, autonomo e geral.
* Orientacoes sao curtas, tipadas e usadas no prompt, sem criar prompts enormes por nicho.

## Templates

* Catalogo mantem pelo menos 5 templates por tipo de negocio.
* Templates de estetica e assistencia tecnica foram ajustados para nao confirmar agenda ou prometer garantia sem validacao.
* Testes cobrem nichos minimos, campos obrigatorios, IDs unicos, filtros e promessas proibidas obvias.
* Dashboard permite copiar, salvar e usar template como base editavel.

## Biblioteca

* Biblioteca existente preserva listagem, busca, filtros, criacao manual, edicao, copia, favorito e exclusao.
* Resposta gerada agora fica editavel antes de copiar ou salvar.
* Acoes continuam usando usuario autenticado e rotas backend.

## Feedback

* Feedback da IA aceita motivo negativo categorizado: muito longa, muito generica, tom inadequado, inventou informacao, nao respondeu ao cliente e outro.
* Comentario livre continua opcional e limitado, mas nao vai para analytics.
* Admin usa motivos agregados para qualidade da IA.

## Tracking

* Eventos seguros adicionados ou normalizados: `ai_response_generated`, `ai_response_feedback_submitted`, `template_viewed`, `template_copied`, `template_saved`, `saved_response_created`, `saved_response_copied`, `saved_response_edited`, `saved_response_favorited` e `saved_response_deleted`.
* Metadata permitida permanece categorica: `business_type`, `plan`, `niche`, `category`, `source`, `feedback_rating`, `feedback_reason` e `response_length_range`.
* Pergunta completa, resposta completa, comentario livre, titulo, conteudo, contato, tokens, secrets e dados de pagamento continuam bloqueados.

## Seguranca e RLS

* OpenAI permanece no backend.
* `user_id` continua vindo da sessao nas rotas de feedback e biblioteca.
* RLS nao foi desativado.
* Migration nova apenas adiciona motivo de feedback e eventos permitidos.
* Validacao RLS real com dois usuarios ainda depende de ambiente Supabase real.

## Testes

* Testes adicionados para construtor de prompt e orientacao por nicho.
* Testes atualizados para feedback negativo com motivo, analytics seguro, tracking client-side, templates e metricas admin.
* A validacao completa deve ser a evidencia final corrente da sprint.

## Bugs corrigidos

* Alias legado de feedback normalizado para o evento novo.
* Tracking client-side passou a bloquear `comment` e `comentario`.
* Templates que soavam como confirmacao/promessa foram ajustados.
* Admin deixou de priorizar comentarios recentes na leitura de qualidade da IA.

## Pendencias

* Smoke autenticado em Preview/Producao.
* RLS real com dois usuarios.
* Aplicar migration da Sprint 3 no Supabase real.
* Consolidar metricas reais de uso, feedback por nicho e templates mais copiados/salvos.

## Proximo passo recomendado

* Executar smoke real controlado do fluxo cadastro -> onboarding -> dashboard -> primeira resposta -> editar -> copiar -> salvar -> feedback com dois usuarios e registrar apenas resultados agregados.
