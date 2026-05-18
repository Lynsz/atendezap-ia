create table if not exists public.lead_email_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.ebook_leads(id) on delete set null,
  email text not null,
  event_type text not null,
  subject text not null,
  status text not null default 'pending',
  provider text default 'resend',
  provider_message_id text,
  sent_at timestamptz,
  error text,
  created_at timestamptz default now()
);

create index if not exists lead_email_events_lead_id_idx on public.lead_email_events(lead_id);
create index if not exists lead_email_events_email_idx on public.lead_email_events(email);
create index if not exists lead_email_events_created_at_idx on public.lead_email_events(created_at desc);

alter table public.lead_email_events enable row level security;

drop policy if exists "lead_email_events_no_client_access" on public.lead_email_events;
create policy "lead_email_events_no_client_access" on public.lead_email_events for all to anon, authenticated using (false) with check (false);

revoke all on public.lead_email_events from anon, authenticated;

comment on table public.lead_email_events is 'Registro operacional de envios de e-mail para leads do funil de ebook.';
comment on column public.lead_email_events.event_type is 'Tipo de e-mail planejado/enviado, por exemplo ebook_delivery.';
comment on column public.lead_email_events.status is 'Status controlado do envio: sent, skipped, failed ou pending.';
