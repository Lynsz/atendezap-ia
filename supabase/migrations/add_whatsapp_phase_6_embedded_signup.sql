-- WhatsApp Phase 6: Embedded Signup and tenant-scoped connections.
-- OAuth responses and plaintext tokens must never be persisted. The encrypted
-- token column is deliberately excluded from authenticated Data API grants.

alter table public.whatsapp_connections
  drop constraint if exists whatsapp_connections_status_check,
  drop constraint if exists whatsapp_connections_user_id_business_account_id_key;

alter table public.whatsapp_connections
  add column if not exists connection_source text not null default 'env_global',
  add column if not exists connection_status text not null default 'pending',
  add column if not exists meta_business_id text,
  add column if not exists whatsapp_business_account_id text,
  add column if not exists verified_name text,
  add column if not exists quality_rating text,
  add column if not exists messaging_limit_tier text,
  add column if not exists access_token_encrypted text,
  add column if not exists token_expires_at timestamptz,
  add column if not exists permissions jsonb not null default '[]'::jsonb,
  add column if not exists last_healthcheck_at timestamptz,
  add column if not exists last_error_type text,
  add column if not exists disconnected_at timestamptz;

update public.whatsapp_connections
set
  whatsapp_business_account_id = coalesce(whatsapp_business_account_id, business_account_id),
  connection_status = case status
    when 'active' then 'connected'
    when 'inactive' then 'disconnected'
    when 'error' then 'failed'
    else connection_status
  end
where whatsapp_business_account_id is null or connection_status = 'pending';

alter table public.whatsapp_connections
  add constraint whatsapp_connections_status_check
    check (status in ('inactive', 'active', 'error')),
  add constraint whatsapp_connections_source_check
    check (connection_source in ('env_global', 'embedded_signup', 'manual_admin')),
  add constraint whatsapp_connections_connection_status_check
    check (connection_status in ('pending', 'connected', 'needs_reauth', 'disconnected', 'failed', 'disabled')),
  add constraint whatsapp_connections_permissions_array_check
    check (jsonb_typeof(permissions) = 'array');

create index if not exists whatsapp_connections_user_status_idx
  on public.whatsapp_connections(user_id, connection_status, updated_at desc);
create index if not exists whatsapp_connections_phone_connected_idx
  on public.whatsapp_connections(phone_number_id, connection_status);
create index if not exists whatsapp_connections_healthcheck_idx
  on public.whatsapp_connections(connection_status, last_healthcheck_at)
  where connection_status = 'connected';

alter table public.whatsapp_connections enable row level security;
revoke all on public.whatsapp_connections from anon, authenticated;
grant select (
  id, user_id, business_name, connection_source, connection_status,
  meta_business_id, business_account_id, whatsapp_business_account_id,
  phone_number_id, display_phone_number, verified_name, quality_rating,
  messaging_limit_tier, token_expires_at, permissions, last_healthcheck_at,
  last_error_type, disconnected_at, status, created_at, updated_at
) on public.whatsapp_connections to authenticated;

create table if not exists public.whatsapp_connection_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid references public.whatsapp_connections(id) on delete set null,
  event_type text not null check (event_type in (
    'signup_started', 'signup_completed', 'token_exchanged',
    'phone_number_linked', 'connection_verified', 'connection_failed',
    'connection_disconnected', 'connection_reauth_required',
    'healthcheck_failed', 'healthcheck_ok', 'connection_used_for_send'
  )),
  status text not null,
  error_type text,
  created_at timestamptz not null default now()
);

create index if not exists whatsapp_connection_events_user_created_idx
  on public.whatsapp_connection_events(user_id, created_at desc);
create index if not exists whatsapp_connection_events_connection_created_idx
  on public.whatsapp_connection_events(connection_id, created_at desc);

alter table public.whatsapp_connection_events enable row level security;
revoke all on public.whatsapp_connection_events from anon, authenticated;
grant select on public.whatsapp_connection_events to authenticated;
drop policy if exists "whatsapp_connection_events_select_own" on public.whatsapp_connection_events;
create policy "whatsapp_connection_events_select_own" on public.whatsapp_connection_events
  for select to authenticated using ((select auth.uid()) = user_id);

