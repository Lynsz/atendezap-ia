# Checklist de lancamento controlado

Use este checklist para liberar o AtendeZap IA para poucos usuarios antes de anuncios pagos.

## Antes de liberar

- [ ] Deploy na Vercel concluido.
- [ ] Dominio ou URL staging configurado em `NEXT_PUBLIC_APP_URL`.
- [ ] Supabase configurado com migrations aplicadas.
- [ ] RLS revisado e testado com dois usuarios.
- [ ] Stripe testado em modo test.
- [ ] Webhook Stripe assinado testado.
- [ ] Portal Stripe testado.
- [ ] Resend testado ou status `skipped` documentado.
- [ ] OpenAI testado com limite de custo.
- [ ] Admin testado com usuario admin e comum.
- [ ] Tracking testado com UTMs.
- [ ] Mobile testado nas rotas principais.
- [ ] `docs/post-deploy-checklist.md` concluido.

## Teste com primeiros usuarios

- [ ] Criar 3 a 5 contas de teste.
- [ ] Testar configuracao inicial do atendimento.
- [ ] Testar geracao de respostas com perguntas reais.
- [ ] Testar historico e uso mensal.
- [ ] Testar assinatura em modo test.
- [ ] Testar fluxo de cancelamento.
- [ ] Coletar bugs de UX, copy e pagamento.
- [ ] Ajustar copy se necessario, sem criar nova feature.
- [ ] Confirmar que suporte consegue responder duvidas basicas.

## Antes de anuncios pagos

- [ ] Checkout real validado no ambiente correto.
- [ ] Webhook live validado com evento real.
- [ ] Pixel validado no Meta Events Manager.
- [ ] GA4 validado no DebugView/Realtime.
- [ ] E-mail do ebook validado com remetente real.
- [ ] Pagina de ebook validada em desktop e mobile.
- [ ] Oferta do Pro validada: R$ 29 no primeiro mes para novos usuarios, depois R$ 97/mes.
- [ ] Suporte minimo pronto com e-mail monitorado.
- [ ] Plano de rollback definido na Vercel.
- [ ] Logs/Sentry revisados depois dos primeiros acessos.
