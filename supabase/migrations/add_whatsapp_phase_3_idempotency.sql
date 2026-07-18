-- WhatsApp Phase 3: idempotency, delivery status, safe send attempts and audit.
-- This migration intentionally stores no raw webhook payloads, message bodies,
-- template variables, access tokens or complete phone numbers in operational tables.

alter table public.whatsapp_messages
  drop constraint if exists whatsapp_messages_status_check;

alter table public.whatsapp_messages
  add constraint whatsapp_messages_status_check
  check (status in ('received', 'unsupported', 'pending', 'sent', 'delivered', 'read', 'failed'));

alter table public.whatsapp_messages
  add column if not exists provider_status_updated_at timestamptz,
  add column if not exists provider_error_type text;

create table if not exists public.whatsapp_webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_key text not null unique,
  event_type text not null check (event_type in ('inbound_message', 'message_status')),
  phone_number_id text,
  message_id text,
  status_id text,
  processing_status text not null default 'received'
    check (processing_status in ('received', 'processed', 'ignored_duplicate', 'failed')),
  error_type text,
  attempts integer not null default 1 check (attempts between 1 and 3),
  duplicate_count integer not null default 0 check (duplicate_count >= 0),
  processed_at timestamptz,
  last_duplicate_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid not null references public.whatsapp_connections(id) on delete cascade,
  provider_template_id text,
  name text not null,
  language text not null,
  category text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'paused', 'disabled')),
  variables_count integer not null default 0 check (variables_count between 0 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name, language)
);

create table if not exists public.whatsapp_send_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  request_key uuid not null,
  content_fingerprint text not null,
  message_type text not null check (message_type in ('text', 'template')),
  suggested_reply_id uuid references public.whatsapp_suggested_replies(id) on delete set null,
  template_id uuid references public.whatsapp_templates(id) on delete set null,
  whatsapp_message_id text,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed', 'blocked_duplicate', 'blocked_rate_limit', 'blocked_policy')),
  error_type text,
  retryable boolean not null default false,
  attempts integer not null default 1 check (attempts between 1 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, conversation_id, request_key)
);

create table if not exists public.whatsapp_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  status text not null,
  error_type text,
  conversation_id uuid references public.whatsapp_conversations(id) on delete set null,
  message_id uuid references public.whatsapp_messages(id) on delete set null,
  template_id uuid references public.whatsapp_templates(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists whatsapp_webhook_events_status_created_idx
  on public.whatsapp_webhook_events(processing_status, created_at desc);
create index if not exists whatsapp_webhook_events_message_idx
  on public.whatsapp_webhook_events(message_id) where message_id is not null;
create index if not exists whatsapp_send_attempts_user_created_idx
  on public.whatsapp_send_attempts(user_id, created_at desc);
create index if not exists whatsapp_send_attempts_recent_fingerprint_idx
  on public.whatsapp_send_attempts(user_id, conversation_id, content_fingerprint, created_at desc);
create index if not exists whatsapp_audit_log_user_created_idx
  on public.whatsapp_audit_log(user_id, created_at desc);
create index if not exists whatsapp_templates_user_status_idx
  on public.whatsapp_templates(user_id, status, updated_at desc);
create index if not exists whatsapp_messages_provider_status_idx
  on public.whatsapp_messages(whatsapp_message_id, direction);

alter table public.whatsapp_webhook_events enable row level security;
alter table public.whatsapp_templates enable row level security;
alter table public.whatsapp_send_attempts enable row level security;
alter table public.whatsapp_audit_log enable row level security;

revoke all on public.whatsapp_webhook_events from anon, authenticated;
revoke all on public.whatsapp_templates from anon, authenticated;
revoke all on public.whatsapp_send_attempts from anon, authenticated;
revoke all on public.whatsapp_audit_log from anon, authenticated;

grant select on public.whatsapp_templates to authenticated;
grant select on public.whatsapp_send_attempts to authenticated;
grant select on public.whatsapp_audit_log to authenticated;

drop policy if exists "whatsapp_templates_select_own" on public.whatsapp_templates;
create policy "whatsapp_templates_select_own" on public.whatsapp_templates
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "whatsapp_send_attempts_select_own" on public.whatsapp_send_attempts;
create policy "whatsapp_send_attempts_select_own" on public.whatsapp_send_attempts
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "whatsapp_audit_log_select_own" on public.whatsapp_audit_log;
create policy "whatsapp_audit_log_select_own" on public.whatsapp_audit_log
  for select to authenticated using ((select auth.uid()) = user_id);

comment on table public.whatsapp_webhook_events is
  'Idempotency metadata only. Raw Meta webhook payloads must never be stored here.';
comment on table public.whatsapp_send_attempts is
  'Operational send metadata only. content_fingerprint is SHA-256; message content and template variables are forbidden.';
comment on table public.whatsapp_audit_log is
  'Minimal operational audit without phone numbers, message bodies, tokens or raw provider errors.';
