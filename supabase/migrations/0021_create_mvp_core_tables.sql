create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text,
  business_type text,
  tone text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month text not null,
  count integer not null default 0,
  "limit" integer not null default 20,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint ai_usage_month_format_check check (month ~ '^[0-9]{4}-[0-9]{2}$'),
  constraint ai_usage_count_non_negative check (count >= 0),
  constraint ai_usage_limit_non_negative check ("limit" >= 0)
);

update public.saved_responses
set title = 'Resposta salva'
where title is null
  or btrim(title) = '';

alter table public.saved_responses
  alter column title set not null,
  alter column source set default 'manual';

alter table public.subscriptions
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists plan text default 'free',
  alter column status set default 'free';

update public.subscriptions
set
  plan = coalesce(nullif(plan, ''), nullif(plan_name, ''), 'free'),
  status = coalesce(nullif(status, ''), 'free'),
  stripe_customer_id = coalesce(stripe_customer_id, provider_customer_id),
  stripe_subscription_id = coalesce(stripe_subscription_id, provider_subscription_id)
where
  plan is null
  or plan = ''
  or status is null
  or status = ''
  or stripe_customer_id is null
  or stripe_subscription_id is null;

insert into public.user_profiles (user_id, business_name, business_type, tone, description, created_at, updated_at)
select distinct on (b.user_id)
  b.user_id,
  b.business_name,
  coalesce(nullif(b.business_type, ''), nullif(b.business_area, '')),
  b.brand_tone,
  coalesce(nullif(b.description, ''), nullif(b.products_services, '')),
  coalesce(b.created_at, now()),
  coalesce(b.updated_at, now())
from public.businesses b
where not exists (
  select 1
  from public.user_profiles up
  where up.user_id = b.user_id
)
order by b.user_id, b.updated_at desc nulls last, b.created_at desc nulls last;

create unique index if not exists user_profiles_user_id_unique_idx on public.user_profiles(user_id);
create index if not exists user_profiles_business_type_idx on public.user_profiles(business_type);
create unique index if not exists ai_usage_user_month_unique_idx on public.ai_usage(user_id, month);
create index if not exists ai_usage_month_idx on public.ai_usage(month);
create index if not exists subscriptions_plan_idx on public.subscriptions(plan);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = '';

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_ai_usage_updated_at on public.ai_usage;
create trigger set_ai_usage_updated_at
  before update on public.ai_usage
  for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;
alter table public.ai_usage enable row level security;
alter table public.saved_responses enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "user_profiles_select_own" on public.user_profiles;
drop policy if exists "user_profiles_insert_own" on public.user_profiles;
drop policy if exists "user_profiles_update_own" on public.user_profiles;
drop policy if exists "user_profiles_delete_own" on public.user_profiles;
drop policy if exists "ai_usage_select_own" on public.ai_usage;
drop policy if exists "ai_usage_no_client_insert" on public.ai_usage;
drop policy if exists "ai_usage_no_client_update" on public.ai_usage;
drop policy if exists "ai_usage_no_client_delete" on public.ai_usage;
drop policy if exists "subscriptions_insert_own" on public.subscriptions;
drop policy if exists "subscriptions_update_own" on public.subscriptions;
drop policy if exists "subscriptions_delete_own" on public.subscriptions;

create policy "user_profiles_select_own" on public.user_profiles
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "user_profiles_insert_own" on public.user_profiles
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "user_profiles_update_own" on public.user_profiles
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "user_profiles_delete_own" on public.user_profiles
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "ai_usage_select_own" on public.ai_usage
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "ai_usage_no_client_insert" on public.ai_usage
  for insert to authenticated
  with check (false);

create policy "ai_usage_no_client_update" on public.ai_usage
  for update to authenticated
  using (false)
  with check (false);

create policy "ai_usage_no_client_delete" on public.ai_usage
  for delete to authenticated
  using (false);

revoke all on public.user_profiles from anon, authenticated;
grant select, insert, update, delete on public.user_profiles to authenticated;

revoke all on public.ai_usage from anon, authenticated;
grant select on public.ai_usage to authenticated;

revoke all privileges on public.subscriptions from anon, authenticated;
grant select on public.subscriptions to authenticated;
