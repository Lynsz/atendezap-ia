create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  business_area text,
  description text,
  products_services text,
  prices text,
  opening_hours text,
  address text,
  payment_methods text,
  booking_or_payment_link text,
  brand_tone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.generated_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete set null,
  customer_question text not null,
  generated_answer text not null,
  response_type text,
  created_at timestamptz default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  status text default 'novo',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_name text default 'free',
  plan text default 'free',
  monthly_limit integer default 30,
  price numeric,
  first_month_price numeric,
  is_first_month_offer boolean default false,
  first_month_offer_used_at timestamptz,
  first_month_price_applied boolean default false,
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  provider_price_id text,
  provider_payment_id text,
  stripe_checkout_session_id text,
  stripe_event_id text,
  acquisition_source text,
  funnel_source text,
  promo_code text,
  cancel_at_period_end boolean default false,
  last_payment_status text,
  metadata jsonb default '{}'::jsonb,
  status text default 'trial',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price numeric,
  first_month_price numeric,
  is_first_month_offer boolean default false,
  response_limit integer,
  status text default 'active',
  created_at timestamptz default now()
);

alter table public.subscriptions add column if not exists plan text default 'free';
alter table public.subscriptions add column if not exists monthly_limit integer default 30;
alter table public.subscriptions add column if not exists price numeric;
alter table public.subscriptions add column if not exists first_month_price numeric;
alter table public.subscriptions add column if not exists is_first_month_offer boolean default false;
alter table public.subscriptions add column if not exists first_month_offer_used_at timestamptz;
alter table public.subscriptions add column if not exists first_month_price_applied boolean default false;
alter table public.subscriptions add column if not exists provider text;
alter table public.subscriptions add column if not exists provider_customer_id text;
alter table public.subscriptions add column if not exists provider_subscription_id text;
alter table public.subscriptions add column if not exists provider_price_id text;
alter table public.subscriptions add column if not exists provider_payment_id text;
alter table public.subscriptions add column if not exists stripe_checkout_session_id text;
alter table public.subscriptions add column if not exists stripe_event_id text;
alter table public.subscriptions add column if not exists acquisition_source text;
alter table public.subscriptions add column if not exists funnel_source text;
alter table public.subscriptions add column if not exists promo_code text;
alter table public.subscriptions add column if not exists cancel_at_period_end boolean default false;
alter table public.subscriptions add column if not exists last_payment_status text;
alter table public.subscriptions add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.subscriptions add column if not exists current_period_start timestamptz;
alter table public.plans add column if not exists first_month_price numeric;
alter table public.plans add column if not exists is_first_month_offer boolean default false;
alter table public.plans add column if not exists status text default 'active';

create table if not exists public.ebook_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text not null,
  source text default 'ebook_page',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.purchasers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.purchasers(id),
  kiwify_order_id text,
  kiwify_payload jsonb,
  status text not null default 'pending',
  product_name text,
  amount numeric,
  access_token text unique not null,
  access_token_used boolean default false,
  created_at timestamptz default now(),
  approved_at timestamptz
);

create table if not exists public.kits (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.purchasers(id),
  order_id uuid references public.orders(id),
  business_name text not null,
  niche text not null,
  form_data jsonb not null,
  ai_output jsonb not null,
  pdf_url text,
  status text default 'generated',
  created_at timestamptz default now()
);

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  email text,
  message text,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists businesses_user_id_idx on public.businesses(user_id);
