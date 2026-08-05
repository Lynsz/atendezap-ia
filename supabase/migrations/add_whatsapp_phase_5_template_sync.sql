-- WhatsApp Phase 5: Meta template synchronization and local governance.
-- Raw Meta payloads, access tokens and real variable values are forbidden.

alter table public.whatsapp_templates
  add column if not exists meta_template_id text,
  add column if not exists meta_template_name text,
  add column if not exists remote_status text,
  add column if not exists local_status text not null default 'active',
  add column if not exists components jsonb not null default '[]'::jsonb,
  add column if not exists variables_schema jsonb not null default '[]'::jsonb,
  add column if not exists quality_score text,
  add column if not exists rejection_reason text,
  add column if not exists last_synced_at timestamptz,
  add column if not exists submitted_at timestamptz,
  add column if not exists approved_at timestamptz,
  add column if not exists rejected_at timestamptz,
  add column if not exists disabled_at timestamptz;

update public.whatsapp_templates
set
  meta_template_id = coalesce(meta_template_id, provider_template_id),
  meta_template_name = coalesce(meta_template_name, name),
  remote_status = coalesce(remote_status, status),
  local_status = coalesce(local_status, 'active')
where meta_template_id is null or meta_template_name is null or remote_status is null;

alter table public.whatsapp_templates
  drop constraint if exists whatsapp_templates_remote_status_check,
  drop constraint if exists whatsapp_templates_local_status_check,
  drop constraint if exists whatsapp_templates_components_object_check,
  drop constraint if exists whatsapp_templates_variables_schema_array_check;

alter table public.whatsapp_templates
  add constraint whatsapp_templates_remote_status_check
    check (remote_status is null or remote_status in ('pending', 'approved', 'rejected', 'paused', 'disabled', 'in_appeal', 'pending_deletion', 'deleted', 'flagged', 'reinstated', 'unknown')),
  add constraint whatsapp_templates_local_status_check
    check (local_status in ('draft', 'active', 'hidden', 'unsupported', 'disabled')),
  add constraint whatsapp_templates_components_object_check
    check (jsonb_typeof(components) = 'array'),
  add constraint whatsapp_templates_variables_schema_array_check
    check (jsonb_typeof(variables_schema) = 'array');

create unique index if not exists whatsapp_templates_user_meta_id_idx
  on public.whatsapp_templates(user_id, meta_template_id)
  where meta_template_id is not null;
create index if not exists whatsapp_templates_remote_local_idx
  on public.whatsapp_templates(user_id, remote_status, local_status, updated_at desc);
create index if not exists whatsapp_templates_last_synced_idx
  on public.whatsapp_templates(user_id, last_synced_at desc)
  where last_synced_at is not null;

create table if not exists public.whatsapp_template_status_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references public.whatsapp_templates(id) on delete cascade,
  previous_status text,
  new_status text not null,
  source text not null check (source in ('local', 'meta_sync', 'manual_admin', 'webhook', 'system')),
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists whatsapp_template_status_history_user_created_idx
  on public.whatsapp_template_status_history(user_id, created_at desc);
create index if not exists whatsapp_template_status_history_template_created_idx
  on public.whatsapp_template_status_history(template_id, created_at desc);

alter table public.whatsapp_template_status_history enable row level security;
revoke all on public.whatsapp_template_status_history from anon, authenticated;
grant select on public.whatsapp_template_status_history to authenticated;

drop policy if exists "whatsapp_template_status_history_select_own" on public.whatsapp_template_status_history;
create policy "whatsapp_template_status_history_select_own" on public.whatsapp_template_status_history
  for select to authenticated using ((select auth.uid()) = user_id);

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
    'whatsapp_media_sent', 'whatsapp_media_send_failed',
    'whatsapp_template_sync_started', 'whatsapp_template_sync_completed',
    'whatsapp_template_sync_failed', 'whatsapp_template_status_changed',
    'whatsapp_template_preview_generated', 'whatsapp_template_send_blocked_status',
    'whatsapp_template_variable_validation_failed', 'whatsapp_template_draft_created'
  ));

comment on table public.whatsapp_template_status_history is
  'Template status transitions only. Raw provider payloads and template or variable text are forbidden.';
comment on column public.whatsapp_templates.components is
  'Sanitized template structure only; provider examples and customer values are forbidden.';
comment on column public.whatsapp_templates.variables_schema is
  'Variable names, components, types and positions only; real customer values are forbidden.';
