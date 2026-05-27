alter table public.saved_responses
  add column if not exists is_favorite boolean not null default false;

alter table public.saved_responses
  add column if not exists copy_count integer not null default 0;

alter table public.saved_responses
  add column if not exists last_copied_at timestamptz;

alter table public.saved_responses
  drop constraint if exists saved_responses_copy_count_non_negative;

alter table public.saved_responses
  add constraint saved_responses_copy_count_non_negative
  check (copy_count >= 0) not valid;

alter table public.saved_responses
  validate constraint saved_responses_copy_count_non_negative;

create index if not exists saved_responses_user_favorite_idx
  on public.saved_responses(user_id, is_favorite, updated_at desc);

create index if not exists saved_responses_user_last_copied_idx
  on public.saved_responses(user_id, last_copied_at desc)
  where last_copied_at is not null;
