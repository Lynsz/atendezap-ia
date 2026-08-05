-- WhatsApp Phase 4: private media metadata and storage.
-- Raw webhook payloads, temporary provider URLs and file bytes must never be
-- stored in application tables, analytics or audit records.

alter table public.whatsapp_messages
  drop constraint if exists whatsapp_messages_status_check;

alter table public.whatsapp_messages
  add constraint whatsapp_messages_status_check
  check (status in ('received', 'unsupported', 'pending', 'sent', 'delivered', 'read', 'failed'));

alter table public.whatsapp_messages
  drop constraint if exists whatsapp_messages_message_type_check;

alter table public.whatsapp_messages
  add constraint whatsapp_messages_message_type_check
  check (message_type in ('text', 'image', 'document', 'audio', 'video', 'sticker', 'template', 'unsupported'));

create table if not exists public.whatsapp_media (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  message_id uuid references public.whatsapp_messages(id) on delete set null,
  contact_id uuid not null references public.whatsapp_contacts(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  whatsapp_media_id text,
  media_type text not null check (media_type in ('image', 'document', 'audio', 'video', 'sticker')),
  mime_type text,
  sha256 text,
  file_size bigint check (file_size is null or file_size >= 0),
  original_filename text,
  storage_bucket text,
  storage_path text,
  download_status text not null default 'pending'
    check (download_status in ('pending', 'downloading', 'downloaded', 'failed', 'skipped_unsupported', 'blocked_size', 'blocked_type', 'removed')),
  download_error_type text,
  scanned_status text not null default 'not_scanned'
    check (scanned_status in ('not_scanned', 'safe', 'suspicious', 'blocked', 'unavailable')),
  removed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, whatsapp_media_id)
);

alter table public.whatsapp_send_attempts
  drop constraint if exists whatsapp_send_attempts_message_type_check;

alter table public.whatsapp_send_attempts
  add constraint whatsapp_send_attempts_message_type_check
  check (message_type in ('text', 'template', 'media'));

alter table public.whatsapp_send_attempts
  add column if not exists media_id uuid references public.whatsapp_media(id) on delete set null;

alter table public.whatsapp_audit_log
  add column if not exists media_id uuid references public.whatsapp_media(id) on delete set null;

alter table public.app_events
  drop constraint if exists app_events_event_name_check;

alter table public.app_events
  add constraint app_events_event_name_check
  check (event_name in (
    'signup_completed', 'onboarding_completed', 'dashboard_viewed',
    'first_response_generated', 'response_copied', 'response_saved',
    'template_copied', 'template_saved', 'library_viewed', 'pricing_viewed',
    'checkout_started', 'checkout_completed', 'checkout_cancelled',
    'billing_portal_opened', 'usage_limit_reached', 'support_request_created',
    'ai_feedback_submitted', 'ai_response_generated', 'ai_response_feedback_submitted',
    'admin_dashboard_viewed', 'openai_usage_warning', 'stripe_webhook_received',
    'template_viewed', 'saved_response_created', 'saved_response_copied',
    'saved_response_duplicate', 'saved_response_edited', 'saved_response_favorited',
    'saved_response_unfavorite', 'saved_response_filter',
    'saved_response_filter_favorites', 'saved_response_search',
    'saved_response_sort_change', 'saved_response_deleted',
    'activation_signup_completed', 'activation_onboarding_started',
    'activation_onboarding_completed', 'activation_dashboard_viewed',
    'activation_first_response_generated', 'activation_first_response_copied',
    'activation_first_response_saved', 'activation_templates_viewed',
    'activation_favorite_created', 'beta_signup_completed',
    'beta_onboarding_completed', 'beta_first_response_generated',
    'beta_response_copied', 'beta_response_saved', 'beta_template_used',
    'beta_pricing_viewed', 'beta_feedback_submitted',
    'beta_support_request_created', 'small_launch_signup_completed',
    'small_launch_onboarding_completed', 'small_launch_first_response_generated',
    'small_launch_response_copied', 'small_launch_response_saved',
    'small_launch_template_used', 'small_launch_pricing_viewed',
    'small_launch_checkout_started', 'small_launch_feedback_submitted',
    'small_launch_support_request_created', 'small_launch_usage_limit_reached',
    'post_mvp_signup_completed', 'post_mvp_onboarding_completed',
    'post_mvp_first_response_generated', 'post_mvp_response_copied',
    'post_mvp_response_saved', 'post_mvp_template_used',
    'post_mvp_pricing_viewed', 'post_mvp_checkout_started',
    'post_mvp_feedback_submitted', 'post_mvp_support_request_created',
    'post_mvp_usage_limit_reached', 'post_mvp_error_occurred',
    'campaign_landing_viewed', 'campaign_signup_clicked',
    'campaign_signup_completed', 'campaign_onboarding_completed',
    'campaign_first_response_generated', 'campaign_response_copied',
    'campaign_response_saved', 'campaign_pricing_viewed',
    'campaign_checkout_started', 'campaign_feedback_submitted',
    'campaign_support_request_created', 'whatsapp_webhook_verified',
    'whatsapp_inbound_received', 'whatsapp_conversation_viewed',
    'whatsapp_suggested_reply_generated', 'whatsapp_reply_sent',
    'whatsapp_reply_blocked_window_closed', 'whatsapp_integration_error',
    'whatsapp_webhook_duplicate_ignored', 'whatsapp_send_duplicate_blocked',
    'whatsapp_rate_limit_blocked', 'whatsapp_retry_scheduled',
    'whatsapp_retry_exhausted', 'whatsapp_send_failed_permanent',
    'whatsapp_template_sent', 'whatsapp_template_not_approved',
    'whatsapp_message_status_failed', 'whatsapp_media_inbound_received',
    'whatsapp_media_downloaded', 'whatsapp_media_blocked_type',
    'whatsapp_media_blocked_size', 'whatsapp_media_preview_opened',
    'whatsapp_media_upload_created', 'whatsapp_media_send_attempted',
    'whatsapp_media_sent', 'whatsapp_media_send_failed'
  ));

create index if not exists whatsapp_media_user_created_idx on public.whatsapp_media(user_id, created_at desc);
create index if not exists whatsapp_media_conversation_idx on public.whatsapp_media(conversation_id, created_at);
create index if not exists whatsapp_media_message_idx on public.whatsapp_media(message_id) where message_id is not null;
create index if not exists whatsapp_media_provider_id_idx on public.whatsapp_media(whatsapp_media_id) where whatsapp_media_id is not null;
create index if not exists whatsapp_media_pending_idx on public.whatsapp_media(download_status, created_at) where download_status = 'pending';
create index if not exists whatsapp_media_retention_idx on public.whatsapp_media(created_at) where storage_path is not null and removed_at is null;

alter table public.whatsapp_media enable row level security;
revoke all on public.whatsapp_media from anon, authenticated;
grant select on public.whatsapp_media to authenticated;

drop policy if exists "whatsapp_media_select_own" on public.whatsapp_media;
create policy "whatsapp_media_select_own" on public.whatsapp_media
  for select to authenticated using ((select auth.uid()) = user_id);

-- The application uses the service role for all object operations. The bucket
-- remains private and no direct browser policy is granted.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'whatsapp-media',
  'whatsapp-media',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.whatsapp_media is
  'Private media metadata only. Provider URLs, raw payloads and file bytes are forbidden.';
