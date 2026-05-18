alter table public.ebook_leads
  add column if not exists business_type text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text;

alter table public.ebook_leads
  alter column whatsapp drop not null;

create index if not exists ebook_leads_created_at_idx on public.ebook_leads(created_at desc);
create index if not exists ebook_leads_utm_campaign_idx on public.ebook_leads(utm_campaign) where utm_campaign is not null;

comment on column public.ebook_leads.business_type is 'Tipo de atuação informado no formulário do ebook.';
comment on column public.ebook_leads.source is 'Origem interna do lead, por exemplo ebook_page.';
comment on column public.ebook_leads.utm_source is 'utm_source capturado da URL da página do ebook.';
comment on column public.ebook_leads.utm_medium is 'utm_medium capturado da URL da página do ebook.';
comment on column public.ebook_leads.utm_campaign is 'utm_campaign capturado da URL da página do ebook.';
comment on column public.ebook_leads.utm_content is 'utm_content capturado da URL da página do ebook.';
comment on column public.ebook_leads.utm_term is 'utm_term capturado da URL da página do ebook.';
