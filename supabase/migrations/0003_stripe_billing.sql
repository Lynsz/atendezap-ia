alter table public.subscriptions add column if not exists provider text;
alter table public.subscriptions add column if not exists provider_customer_id text;
alter table public.subscriptions add column if not exists provider_subscription_id text;
alter table public.subscriptions add column if not exists provider_price_id text;
alter table public.subscriptions add column if not exists provider_payment_id text;
alter table public.subscriptions add column if not exists stripe_checkout_session_id text;
alter table public.subscriptions add column if not exists stripe_event_id text;
alter table public.subscriptions add column if not exists acquisition_source text;
alter table public.subscriptions add column if not exists funnel_source text;
alter table public.subscriptions add column if not exists first_month_price_applied boolean default false;
alter table public.subscriptions add column if not exists promo_code text;
alter table public.subscriptions add column if not exists cancel_at_period_end boolean default false;
alter table public.subscriptions add column if not exists last_payment_status text;
alter table public.subscriptions add column if not exists metadata jsonb default '{}'::jsonb;

create table if not exists public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz default now()
);

create unique index if not exists stripe_webhook_events_provider_event_id_unique_idx on public.stripe_webhook_events(provider_event_id);
create index if not exists subscriptions_provider_subscription_id_idx on public.subscriptions(provider_subscription_id);
create index if not exists subscriptions_provider_customer_id_idx on public.subscriptions(provider_customer_id);
create index if not exists subscriptions_provider_price_id_idx on public.subscriptions(provider_price_id);

alter table public.stripe_webhook_events enable row level security;

create policy "stripe_webhook_events_no_client_access" on public.stripe_webhook_events for all to anon, authenticated using (false) with check (false);

revoke all on public.stripe_webhook_events from anon, authenticated;

update public.subscriptions
set provider = coalesce(provider, 'kiwify')
where provider is null;
