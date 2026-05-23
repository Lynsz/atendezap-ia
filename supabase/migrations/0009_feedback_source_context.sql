alter table public.user_feedback add column if not exists source text;
alter table public.user_feedback add column if not exists context text;
alter table public.user_feedback add column if not exists campaign text;
alter table public.user_feedback add column if not exists user_agent text;

create index if not exists user_feedback_context_idx on public.user_feedback(context);
create index if not exists user_feedback_source_idx on public.user_feedback(source);

comment on column public.user_feedback.source is 'Origem tecnica do feedback, como feedback_page ou dashboard.';
comment on column public.user_feedback.context is 'Area onde o usuario informou dificuldade: cadastro_login, onboarding, gerar_resposta, assinatura_pagamento, demo, ebook, dashboard ou outro.';
comment on column public.user_feedback.campaign is 'Campanha/UTM opcional associada ao feedback, quando disponivel.';
comment on column public.user_feedback.user_agent is 'User agent opcional para diagnostico tecnico, sem expor no cliente.';
