alter table public.saved_responses
  drop constraint if exists saved_responses_category_check;

alter table public.saved_responses
  add constraint saved_responses_category_check
  check (category is null or char_length(category) <= 80) not valid;

alter table public.saved_responses
  validate constraint saved_responses_category_check;

alter table public.saved_responses
  drop constraint if exists saved_responses_source_check;

alter table public.saved_responses
  add constraint saved_responses_source_check
  check (source in ('ai', 'ai_generated', 'template', 'manual'));
