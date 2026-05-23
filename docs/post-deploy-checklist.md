# Checklist pos-deploy staging

Use este checklist depois de cada deploy Preview/Staging na Vercel. Marque manualmente no ambiente real, com usuarios e dados descartaveis.

## Publico

- [ ] Abrir `/` e confirmar home sem erro.
- [ ] Abrir `/ebook`.
- [ ] Acessar `/ebook` com UTMs: `?utm_source=meta&utm_medium=cpc&utm_campaign=staging`.
- [ ] Enviar lead de teste.
- [ ] Confirmar redirecionamento para `/ebook/obrigado`.
- [ ] Abrir `/ebook/guia`.
- [ ] Abrir `/demo`.
- [ ] Gerar resposta na demo com e sem `OPENAI_API_KEY`.
- [ ] Abrir `/termos`.
- [ ] Abrir `/privacidade`.

## Autenticacao

- [ ] Criar conta em `/cadastro` com e-mail descartavel.
- [ ] Confirmar usuario no Supabase Auth.
- [ ] Fazer login em `/login`.
- [ ] Fazer logout.
- [ ] Tentar acessar `/dashboard` sem login e confirmar bloqueio/redirecionamento.
- [ ] Tentar acessar `/assinatura` sem login e confirmar bloqueio/redirecionamento.

## Dashboard

- [ ] Concluir onboarding/configuracao do negocio.
- [ ] Editar configuracao.
- [ ] Gerar resposta com pergunta real de cliente.
- [ ] Confirmar resposta no historico.
- [ ] Confirmar uso mensal atualizado.
- [ ] Confirmar limite mensal conforme plano atual.

## Stripe

- [ ] Abrir `/assinatura`.
- [ ] Iniciar checkout Starter.
- [ ] Iniciar checkout Pro.
- [ ] Iniciar checkout Premium.
- [ ] Confirmar Pro com primeiro mes por R$ 29 para novo usuario.
- [ ] Concluir pagamento teste com cartao de teste Stripe.
- [ ] Confirmar retorno para `/assinatura?checkout=success`.
- [ ] Confirmar webhook recebido no Stripe Dashboard.
- [ ] Confirmar evento registrado em `stripe_webhook_events`.
- [ ] Confirmar assinatura no Supabase em `subscriptions`.
- [ ] Confirmar dashboard refletindo plano ativo.
- [ ] Abrir portal do cliente.
- [ ] Cancelar assinatura teste no portal.
- [ ] Confirmar `customer.subscription.updated` ou `customer.subscription.deleted`.
- [ ] Confirmar status cancelado/past_due conforme o evento.

## Admin

- [ ] Configurar `ADMIN_EMAILS` com e-mail admin de staging.
- [ ] Acessar `/admin` como admin.
- [ ] Confirmar metricas.
- [ ] Confirmar leads.
- [ ] Exportar CSV, se o botao estiver disponivel no painel.
- [ ] Confirmar assinaturas.
- [ ] Acessar `/admin` como usuario comum e confirmar bloqueio.
- [ ] Chamar `/api/admin/overview` sem token e confirmar `401`.
- [ ] Chamar `/api/admin/overview` com usuario comum e confirmar `403`.

## Tracking

- [ ] Acessar `/ebook` com UTMs.
- [ ] Confirmar UTMs em `localStorage.atendezap_ia_utm_attribution_v1`.
- [ ] Confirmar UTMs salvas no lead.
- [ ] Confirmar UTMs enviadas no checkout Stripe metadata.
- [ ] Confirmar eventos GA4 no DebugView.
- [ ] Confirmar eventos Meta Pixel no Events Manager.
- [ ] Confirmar que payloads nao incluem senha, token, cartao, pergunta privada ou resposta gerada.

## Mobile

- [ ] Testar home.
- [ ] Testar ebook.
- [ ] Testar demo.
- [ ] Testar dashboard.
- [ ] Testar assinatura.
- [ ] Testar admin.
- [ ] Confirmar sem overflow horizontal.
- [ ] Confirmar CTAs visiveis e clicaveis.

## Criterio de aceite

- [ ] Nenhum erro 500 nas rotas principais.
- [ ] Nenhum segredo aparece no HTML, bundle client, logs ou metadata publica.
- [ ] Fluxo publico, autenticado, pagamento, admin e tracking testados.
- [ ] Pendencias externas registradas antes de promover para producao.
