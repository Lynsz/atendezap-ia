alter table public.subscriptions add column if not exists plan text default 'free';
alter table public.subscriptions add column if not exists monthly_limit integer default 30;
alter table public.subscriptions add column if not exists price numeric;
alter table public.subscriptions add column if not exists first_month_price numeric;
alter table public.subscriptions add column if not exists is_first_month_offer boolean default false;
alter table public.subscriptions add column if not exists first_month_offer_used_at timestamptz;
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

create unique index if not exists ebook_leads_email_unique_idx on public.ebook_leads(email);

drop trigger if exists set_ebook_leads_updated_at on public.ebook_leads;
create trigger set_ebook_leads_updated_at
  before update on public.ebook_leads
  for each row execute function public.set_updated_at();

alter table public.ebook_leads enable row level security;

drop policy if exists "ebook_leads_no_client_access" on public.ebook_leads;
create policy "ebook_leads_no_client_access" on public.ebook_leads for all to anon, authenticated using (false) with check (false);

revoke all on public.ebook_leads from anon, authenticated;

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

update public.subscriptions
set
  plan = coalesce(plan, plan_name, 'free'),
  monthly_limit = coalesce(monthly_limit, 30)
where plan is null or monthly_limit is null;
