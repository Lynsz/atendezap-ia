# Checklist do funil de e-mail

Use este checklist em local, staging e producao controlada.

## Ebook

- [ ] Pagina `/ebook` carrega em desktop.
- [ ] Pagina `/ebook` carrega em mobile.
- [ ] Formulario valida nome obrigatorio.
- [ ] Formulario valida e-mail obrigatorio.
- [ ] Formulario rejeita e-mail invalido.
- [ ] WhatsApp opcional aceita formato valido.
- [ ] Tipo de atuacao e salvo.
- [ ] UTMs sao capturadas.

## Supabase

- [ ] Lead e salvo em `ebook_leads`.
- [ ] Lead duplicado por e-mail atualiza sem erro ruim.
- [ ] `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term` sao preservadas.
- [ ] `lead_email_events` registra `sent` quando o envio funciona.
- [ ] `lead_email_events` registra `failed` quando o Resend falha.
- [ ] `lead_email_events` registra `skipped_not_configured` quando Resend ou remetente nao estao configurados.
- [ ] RLS impede usuario comum de listar leads pelo client.

## Resend

- [ ] `RESEND_API_KEY` configurada apenas no servidor.
- [ ] `EMAIL_FROM` usa remetente verificado.
- [ ] `NEXT_PUBLIC_APP_URL` aponta para o ambiente correto.
- [ ] E-mail recebido contem link para `/ebook/guia`.
- [ ] E-mail recebido contem CTA para `/demo`.
- [ ] E-mail recebido contem aviso de que o guia foi solicitado.

## Paginas

- [ ] `/ebook/obrigado` confirma cadastro.
- [ ] `/ebook/obrigado` mostra acesso imediato ao guia.
- [ ] `/ebook/obrigado` mostra CTA para demo.
- [ ] `/ebook/obrigado` mostra CTA para criar conta ou ver planos.
- [ ] `/ebook/obrigado` cita Pro com primeiro mes por R$ 29 para novos usuarios.
- [ ] `/ebook/guia` abre sem login.
- [ ] `/ebook/guia` tem conteudo util.
- [ ] `/ebook/guia` tem CTA para demo.
- [ ] `/ebook/guia` tem CTA para cadastro.
- [ ] `/ebook/guia` tem CTA para planos.
- [ ] `/ebook/guia` tem links de termos e privacidade.

## Admin

- [ ] Usuario comum nao acessa admin.
- [ ] Admin visualiza leads.
- [ ] Admin visualiza status do envio do ebook.
- [ ] Admin visualiza data do envio ou do evento.
- [ ] Admin visualiza erro resumido quando houver falha.
- [ ] Admin visualiza enviados, falhas e Resend nao configurado.

## Falhas

- [ ] Sem Resend configurado, lead e salvo e usuario vai para obrigado.
- [ ] Com falha do Resend, lead e salvo e usuario vai para obrigado.
- [ ] Com falha do Supabase ao salvar lead, API retorna erro amigavel.
- [ ] Nenhuma falha retorna stack trace para o client.
