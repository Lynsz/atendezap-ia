create table if not exists public.campaign_experiments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  niche text,
  channel text not null,
  objective text not null,
  destination_url text,
  utm_campaign text,
  utm_content text,
  cta text,
  budget_amount numeric(12, 2),
  currency text not null default 'BRL',
  start_date date,
  end_date date,
  status text not null default 'planned',
  notes text,
  decision text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaign_experiments_status_check check (
    status in ('planned', 'running', 'paused', 'completed', 'archived')
  ),
  constraint campaign_experiments_decision_check check (
    decision is null or decision in ('keep', 'pause', 'iterate', 'scale_cautiously', 'inconclusive')
  ),
  constraint campaign_experiments_budget_non_negative_check check (
    budget_amount is null or budget_amount >= 0
  ),
  constraint campaign_experiments_currency_check check (
    currency ~ '^[A-Z]{3}$'
  ),
  constraint campaign_experiments_dates_check check (
    start_date is null or end_date is null or end_date >= start_date
  )
);

create table if not exists public.campaign_results (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaign_experiments(id) on delete cascade,
  visitors integer,
  clicks integer,
  leads integer,
  signups integer,
  onboardings integer,
  first_responses integer,
  saved_responses integer,
  checkouts integer,
  subscriptions integer,
  spend_amount numeric(12, 2),
  cost_per_lead numeric(12, 2),
  cost_per_signup numeric(12, 2),
  cost_per_subscription numeric(12, 2),
  notes text,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaign_results_numbers_non_negative_check check (
    (visitors is null or visitors >= 0)
    and (clicks is null or clicks >= 0)
    and (leads is null or leads >= 0)
    and (signups is null or signups >= 0)
    and (onboardings is null or onboardings >= 0)
    and (first_responses is null or first_responses >= 0)
    and (saved_responses is null or saved_responses >= 0)
    and (checkouts is null or checkouts >= 0)
    and (subscriptions is null or subscriptions >= 0)
  ),
  constraint campaign_results_amounts_non_negative_check check (
    (spend_amount is null or spend_amount >= 0)
    and (cost_per_lead is null or cost_per_lead >= 0)
    and (cost_per_signup is null or cost_per_signup >= 0)
    and (cost_per_subscription is null or cost_per_subscription >= 0)
  )
);

create index if not exists campaign_experiments_status_idx on public.campaign_experiments(status);
create index if not exists campaign_experiments_niche_idx on public.campaign_experiments(niche) where niche is not null;
create index if not exists campaign_experiments_channel_idx on public.campaign_experiments(channel);
create index if not exists campaign_experiments_created_at_idx on public.campaign_experiments(created_at desc);

create index if not exists campaign_results_campaign_id_idx on public.campaign_results(campaign_id);
create index if not exists campaign_results_recorded_at_idx on public.campaign_results(recorded_at desc);

drop trigger if exists set_campaign_experiments_updated_at on public.campaign_experiments;
create trigger set_campaign_experiments_updated_at
  before update on public.campaign_experiments
  for each row execute function public.set_updated_at();

drop trigger if exists set_campaign_results_updated_at on public.campaign_results;
create trigger set_campaign_results_updated_at
  before update on public.campaign_results
  for each row execute function public.set_updated_at();

alter table public.campaign_experiments enable row level security;
alter table public.campaign_results enable row level security;

drop policy if exists "campaign_experiments_no_client_access" on public.campaign_experiments;
drop policy if exists "campaign_results_no_client_access" on public.campaign_results;

create policy "campaign_experiments_no_client_access" on public.campaign_experiments
  for all to anon, authenticated
  using (false)
  with check (false);

create policy "campaign_results_no_client_access" on public.campaign_results
  for all to anon, authenticated
  using (false)
  with check (false);

revoke all on public.campaign_experiments from anon, authenticated;
revoke all on public.campaign_results from anon, authenticated;

comment on table public.campaign_experiments is 'Registro interno manual de campanhas pequenas. Nao armazenar dados pessoais, secrets, dados de pagamento ou conteudo completo de respostas.';
comment on table public.campaign_results is 'Resultados manuais e agregados por campanha. Nao armazenar dados pessoais, secrets, dados de pagamento ou conteudo completo de respostas.';
comment on column public.campaign_experiments.notes is 'Notas internas sem dados pessoais, secrets, dados de pagamento ou conteudo completo de respostas.';
comment on column public.campaign_experiments.decision is 'Decisao interna simples: keep, pause, iterate, scale_cautiously ou inconclusive.';
comment on column public.campaign_results.notes is 'Notas internas agregadas, sem dados pessoais ou sensiveis.';
