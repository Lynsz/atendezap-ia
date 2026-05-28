alter table public.support_requests
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.support_requests
  add column if not exists category text;

alter table public.support_requests
  add column if not exists subject text;

alter table public.support_requests
  add column if not exists status text not null default 'pending';

alter table public.support_requests
  add column if not exists priority text not null default 'medium';

alter table public.support_requests
  add column if not exists admin_notes text;

alter table public.support_requests
  add column if not exists updated_at timestamptz default now();

update public.support_requests
set
  category = coalesce(category, 'Outro'),
  subject = coalesce(subject, 'Solicitacao de suporte'),
  message = coalesce(message, 'Solicitacao sem mensagem registrada no legado.'),
  status = coalesce(status, 'pending'),
  priority = coalesce(priority, 'medium'),
  updated_at = coalesce(updated_at, created_at, now())
where category is null
  or subject is null
  or message is null
  or status is null
  or priority is null
  or updated_at is null;

alter table public.support_requests
  alter column category set not null;

alter table public.support_requests
  alter column subject set not null;

alter table public.support_requests
  alter column message set not null;

alter table public.support_requests
  drop constraint if exists support_requests_category_check;

alter table public.support_requests
  add constraint support_requests_category_check
  check (category in ('Duvida', 'Bug', 'Assinatura', 'Cobranca', 'Geracao de resposta', 'Conta/Login', 'Sugestao', 'Outro'));

alter table public.support_requests
  drop constraint if exists support_requests_status_check;

alter table public.support_requests
  add constraint support_requests_status_check
  check (status in ('pending', 'in_progress', 'resolved', 'rejected'));

alter table public.support_requests
  drop constraint if exists support_requests_priority_check;

alter table public.support_requests
  add constraint support_requests_priority_check
  check (priority in ('low', 'medium', 'high'));

create index if not exists support_requests_user_id_idx on public.support_requests(user_id);
create index if not exists support_requests_status_idx on public.support_requests(status);
create index if not exists support_requests_priority_idx on public.support_requests(priority);
create index if not exists support_requests_created_at_idx on public.support_requests(created_at desc);

drop trigger if exists set_support_requests_updated_at on public.support_requests;
create trigger set_support_requests_updated_at
  before update on public.support_requests
  for each row execute function public.set_updated_at();

drop policy if exists "support_requests_no_client_access" on public.support_requests;
drop policy if exists "support_requests_select_own" on public.support_requests;
drop policy if exists "support_requests_insert_own" on public.support_requests;

create policy "support_requests_select_own" on public.support_requests
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "support_requests_insert_own" on public.support_requests
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on public.support_requests from anon, authenticated;
grant select, insert on public.support_requests to authenticated;

comment on table public.support_requests is 'Solicitacoes simples de suporte, sem conversa em tempo real e sem dados sensiveis desnecessarios.';
comment on column public.support_requests.admin_notes is 'Nota interna de suporte. Nao registrar secrets, dados de cartao ou conteudo sensivel desnecessario.';
