create extension if not exists "pgcrypto";

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  phone text,
  created_at timestamp with time zone default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  kiwify_order_id text,
  kiwify_payload jsonb,
  status text not null default 'pending',
  product_name text,
  amount numeric,
  access_token text unique not null,
  access_token_used boolean default false,
  created_at timestamp with time zone default now(),
  approved_at timestamp with time zone
);

create table if not exists kits (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  order_id uuid references orders(id),
  business_name text not null,
  niche text not null,
  form_data jsonb not null,
  ai_output jsonb not null,
  pdf_url text,
  status text default 'generated',
  created_at timestamp with time zone default now()
);

create table if not exists support_requests (
  id uuid primary key default gen_random_uuid(),
  email text,
  message text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists customers_email_idx on customers(email);
create unique index if not exists customers_email_unique_idx on customers(email);
create index if not exists orders_access_token_idx on orders(access_token);
create index if not exists orders_kiwify_order_id_idx on orders(kiwify_order_id);
create unique index if not exists orders_kiwify_order_id_unique_idx on orders(kiwify_order_id) where kiwify_order_id is not null;
create index if not exists kits_order_id_idx on kits(order_id);
create index if not exists kits_customer_id_idx on kits(customer_id);
create index if not exists events_event_name_idx on events(event_name);

alter table customers enable row level security;
alter table orders enable row level security;
alter table kits enable row level security;
alter table support_requests enable row level security;
alter table events enable row level security;

revoke all on customers from anon, authenticated;
revoke all on orders from anon, authenticated;
revoke all on kits from anon, authenticated;
revoke all on support_requests from anon, authenticated;
revoke all on events from anon, authenticated;
