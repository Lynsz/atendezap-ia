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
- Marcar e remover respostas favoritas.
- Filtrar somente favoritas.
- Ordenar por mais recentes, mais antigos, atualizadas recentemente, favoritos primeiro ou categoria.
- Acessar ate 3 favoritas no dashboard principal.
- Registrar contador simples de copias para organizacao futura.

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

## Favoritos

- O usuario pode marcar uma resposta salva como favorita pela biblioteca.
- O usuario pode remover uma resposta dos favoritos pelo mesmo botao.
- A biblioteca tem filtro rapido `Todos` e `Favoritos`.
- O topo da biblioteca mostra ate 5 respostas favoritas mais recentes para copia rapida.
- O dashboard principal mostra ate 3 respostas favoritas do usuario com botao copiar.
- Se ainda nao houver favoritas, o dashboard mostra o CTA: "Salve respostas como favoritas para acessar mais rapido aqui."

## Organizacao

- Categorias continuam simples e controladas pela lista do produto.
- Origem continua sendo `ai_generated`, `template` ou `manual`.
- A busca client-side procura em titulo, conteudo e categoria.
- Os filtros podem ser combinados por categoria, origem, favoritos e texto de busca.
- A ordenacao simples permite: mais recentes, mais antigos, atualizadas recentemente, favoritos primeiro e categoria.
- A experiencia mobile usa cards, botoes com area de toque maior e texto longo truncado para evitar estouro de layout.

## Copias

- Ao copiar uma resposta salva, a API registra `copy_count` e `last_copied_at`.
- O contador e usado apenas para organizacao futura.
- O contador nao interfere em cobranca, limite mensal ou plano.

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
- Usuario so favorita, desfavorita e registra copia das proprias respostas salvas.
- Ao salvar a partir do historico, a API valida que `response_id` pertence ao usuario autenticado.
- Ao salvar a partir dos templates prontos, a API registra `source_template_id` para evitar duplicar o mesmo template na biblioteca do usuario.
- Conteudo completo da resposta nao e enviado para analytics.
- Eventos de analytics enviam apenas metadados como categoria, origem, favorito e acao.
- O admin usa apenas agregados: total de respostas salvas e usuarios com pelo menos uma resposta salva.

## Banco e API

- Migration: `supabase/migrations/0012_saved_responses.sql`.
- Migration incremental de origem: `supabase/migrations/0014_saved_responses_source.sql`.
- Migration incremental de favoritos e copias: `supabase/migrations/0015_saved_response_favorites_and_copy_count.sql`.
- Tabela: `saved_responses`.
- Rotas:
  - `GET /api/saved-responses`
  - `POST /api/saved-responses`
  - `PATCH /api/saved-responses/[id]`
  - `DELETE /api/saved-responses/[id]`
  - `POST /api/saved-responses/[id]/duplicate`

## Validacao

Antes de liberar em ambiente real, aplicar as migrations `0012_saved_responses.sql`, `0013_saved_response_templates.sql`, `0014_saved_responses_source.sql` e `0015_saved_response_favorites_and_copy_count.sql` no Supabase de staging/producao e validar com dois usuarios que um nao acessa, edita, duplica, favorita, copia nem exclui a biblioteca do outro.
