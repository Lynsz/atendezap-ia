alter table public.subscriptions
  alter column monthly_limit set default 20;

update public.subscriptions
set monthly_limit = 20,
    updated_at = now()
where (plan is null or lower(plan) in ('free', 'trial'))
  and coalesce(monthly_limit, 30) = 30;
