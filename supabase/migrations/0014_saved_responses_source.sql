alter table public.saved_responses
  add column if not exists source text not null default 'manual';

update public.saved_responses
set source = case
  when source_template_id is not null then 'template'
  when response_id is not null then 'ai_generated'
  else 'manual'
end
where source is null
  or source not in ('ai_generated', 'template', 'manual');

alter table public.saved_responses
  drop constraint if exists saved_responses_source_check;

alter table public.saved_responses
  add constraint saved_responses_source_check
  check (source in ('ai_generated', 'template', 'manual'));

create index if not exists saved_responses_source_idx
  on public.saved_responses(source);
