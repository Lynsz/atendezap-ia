# Biblioteca de Respostas Salvas

## Objetivo

Permitir que o usuario reutilize respostas boas geradas pela IA sem depender de CRM.

## O que faz

- Salvar uma resposta gerada pela IA na biblioteca.
- Listar respostas salvas do proprio usuario.
- Copiar respostas salvas rapidamente.
- Organizar respostas por categoria simples.
- Editar titulo, categoria e conteudo de uma resposta salva.
- Remover uma resposta da biblioteca.

## Categorias

- Preco
- Agendamento
- Entrega
- Pagamento
- Horario
- Informacoes gerais
- Pos-venda
- Outro

## O que nao faz

- Nao envia WhatsApp automaticamente.
- Nao cria CRM.
- Nao faz automacao.
- Nao compartilha respostas entre usuarios.
- Nao cria tags avancadas, pastas ou biblioteca por equipe.

## Seguranca

- A tabela `saved_responses` usa `user_id` e RLS por `auth.uid()`.
- As APIs exigem autenticacao e sempre usam o usuario da sessao.
- O client nao envia nem controla `user_id`.
- Usuario so lista, cria, edita e remove as proprias respostas salvas.
- Ao salvar a partir do historico, a API valida que `response_id` pertence ao usuario autenticado.
- Conteudo completo da resposta nao e enviado para analytics.
- O admin usa apenas agregados: total de respostas salvas e usuarios com pelo menos uma resposta salva.

## Banco e API

- Migration: `supabase/migrations/0012_saved_responses.sql`.
- Tabela: `saved_responses`.
- Rotas:
  - `GET /api/saved-responses`
  - `POST /api/saved-responses`
  - `PATCH /api/saved-responses/[id]`
  - `DELETE /api/saved-responses/[id]`

## Validacao

Antes de liberar em ambiente real, aplicar a migration `0012_saved_responses.sql` no Supabase de staging/producao e validar com dois usuarios que um nao acessa a biblioteca do outro.
