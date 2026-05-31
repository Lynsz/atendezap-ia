create table if not exists public.product_insights (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  type text not null,
  category text not null,
  title text not null,
  description text,
  severity text not null default 'medium',
  status text not null default 'new',
  impact_area text,
  user_id uuid references auth.users(id) on delete set null,
  related_support_request_id uuid references public.support_requests(id) on delete set null,
  related_campaign_id uuid references public.campaign_experiments(id) on delete set null,
  related_feedback_id uuid,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_insights_type_check check (
    type in ('bug', 'improvement', 'feature_request', 'complaint', 'question', 'churn_reason', 'campaign_learning', 'ai_quality')
  ),
  constraint product_insights_severity_check check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  constraint product_insights_status_check check (
    status in ('new', 'reviewing', 'planned', 'in_progress', 'shipped', 'rejected', 'archived')
  ),
  constraint product_insights_impact_area_check check (
    impact_area is null or impact_area in ('activation', 'retention', 'conversion', 'billing', 'ai_quality', 'support', 'privacy', 'campaign', 'usability', 'performance')
  )
);

create index if not exists product_insights_type_idx on public.product_insights(type);
create index if not exists product_insights_severity_idx on public.product_insights(severity);
create index if not exists product_insights_status_idx on public.product_insights(status);
create index if not exists product_insights_impact_area_idx on public.product_insights(impact_area) where impact_area is not null;
create index if not exists product_insights_created_at_idx on public.product_insights(created_at desc);
create index if not exists product_insights_related_support_request_idx on public.product_insights(related_support_request_id) where related_support_request_id is not null;
create index if not exists product_insights_related_campaign_idx on public.product_insights(related_campaign_id) where related_campaign_id is not null;
create index if not exists product_insights_related_feedback_idx on public.product_insights(related_feedback_id) where related_feedback_id is not null;

drop trigger if exists set_product_insights_updated_at on public.product_insights;
create trigger set_product_insights_updated_at
  before update on public.product_insights
  for each row execute function public.set_updated_at();

alter table public.product_insights enable row level security;

drop policy if exists "product_insights_no_client_access" on public.product_insights;
create policy "product_insights_no_client_access" on public.product_insights
  for all to anon, authenticated
  using (false)
  with check (false);

revoke all on public.product_insights from anon, authenticated;

comment on table public.product_insights is 'Insights internos de produto derivados de feedback, suporte, churn e campanhas. Acesso via APIs admin; nao armazenar dados pessoais ou conteudo completo desnecessario.';
comment on column public.product_insights.description is 'Resumo do problema ou aprendizado. Nao registrar conversas completas, respostas completas, dados de pagamento ou secrets.';
comment on column public.product_insights.admin_notes is 'Notas internas de triagem e decisao. Nao registrar dados sensiveis.';
