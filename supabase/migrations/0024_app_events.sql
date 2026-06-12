create table if not exists public.app_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  page text,
  source text,
  plan text,
  business_type text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.app_events
  add constraint app_events_event_name_check
  check (event_name in (
    'signup_completed',
    'onboarding_completed',
    'dashboard_viewed',
    'first_response_generated',
    'response_copied',
    'response_saved',
    'template_copied',
    'template_saved',
    'library_viewed',
    'pricing_viewed',
    'checkout_started',
    'usage_limit_reached',
    'support_request_created',
    'ai_feedback_submitted'
  ));

create index if not exists app_events_user_id_idx on public.app_events(user_id);
create index if not exists app_events_event_name_idx on public.app_events(event_name);
create index if not exists app_events_created_at_idx on public.app_events(created_at desc);
create index if not exists app_events_page_idx on public.app_events(page);

alter table public.app_events enable row level security;

drop policy if exists "app_events_insert_own_or_anonymous" on public.app_events;
drop policy if exists "app_events_no_select_for_clients" on public.app_events;

create policy "app_events_insert_own_or_anonymous" on public.app_events
  for insert to authenticated
  with check (user_id is null or (select auth.uid()) = user_id);

create policy "app_events_no_select_for_clients" on public.app_events
  for select to anon, authenticated
  using (false);

revoke all on public.app_events from anon, authenticated;
grant insert on public.app_events to authenticated;

alter table public.ai_response_feedback
  add column if not exists business_type text;

create index if not exists ai_response_feedback_business_type_idx on public.ai_response_feedback(business_type);

alter table public.support_requests
  drop constraint if exists support_requests_category_check;

alter table public.support_requests
  add constraint support_requests_category_check
  check (category in (
    'problema tecnico',
    'duvida sobre assinatura',
    'duvida sobre IA',
    'sugestao',
    'outro',
    'Duvida',
    'Bug',
    'Assinatura',
    'Cobranca',
    'Geracao de resposta',
    'Conta/Login',
    'Sugestao',
    'Outro'
  ));

comment on table public.app_events is 'Eventos seguros do produto para diagnostico de MVP. Nao salvar mensagens, respostas, contatos, tokens, pagamentos ou secrets.';
comment on column public.app_events.metadata is 'Apenas metadados permitidos: plan, business_type, source, page, category, template_niche, response_length_range, usage_count e usage_limit.';
