alter table public.generated_responses add column if not exists business_type text;
alter table public.generated_responses add column if not exists brand_tone text;

create table if not exists public.ai_response_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  response_id uuid references public.generated_responses(id) on delete cascade not null,
  rating text not null,
  comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint ai_response_feedback_rating_check check (rating in ('positive', 'negative')),
  constraint ai_response_feedback_user_response_unique unique (user_id, response_id)
);

create index if not exists ai_response_feedback_user_id_idx on public.ai_response_feedback(user_id);
create index if not exists ai_response_feedback_response_id_idx on public.ai_response_feedback(response_id);
create index if not exists ai_response_feedback_rating_idx on public.ai_response_feedback(rating);
create index if not exists ai_response_feedback_created_at_idx on public.ai_response_feedback(created_at desc);

drop trigger if exists set_ai_response_feedback_updated_at on public.ai_response_feedback;
create trigger set_ai_response_feedback_updated_at
  before update on public.ai_response_feedback
  for each row execute function public.set_updated_at();

alter table public.ai_response_feedback enable row level security;

drop policy if exists "ai_response_feedback_select_own" on public.ai_response_feedback;
drop policy if exists "ai_response_feedback_insert_own" on public.ai_response_feedback;
drop policy if exists "ai_response_feedback_update_own" on public.ai_response_feedback;

create policy "ai_response_feedback_select_own" on public.ai_response_feedback
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "ai_response_feedback_insert_own" on public.ai_response_feedback
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.generated_responses gr
      where gr.id = response_id
        and gr.user_id = (select auth.uid())
    )
  );

create policy "ai_response_feedback_update_own" on public.ai_response_feedback
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.generated_responses gr
      where gr.id = response_id
        and gr.user_id = (select auth.uid())
    )
  );

revoke all on public.ai_response_feedback from anon, authenticated;
grant select, insert, update on public.ai_response_feedback to authenticated;
