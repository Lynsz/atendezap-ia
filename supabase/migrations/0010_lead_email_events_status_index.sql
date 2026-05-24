create index if not exists lead_email_events_status_idx on public.lead_email_events(status);

comment on column public.lead_email_events.status is 'Status controlado do envio: sent, failed, skipped_not_configured ou pending.';
