create table if not exists public.cancellation_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  reason text not null,
  comment text,
  created_at timestamptz default now(),
  constraint cancellation_feedback_reason_check check (
    reason in (
      'preco',
      'nao_entendi_produto',
      'usei_pouco',
      'respostas_nao_foram_boas',
      'faltou_integracao_whatsapp',
      'encontrei_outra_solucao',
      'problema_tecnico',
      'outro'
    )
  )
);

create index if not exists cancellation_feedback_user_id_idx on public.cancellation_feedback(user_id);
create index if not exists cancellation_feedback_subscription_id_idx on public.cancellation_feedback(subscription_id) where subscription_id is not null;
create index if not exists cancellation_feedback_reason_idx on public.cancellation_feedback(reason);
create index if not exists cancellation_feedback_created_at_idx on public.cancellation_feedback(created_at desc);

alter table public.cancellation_feedback enable row level security;

drop policy if exists "cancellation_feedback_select_own" on public.cancellation_feedback;
drop policy if exists "cancellation_feedback_insert_own" on public.cancellation_feedback;

create policy "cancellation_feedback_select_own" on public.cancellation_feedback
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "cancellation_feedback_insert_own" on public.cancellation_feedback
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on public.cancellation_feedback from anon, authenticated;
grant select, insert on public.cancellation_feedback to authenticated;