create index if not exists generated_responses_user_id_idx on public.generated_responses(user_id);
create index if not exists generated_responses_business_id_idx on public.generated_responses(business_id);
create index if not exists customers_user_id_idx on public.customers(user_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create unique index if not exists subscriptions_user_id_unique_idx on public.subscriptions(user_id);
create unique index if not exists ebook_leads_email_unique_idx on public.ebook_leads(email);
create unique index if not exists stripe_webhook_events_provider_event_id_unique_idx on public.stripe_webhook_events(provider_event_id);
create index if not exists subscriptions_provider_subscription_id_idx on public.subscriptions(provider_subscription_id);
create index if not exists subscriptions_provider_customer_id_idx on public.subscriptions(provider_customer_id);
create index if not exists subscriptions_provider_price_id_idx on public.subscriptions(provider_price_id);
create index if not exists purchasers_email_idx on public.purchasers(email);
create unique index if not exists purchasers_email_unique_idx on public.purchasers(email);
create index if not exists orders_customer_id_idx on public.orders(customer_id);
create index if not exists orders_access_token_idx on public.orders(access_token);
create unique index if not exists orders_kiwify_order_id_unique_idx on public.orders(kiwify_order_id) where kiwify_order_id is not null;
create index if not exists kits_order_id_idx on public.kits(order_id);
create index if not exists kits_customer_id_idx on public.kits(customer_id);
create index if not exists events_event_name_idx on public.events(event_name);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = '';

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_businesses_updated_at on public.businesses;
create trigger set_businesses_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

drop trigger if exists set_customers_updated_at on public.customers;
create trigger set_customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

drop trigger if exists set_ebook_leads_updated_at on public.ebook_leads;
create trigger set_ebook_leads_updated_at
  before update on public.ebook_leads
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name),
    updated_at = now();

  insert into public.subscriptions (user_id, plan_name, plan, monthly_limit, status)
  values (new.id, 'free', 'free', 30, 'trial')
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.generated_responses enable row level security;
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.plans enable row level security;
alter table public.ebook_leads enable row level security;
alter table public.stripe_webhook_events enable row level security;
alter table public.purchasers enable row level security;
alter table public.orders enable row level security;
alter table public.kits enable row level security;
alter table public.support_requests enable row level security;
alter table public.events enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "businesses_select_own" on public.businesses;
drop policy if exists "businesses_insert_own" on public.businesses;
drop policy if exists "businesses_update_own" on public.businesses;
drop policy if exists "businesses_delete_own" on public.businesses;
drop policy if exists "generated_responses_select_own" on public.generated_responses;
drop policy if exists "generated_responses_insert_own" on public.generated_responses;
drop policy if exists "generated_responses_delete_own" on public.generated_responses;
drop policy if exists "customers_select_own" on public.customers;
drop policy if exists "customers_insert_own" on public.customers;
drop policy if exists "customers_update_own" on public.customers;
drop policy if exists "customers_delete_own" on public.customers;
drop policy if exists "subscriptions_select_own" on public.subscriptions;
drop policy if exists "subscriptions_insert_own" on public.subscriptions;
drop policy if exists "subscriptions_update_own" on public.subscriptions;
drop policy if exists "subscriptions_delete_own" on public.subscriptions;
drop policy if exists "plans_select_public" on public.plans;
drop policy if exists "ebook_leads_no_client_access" on public.ebook_leads;
drop policy if exists "stripe_webhook_events_no_client_access" on public.stripe_webhook_events;
drop policy if exists "purchasers_no_client_access" on public.purchasers;
drop policy if exists "orders_no_client_access" on public.orders;
drop policy if exists "kits_no_client_access" on public.kits;
drop policy if exists "support_requests_no_client_access" on public.support_requests;
drop policy if exists "events_no_client_access" on public.events;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "businesses_select_own" on public.businesses for select to authenticated using ((select auth.uid()) = user_id);
create policy "businesses_insert_own" on public.businesses for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "businesses_update_own" on public.businesses for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "businesses_delete_own" on public.businesses for delete to authenticated using ((select auth.uid()) = user_id);

create policy "generated_responses_select_own" on public.generated_responses for select to authenticated using ((select auth.uid()) = user_id);
create policy "generated_responses_insert_own" on public.generated_responses for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "generated_responses_delete_own" on public.generated_responses for delete to authenticated using ((select auth.uid()) = user_id);

create policy "customers_select_own" on public.customers for select to authenticated using ((select auth.uid()) = user_id);
create policy "customers_insert_own" on public.customers for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "customers_update_own" on public.customers for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "customers_delete_own" on public.customers for delete to authenticated using ((select auth.uid()) = user_id);

create policy "subscriptions_select_own" on public.subscriptions for select to authenticated using ((select auth.uid()) = user_id);
-- Assinaturas pagas devem ser atualizadas apenas por webhook/backend seguro.
-- Clientes autenticados podem ler a propria assinatura, mas nao podem criar, apagar ou alterar plano/status pelo navegador.

create policy "plans_select_public" on public.plans for select to anon, authenticated using (true);
-- Planos sao leitura publica para exibicao comercial. Escrita em plans nao e liberada para anon/authenticated.
create policy "ebook_leads_no_client_access" on public.ebook_leads for all to anon, authenticated using (false) with check (false);
create policy "stripe_webhook_events_no_client_access" on public.stripe_webhook_events for all to anon, authenticated using (false) with check (false);
create policy "purchasers_no_client_access" on public.purchasers for all to anon, authenticated using (false) with check (false);
create policy "orders_no_client_access" on public.orders for all to anon, authenticated using (false) with check (false);
create policy "kits_no_client_access" on public.kits for all to anon, authenticated using (false) with check (false);
create policy "support_requests_no_client_access" on public.support_requests for all to anon, authenticated using (false) with check (false);
create policy "events_no_client_access" on public.events for all to anon, authenticated using (false) with check (false);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.businesses, public.generated_responses, public.customers to authenticated;
revoke all privileges on public.subscriptions from anon, authenticated;
grant select on public.subscriptions to authenticated;
revoke all privileges on public.plans from anon, authenticated;
grant select on public.plans to anon, authenticated;
revoke all on public.ebook_leads from anon, authenticated;
revoke all on public.stripe_webhook_events from anon, authenticated;
revoke all on public.purchasers, public.orders, public.kits, public.support_requests, public.events from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated, public;

insert into public.plans (name, price, first_month_price, is_first_month_offer, response_limit, status)
values
  ('starter', 49.00, null, false, 150, 'active'),
  ('pro', 97.00, 29.00, true, 600, 'active'),
  ('premium', 197.00, null, false, 2000, 'active')
on conflict (name) do update set
  price = excluded.price,
  first_month_price = excluded.first_month_price,
  is_first_month_offer = excluded.is_first_month_offer,
  response_limit = excluded.response_limit,
  status = excluded.status;

insert into public.subscriptions (user_id, plan_name, plan, monthly_limit, status)
select u.id, 'free', 'free', 30, 'trial'
from auth.users u
where not exists (
  select 1
  from public.subscriptions s
  where s.user_id = u.id
);

update public.subscriptions
set provider = coalesce(provider, 'kiwify')
where provider is null;
