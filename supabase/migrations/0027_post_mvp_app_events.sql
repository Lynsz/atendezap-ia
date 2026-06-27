alter table public.app_events
  drop constraint if exists app_events_event_name_check;

alter table public.app_events
  add constraint app_events_event_name_check
  check (event_name in (
    'signup_completed',
    'onboarding_completed',
    'dashboard_viewed',
    'first_response_generated',
    'response_copied',
    'response_saved',
    'template_copied',
    'template_saved',
    'library_viewed',
    'pricing_viewed',
    'checkout_started',
    'usage_limit_reached',
    'support_request_created',
    'ai_feedback_submitted',
    'beta_signup_completed',
    'beta_onboarding_completed',
    'beta_first_response_generated',
    'beta_response_copied',
    'beta_response_saved',
    'beta_template_used',
    'beta_pricing_viewed',
    'beta_feedback_submitted',
    'beta_support_request_created',
    'small_launch_signup_completed',
    'small_launch_onboarding_completed',
    'small_launch_first_response_generated',
    'small_launch_response_copied',
    'small_launch_response_saved',
    'small_launch_template_used',
    'small_launch_pricing_viewed',
    'small_launch_checkout_started',
    'small_launch_feedback_submitted',
    'small_launch_support_request_created',
    'small_launch_usage_limit_reached',
    'post_mvp_signup_completed',
    'post_mvp_onboarding_completed',
    'post_mvp_first_response_generated',
    'post_mvp_response_copied',
    'post_mvp_response_saved',
    'post_mvp_template_used',
    'post_mvp_pricing_viewed',
    'post_mvp_checkout_started',
    'post_mvp_feedback_submitted',
    'post_mvp_support_request_created',
    'post_mvp_usage_limit_reached',
    'post_mvp_error_occurred'
  ));

comment on constraint app_events_event_name_check on public.app_events is
  'Allowlist de eventos seguros do MVP, beta fechado, lancamento pequeno e operacao pos-MVP. Nao salvar perguntas, respostas, contatos, tokens, pagamentos ou secrets.';
