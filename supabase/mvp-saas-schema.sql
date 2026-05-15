create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamp with time zone default now()
);

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
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
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists generated_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete set null,
  customer_question text not null,
  generated_answer text not null,
  response_type text,
  created_at timestamp with time zone default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  status text default 'novo',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric,
  response_limit integer,
  created_at timestamp with time zone default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_name text default 'free',
  status text default 'trial',
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now()
);

create index if not exists businesses_user_id_idx on businesses(user_id);
create index if not exists generated_responses_user_id_idx on generated_responses(user_id);
create index if not exists generated_responses_business_id_idx on generated_responses(business_id);
create index if not exists customers_user_id_idx on customers(user_id);
create index if not exists subscriptions_user_id_idx on subscriptions(user_id);

alter table profiles enable row level security;
alter table businesses enable row level security;
alter table generated_responses enable row level security;
alter table customers enable row level security;
alter table subscriptions enable row level security;

drop policy if exists "profiles_select_own" on profiles;
drop policy if exists "profiles_insert_own" on profiles;
drop policy if exists "profiles_update_own" on profiles;
drop policy if exists "businesses_crud_own" on businesses;
drop policy if exists "generated_responses_crud_own" on generated_responses;
drop policy if exists "customers_crud_own" on customers;
drop policy if exists "subscriptions_select_own" on subscriptions;

create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "businesses_crud_own" on businesses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "generated_responses_crud_own" on generated_responses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "customers_crud_own" on customers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "subscriptions_select_own" on subscriptions
  for select using (auth.uid() = user_id);

insert into plans (name, price, response_limit)
select 'Inicial', 19.90, 200
where not exists (select 1 from plans where name = 'Inicial');

insert into plans (name, price, response_limit)
select 'Pro', 39.90, 800
where not exists (select 1 from plans where name = 'Pro');
