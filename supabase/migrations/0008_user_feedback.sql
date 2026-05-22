create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text,
  email text,
  type text not null,
  message text not null,
  page text,
  status text not null default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_feedback add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.user_feedback add column if not exists name text;
alter table public.user_feedback add column if not exists email text;
alter table public.user_feedback add column if not exists type text not null default 'bug';
alter table public.user_feedback add column if not exists message text not null default '';
alter table public.user_feedback add column if not exists page text;
alter table public.user_feedback add column if not exists status text not null default 'new';
alter table public.user_feedback add column if not exists created_at timestamptz default now();
alter table public.user_feedback add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'user_feedback_type_check'
  ) then
    alter table public.user_feedback
      add constraint user_feedback_type_check
      check (type in ('bug', 'duvida', 'sugestao', 'elogio', 'dificuldade_uso'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'user_feedback_status_check'
  ) then
    alter table public.user_feedback
      add constraint user_feedback_status_check
      check (status in ('new', 'reviewing', 'resolved', 'ignored'));
  end if;
end $$;

create index if not exists user_feedback_user_id_idx on public.user_feedback(user_id);
create index if not exists user_feedback_status_idx on public.user_feedback(status);
create index if not exists user_feedback_type_idx on public.user_feedback(type);
create index if not exists user_feedback_created_at_idx on public.user_feedback(created_at desc);

drop trigger if exists set_user_feedback_updated_at on public.user_feedback;
create trigger set_user_feedback_updated_at
  before update on public.user_feedback
  for each row execute function public.set_updated_at();

alter table public.user_feedback enable row level security;

drop policy if exists "user_feedback_insert_public" on public.user_feedback;
drop policy if exists "user_feedback_select_own" on public.user_feedback;
drop policy if exists "user_feedback_update_own_status_forbidden" on public.user_feedback;

create policy "user_feedback_insert_public" on public.user_feedback
  for insert to anon, authenticated
  with check (user_id is null or (select auth.uid()) = user_id);

create policy "user_feedback_select_own" on public.user_feedback
  for select to authenticated
  using ((select auth.uid()) = user_id);

grant insert on public.user_feedback to anon, authenticated;
grant select on public.user_feedback to authenticated;
