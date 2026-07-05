alter table public.ai_response_feedback
  add column if not exists feedback_reason text;

alter table public.ai_response_feedback
  drop constraint if exists ai_response_feedback_reason_check;

alter table public.ai_response_feedback
  add constraint ai_response_feedback_reason_check
  check (
    feedback_reason is null
    or feedback_reason in (
      'too_long',
      'too_generic',
      'wrong_tone',
      'invented_info',
      'did_not_answer',
      'other'
    )
  );

create index if not exists ai_response_feedback_reason_idx
  on public.ai_response_feedback(feedback_reason)
  where feedback_reason is not null;

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
    'ai_response_generated',
    'ai_response_feedback_submitted',
    'template_viewed',
    'template_copied',
    'template_saved',
    'saved_response_created',
    'saved_response_copied',
    'saved_response_edited',
    'saved_response_favorited',
    'saved_response_deleted',
    'activation_signup_completed',
    'activation_onboarding_started',
    'activation_onboarding_completed',
    'activation_dashboard_viewed',
    'activation_first_response_generated',
    'activation_first_response_copied',
    'activation_first_response_saved',
    'activation_templates_viewed',
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

comment on column public.ai_response_feedback.feedback_reason is
  'Motivo agregado opcional para feedback negativo. Nao salvar pergunta ou resposta completa.';

comment on constraint app_events_event_name_check on public.app_events is
  'Allowlist de eventos seguros do MVP, ativacao, Sprint 3, beta fechado, lancamento pequeno e operacao pos-MVP. Nao salvar perguntas, respostas, contatos, tokens, pagamentos ou secrets.';
