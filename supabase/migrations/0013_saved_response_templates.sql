alter table public.saved_responses add column if not exists source_template_id text;

alter table public.saved_responses drop constraint if exists saved_responses_category_check;
alter table public.saved_responses add constraint saved_responses_category_check check (
  category is null or category in (
    'Preco',
    'Agendamento',
    'Entrega',
    'Pagamento',
    'Horario',
    'Informacoes gerais',
    'Pos-venda',
    'Orcamento',
    'Confirmacao',
    'Cancelamento',
    'Outro'
  )
);

create index if not exists saved_responses_source_template_id_idx
  on public.saved_responses(source_template_id)
  where source_template_id is not null;

create unique index if not exists saved_responses_user_template_unique_idx
  on public.saved_responses(user_id, source_template_id)
  where source_template_id is not null;
