# Checklist pos-deploy

Use este checklist depois do primeiro deploy de producao ou preview validado.

| Item | Rota/area | Como testar | Resultado esperado | Status |
| --- | --- | --- | --- | --- |
| Health check | `/api/health` | Abrir a URL. | Retorna `status: ok`, ambiente e timestamp, sem segredos. | Pendente |
| Home | `/` | Abrir a home. | Pagina carrega sem erro. | Pendente |
| Ebook | `/ebook` | Abrir a pagina de captura. | Formulario e CTAs aparecem. | Pendente |
| Enviar lead | `/ebook` | Enviar nome, e-mail, WhatsApp e tipo de negocio. | Lead salvo e redirecionado para obrigado. | Pendente |
| Lead no Supabase | Supabase | Conferir `ebook_leads`. | Lead aparece com UTMs quando informadas. | Pendente |
| E-mail do ebook | Resend/e-mail | Conferir caixa de entrada e `lead_email_events`. | E-mail enviado ou status controlado registrado. | Pendente |
| Guia gratuito | `/ebook/guia` | Abrir pelo link do obrigado/e-mail. | Guia acessivel. | Pendente |
| Cadastro | `/cadastro` | Criar usuario novo. | Usuario criado no Supabase Auth. | Pendente |
| Login | `/login` | Entrar com usuario criado. | Redireciona para dashboard. | Pendente |
| Onboarding | `/onboarding` ou dashboard | Preencher dados do negocio. | Dados salvos e fluxo concluido. | Pendente |
| Gerar resposta | `/dashboard` | Enviar pergunta de cliente. | Resposta gerada e salva. | Pendente |
| Uso mensal | `/dashboard` | Ver painel de uso. | Uso e limite mensal aparecem corretos. | Pendente |
| Planos | `/precos` | Abrir planos. | Starter, Pro e Premium aparecem. | Pendente |
| Checkout | `/precos` | Iniciar plano em modo test. | Abre Stripe Checkout. | Pendente |
| Pagamento | Stripe test | Simular pagamento aprovado. | Checkout finaliza e volta para `/dashboard?checkout=success`. | Pendente |
| Webhook Stripe | Stripe/Supabase | Conferir webhook e tabela de assinaturas. | Evento processado e plano ativo. | Pendente |
| Portal Stripe | Dashboard/assinatura | Abrir gerenciamento de assinatura. | Portal abre e retorna para `/dashboard`. | Pendente |
| Admin | `/admin` | Acessar com e-mail autorizado. | Admin carrega leads, assinaturas e metricas. | Pendente |
| Admin bloqueado | `/admin` | Acessar com e-mail nao autorizado. | Acesso negado de forma clara. | Pendente |
| Exportar CSV | `/admin` | Usar exportacao. | CSV baixa com dados esperados. | Pendente |
| Mobile | Rotas principais | Testar largura mobile. | Sem overflow ou CTA cortado. | Pendente |
| Termos | `/termos` | Abrir pagina. | Conteudo legal carrega. | Pendente |
| Privacidade | `/privacidade` | Abrir pagina. | Conteudo legal carrega. | Pendente |
| GA4 | DebugView | Navegar por ebook, lead e checkout. | Eventos aparecem no GA4. | Pendente |
| Meta Pixel | Meta Events Manager | Navegar por ebook, lead e checkout. | Eventos aparecem no Pixel. | Pendente |
