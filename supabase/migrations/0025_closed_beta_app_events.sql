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
    'beta_support_request_created'
  ));

comment on constraint app_events_event_name_check on public.app_events is
  'Allowlist de eventos seguros do MVP e do beta fechado. Nao salvar perguntas, respostas, contatos, tokens, pagamentos ou secrets.';
