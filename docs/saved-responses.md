# Biblioteca de Respostas Salvas

## Objetivo

Permitir que o usuario reutilize respostas boas geradas pela IA sem depender de CRM.

## O que faz

- Salvar uma resposta gerada pela IA na biblioteca.
- Listar respostas salvas do proprio usuario.
- Copiar respostas salvas rapidamente.
- Organizar respostas por categoria simples.
- Editar titulo, categoria e conteudo de uma resposta salva.
- Duplicar uma resposta/template salvo para adaptar sem perder o original.
- Criar uma resposta manual com mensagens que o usuario ja usa no WhatsApp.
- Excluir uma resposta da biblioteca com confirmacao simples.
- Filtrar por categoria, origem e busca simples.

## Personalizacao

- Criar resposta manual pela biblioteca com titulo, conteudo e categoria.
- Editar resposta salva para ajustar titulo, conteudo e categoria.
- Duplicar resposta salva ou template salvo; a copia fica vinculada ao mesmo usuario.
- Excluir apenas o item salvo da biblioteca, sem apagar o historico original da IA.
- Categorizar respostas usando a lista simples do produto.

## Origem dos itens

Cada item pode usar `source`:

- `ai_generated`: resposta salva a partir da IA.
- `template`: template pronto salvo na biblioteca.
- `manual`: resposta criada manualmente pelo usuario.

Registros antigos sem `source` podem ser inferidos por `source_template_id` ou `response_id`.

## Categorias

- Preco
- Agendamento
- Entrega
- Pagamento
- Horario
- Informacoes gerais
- Pos-venda
- Orcamento
- Confirmacao
- Cancelamento
- Outro

## O que nao faz

- Nao envia WhatsApp automaticamente.
- Nao cria CRM.
- Nao faz automacao.
- Nao compartilha respostas entre usuarios.
- Nao cria tags avancadas, pastas ou biblioteca por equipe.
- Nao permite multiplos atendentes.

## Seguranca

- A tabela `saved_responses` usa `user_id` e RLS por `auth.uid()`.
- As APIs exigem autenticacao e sempre usam o usuario da sessao.
- O client nao envia nem controla `user_id`.
- Usuario so lista, cria, edita e remove as proprias respostas salvas.
- Usuario so duplica as proprias respostas salvas.
- Ao salvar a partir do historico, a API valida que `response_id` pertence ao usuario autenticado.
- Ao salvar a partir dos templates prontos, a API registra `source_template_id` para evitar duplicar o mesmo template na biblioteca do usuario.
- Conteudo completo da resposta nao e enviado para analytics.
- O admin usa apenas agregados: total de respostas salvas e usuarios com pelo menos uma resposta salva.

## Banco e API

- Migration: `supabase/migrations/0012_saved_responses.sql`.
- Migration incremental de origem: `supabase/migrations/0014_saved_responses_source.sql`.
- Tabela: `saved_responses`.
- Rotas:
  - `GET /api/saved-responses`
  - `POST /api/saved-responses`
  - `PATCH /api/saved-responses/[id]`
  - `DELETE /api/saved-responses/[id]`
  - `POST /api/saved-responses/[id]/duplicate`

## Validacao

Antes de liberar em ambiente real, aplicar as migrations `0012_saved_responses.sql`, `0013_saved_response_templates.sql` e `0014_saved_responses_source.sql` no Supabase de staging/producao e validar com dois usuarios que um nao acessa, edita, duplica nem exclui a biblioteca do outro.
