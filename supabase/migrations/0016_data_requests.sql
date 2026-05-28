create table if not exists public.data_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  status text not null default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint data_requests_type_check check (type in ('export', 'deletion')),
  constraint data_requests_status_check check (status in ('pending', 'processing', 'completed', 'rejected'))
);

create index if not exists data_requests_user_id_idx on public.data_requests(user_id);
create index if not exists data_requests_status_idx on public.data_requests(status);
create index if not exists data_requests_created_at_idx on public.data_requests(created_at desc);

drop trigger if exists set_data_requests_updated_at on public.data_requests;
create trigger set_data_requests_updated_at
  before update on public.data_requests
  for each row execute function public.set_updated_at();

alter table public.data_requests enable row level security;

drop policy if exists "data_requests_select_own" on public.data_requests;
drop policy if exists "data_requests_insert_own" on public.data_requests;

create policy "data_requests_select_own" on public.data_requests
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "data_requests_insert_own" on public.data_requests
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on public.data_requests from anon, authenticated;
grant select, insert on public.data_requests to authenticated;

comment on table public.data_requests is 'Solicitacoes de exportacao ou exclusao de dados feitas por usuarios autenticados.';
comment on column public.data_requests.notes is 'Nota operacional interna para acompanhamento manual; nao armazenar dados sensiveis.';