alter table public.whatsapp_messages add column if not exists connection_id uuid references public.whatsapp_connections(id) on delete cascade;
alter table public.whatsapp_media add column if not exists connection_id uuid references public.whatsapp_connections(id) on delete cascade;
alter table public.whatsapp_suggested_replies add column if not exists connection_id uuid references public.whatsapp_connections(id) on delete cascade;
alter table public.whatsapp_audit_log add column if not exists connection_id uuid references public.whatsapp_connections(id) on delete set null;
alter table public.whatsapp_webhook_events add column if not exists connection_id uuid references public.whatsapp_connections(id) on delete set null;
alter table public.whatsapp_webhook_events add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.whatsapp_send_attempts add column if not exists connection_id uuid references public.whatsapp_connections(id) on delete cascade;

update public.whatsapp_messages m set connection_id = c.connection_id
from public.whatsapp_conversations c where m.conversation_id = c.id and m.connection_id is null;
update public.whatsapp_media m set connection_id = c.connection_id
from public.whatsapp_conversations c where m.conversation_id = c.id and m.connection_id is null;
update public.whatsapp_suggested_replies r set connection_id = c.connection_id
from public.whatsapp_conversations c where r.conversation_id = c.id and r.connection_id is null;
update public.whatsapp_send_attempts a set connection_id = c.connection_id
from public.whatsapp_conversations c where a.conversation_id = c.id and a.connection_id is null;
update public.whatsapp_audit_log a set connection_id = c.connection_id
from public.whatsapp_conversations c where a.conversation_id = c.id and a.connection_id is null;
update public.whatsapp_webhook_events e
set connection_id = c.id, user_id = c.user_id
from public.whatsapp_connections c
where e.phone_number_id = c.phone_number_id and e.connection_id is null;

create index if not exists whatsapp_messages_connection_created_idx on public.whatsapp_messages(connection_id, created_at);
create index if not exists whatsapp_media_connection_created_idx on public.whatsapp_media(connection_id, created_at);
create index if not exists whatsapp_templates_connection_status_idx on public.whatsapp_templates(connection_id, remote_status, local_status);
create index if not exists whatsapp_suggested_replies_connection_idx on public.whatsapp_suggested_replies(connection_id, created_at desc);
create index if not exists whatsapp_audit_log_connection_idx on public.whatsapp_audit_log(connection_id, created_at desc);
create index if not exists whatsapp_webhook_events_connection_idx on public.whatsapp_webhook_events(connection_id, created_at desc);
create index if not exists whatsapp_send_attempts_connection_idx on public.whatsapp_send_attempts(connection_id, created_at desc);

comment on column public.whatsapp_connections.access_token_encrypted is
  'AES-256-GCM encrypted server-only token. Never grant this column to authenticated or return it to clients.';
comment on table public.whatsapp_connection_events is
  'Safe connection lifecycle audit only. OAuth codes, tokens, raw payloads and full phone numbers are forbidden.';

-- Preserve the complete pre-Phase-6 allowlist and append only the approved
-- connection lifecycle analytics names.
do $$
declare
  previous_check text;
  phase_6_events text[] := array[
    'whatsapp_embedded_signup_started',
    'whatsapp_embedded_signup_completed',
    'whatsapp_embedded_signup_failed',
    'whatsapp_connection_created',
    'whatsapp_connection_disconnected',
    'whatsapp_connection_reauth_required',
    'whatsapp_connection_healthcheck_failed'
  ];
begin
  select pg_get_expr(conbin, conrelid)
  into previous_check
  from pg_constraint
  where conrelid = 'public.app_events'::regclass
    and conname = 'app_events_event_name_check';

  if previous_check is null then
    raise exception 'app_events_event_name_check is required before Phase 6';
  end if;

  alter table public.app_events drop constraint app_events_event_name_check;
  execute format(
    'alter table public.app_events add constraint app_events_event_name_check check ((%s) or event_name = any (%L::text[]))',
    previous_check,
    phase_6_events
  );
end $$;
