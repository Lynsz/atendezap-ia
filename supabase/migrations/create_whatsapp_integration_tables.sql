-- Phase 1: official WhatsApp Cloud API integration.
-- Message bodies and contact data are private customer data. Authenticated users
-- can only read their own rows; all writes happen in validated server routes.

create table if not exists public.whatsapp_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  phone_number_id text not null unique,
  business_account_id text not null,
  display_phone_number text,
  status text not null default 'inactive' check (status in ('inactive', 'active', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, business_account_id)
);

create table if not exists public.whatsapp_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid not null references public.whatsapp_connections(id) on delete cascade,
  whatsapp_user_id text not null,
  phone_number text not null,
  display_name text,
  opt_in_status text not null default 'unknown' check (opt_in_status in ('unknown', 'opted_in', 'opted_out')),
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, whatsapp_user_id)
);

create table if not exists public.whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid not null references public.whatsapp_connections(id) on delete cascade,
  contact_id uuid not null references public.whatsapp_contacts(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'open', 'closed')),
  customer_service_window_until timestamptz,
  last_inbound_at timestamptz,
  last_outbound_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, contact_id)
);

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  contact_id uuid not null references public.whatsapp_contacts(id) on delete cascade,
  whatsapp_message_id text not null unique,
  idempotency_key uuid unique,
  direction text not null check (direction in ('inbound', 'outbound')),
  message_type text not null default 'text',
  text text,
  status text not null default 'received' check (status in ('received', 'unsupported', 'pending', 'sent', 'failed')),
  sent_by uuid references auth.users(id) on delete set null,
  provider_created_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.whatsapp_suggested_replies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  source_message_id uuid references public.whatsapp_messages(id) on delete set null,
  suggested_text text not null,
  status text not null default 'draft' check (status in ('draft', 'approved', 'sent', 'discarded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists whatsapp_connections_user_id_idx on public.whatsapp_connections(user_id);
create index if not exists whatsapp_contacts_user_last_message_idx on public.whatsapp_contacts(user_id, last_message_at desc);
create index if not exists whatsapp_conversations_user_updated_idx on public.whatsapp_conversations(user_id, updated_at desc);
create index if not exists whatsapp_conversations_contact_idx on public.whatsapp_conversations(contact_id);
create index if not exists whatsapp_messages_conversation_created_idx on public.whatsapp_messages(conversation_id, created_at);
create index if not exists whatsapp_messages_user_id_idx on public.whatsapp_messages(user_id);
create index if not exists whatsapp_suggested_replies_conversation_idx on public.whatsapp_suggested_replies(conversation_id, created_at desc);

alter table public.whatsapp_connections enable row level security;
alter table public.whatsapp_contacts enable row level security;
alter table public.whatsapp_conversations enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.whatsapp_suggested_replies enable row level security;

revoke all on public.whatsapp_connections from anon, authenticated;
revoke all on public.whatsapp_contacts from anon, authenticated;
revoke all on public.whatsapp_conversations from anon, authenticated;
revoke all on public.whatsapp_messages from anon, authenticated;
revoke all on public.whatsapp_suggested_replies from anon, authenticated;

grant select on public.whatsapp_connections to authenticated;
grant select on public.whatsapp_contacts to authenticated;
grant select on public.whatsapp_conversations to authenticated;
grant select on public.whatsapp_messages to authenticated;
grant select on public.whatsapp_suggested_replies to authenticated;

drop policy if exists "whatsapp_connections_select_own" on public.whatsapp_connections;
create policy "whatsapp_connections_select_own" on public.whatsapp_connections
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "whatsapp_contacts_select_own" on public.whatsapp_contacts;
create policy "whatsapp_contacts_select_own" on public.whatsapp_contacts
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "whatsapp_conversations_select_own" on public.whatsapp_conversations;
create policy "whatsapp_conversations_select_own" on public.whatsapp_conversations
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "whatsapp_messages_select_own" on public.whatsapp_messages;
create policy "whatsapp_messages_select_own" on public.whatsapp_messages
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "whatsapp_suggested_replies_select_own" on public.whatsapp_suggested_replies;
create policy "whatsapp_suggested_replies_select_own" on public.whatsapp_suggested_replies
  for select to authenticated using ((select auth.uid()) = user_id);

comment on table public.whatsapp_messages is 'Private WhatsApp message content. Never include text in analytics or logs.';
comment on table public.whatsapp_contacts is 'Private WhatsApp contact data. Never include phone numbers in analytics or logs.';
