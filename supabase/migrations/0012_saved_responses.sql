create table if not exists public.saved_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  response_id uuid references public.generated_responses(id) on delete set null,
  title text,
  content text not null,
  category text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint saved_responses_category_check check (
    category is null or category in (
      'Preco',
      'Agendamento',
      'Entrega',
      'Pagamento',
      'Horario',
      'Informacoes gerais',
      'Pos-venda',
      'Outro'
    )
  )
);

create index if not exists saved_responses_user_id_idx on public.saved_responses(user_id);
create index if not exists saved_responses_created_at_idx on public.saved_responses(created_at desc);
create index if not exists saved_responses_category_idx on public.saved_responses(category) where category is not null;
create unique index if not exists saved_responses_user_response_unique_idx
  on public.saved_responses(user_id, response_id)
  where response_id is not null;

drop trigger if exists set_saved_responses_updated_at on public.saved_responses;
create trigger set_saved_responses_updated_at
  before update on public.saved_responses
  for each row execute function public.set_updated_at();

alter table public.saved_responses enable row level security;

drop policy if exists "saved_responses_select_own" on public.saved_responses;
drop policy if exists "saved_responses_insert_own" on public.saved_responses;
drop policy if exists "saved_responses_update_own" on public.saved_responses;
drop policy if exists "saved_responses_delete_own" on public.saved_responses;

create policy "saved_responses_select_own" on public.saved_responses
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "saved_responses_insert_own" on public.saved_responses
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and (
      response_id is null
      or exists (
        select 1
        from public.generated_responses gr
        where gr.id = response_id
          and gr.user_id = (select auth.uid())
      )
    )
  );

create policy "saved_responses_update_own" on public.saved_responses
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (
      response_id is null
      or exists (
        select 1
        from public.generated_responses gr
        where gr.id = response_id
          and gr.user_id = (select auth.uid())
      )
    )
  );

create policy "saved_responses_delete_own" on public.saved_responses
  for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.saved_responses from anon, authenticated;
grant select, insert, update, delete on public.saved_responses to authenticated;
