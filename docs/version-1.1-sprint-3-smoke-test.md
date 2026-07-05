# Smoke Test - Sprint 3 Versao 1.1

## Status

* aprovado com observacoes

## IA

* [x] resposta usa contexto do negocio em prompt server-side
* [x] tom e respeitado pelo prompt
* [x] resposta e orientada a ser curta
* [x] nao inventa preco
* [x] nao inventa estoque
* [x] nao inventa prazo
* [x] nao inventa agenda
* [x] limite mensal permanece antes da chamada OpenAI
* [x] feedback funciona com usuario autenticado

## Templates

* [x] nichos carregam
* [x] filtros funcionam por nicho, categoria e busca
* [x] copiar funciona no fluxo existente
* [x] usar como base preenche area editavel e nao envia automaticamente
* [x] salvar funciona usando origem `template`

## Biblioteca

* [x] listar
* [x] buscar
* [x] filtrar
* [x] criar manual
* [x] editar
* [x] copiar
* [x] favoritar
* [x] excluir
* [x] RLS preservado nos testes e migrations existentes

## Bugs encontrados

* Alias legado `ai_feedback_submitted` ainda era aceito como evento final seguro em vez de normalizar para `ai_response_feedback_submitted`.
* Tracking client-side ainda permitia propriedade `comment`.
* Um template de estetica soava como confirmacao de horario antes de validar agenda.
* Um template de assistencia tecnica soava como promessa direta de garantia.

## Correcoes aplicadas

* Alias antigo de feedback passou a ser normalizado para o evento novo.
* `comment` e `comentario` foram bloqueados no tracking client-side.
* Template de confirmacao de horario virou verificacao de agenda.
* Template de garantia virou orientacao condicional, sem promessa automatica.
* Admin de qualidade da IA passou a priorizar motivos negativos agregados.

## Pendencias

* Executar smoke autenticado real em Preview/Producao.
* Validar RLS no Supabase real com dois usuarios.
* Aplicar migration `0029_sprint3_quality_events_and_feedback_reason.sql` no ambiente real.
* Coletar volume real de feedback antes de decidir novos ajustes de IA.

## Decisao

* Sprint 3 aprovada localmente com observacoes.
* Nao liberar campanha maior antes das pendencias de ambiente real.
