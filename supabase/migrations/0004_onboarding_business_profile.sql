alter table public.businesses
  add column if not exists business_type text,
  add column if not exists location text,
  add column if not exists main_channel text,
  add column if not exists response_goal text,
  add column if not exists common_questions text,
  add column if not exists important_info text,
  add column if not exists onboarding_completed boolean not null default false;

update public.businesses
set
  business_type = coalesce(nullif(business_type, ''), nullif(business_area, ''), 'Prestador de serviço'),
  main_channel = coalesce(nullif(main_channel, ''), 'WhatsApp'),
  response_goal = coalesce(nullif(response_goal, ''), 'Responder em até 15 minutos'),
  onboarding_completed = coalesce(onboarding_completed, false)
where
  business_type is null
  or main_channel is null
  or response_goal is null
  or onboarding_completed is null;

comment on column public.businesses.business_type is 'Tipo de atuação informado no onboarding do SaaS.';
comment on column public.businesses.location is 'Cidade/estado opcional informado no onboarding.';
comment on column public.businesses.main_channel is 'Canal principal de atendimento usado pela IA.';
comment on column public.businesses.response_goal is 'Tempo médio desejado para resposta.';
comment on column public.businesses.common_questions is 'Perguntas comuns dos clientes para contexto da IA.';
comment on column public.businesses.important_info is 'Informações importantes que a IA deve considerar.';
comment on column public.businesses.onboarding_completed is 'Indica se o perfil de atendimento inicial foi concluído.';
