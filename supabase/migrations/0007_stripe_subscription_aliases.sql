alter table public.subscriptions add column if not exists stripe_customer_id text;
alter table public.subscriptions add column if not exists stripe_subscription_id text;
alter table public.subscriptions add column if not exists subscription_status text;
alter table public.subscriptions add column if not exists usage_count integer not null default 0;

update public.subscriptions
set
  stripe_customer_id = coalesce(stripe_customer_id, provider_customer_id),
  stripe_subscription_id = coalesce(stripe_subscription_id, provider_subscription_id),
  subscription_status = coalesce(subscription_status, status),
  usage_count = coalesce(usage_count, 0)
where
  stripe_customer_id is null
  or stripe_subscription_id is null
  or subscription_status is null
  or usage_count is null;

create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions(stripe_customer_id);
create index if not exists subscriptions_stripe_subscription_id_idx on public.subscriptions(stripe_subscription_id);
create index if not exists subscriptions_subscription_status_idx on public.subscriptions(subscription_status);
