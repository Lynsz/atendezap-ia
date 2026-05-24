# Monitoramento do Dia de Lançamento

Use este checklist no dia em que os primeiros usuários forem convidados.

## Antes de convidar usuários

- [ ] Abrir home.
- [ ] Abrir `/api/health`.
- [ ] Testar login.
- [ ] Testar geração.
- [ ] Testar assinatura.
- [ ] Abrir admin.
- [ ] Abrir logs da Vercel.
- [ ] Abrir Supabase.
- [ ] Abrir Stripe.
- [ ] Abrir Resend.
- [ ] Abrir OpenAI usage.
- [ ] Abrir GA4/Meta Pixel, se configurados.
- [ ] Confirmar canal de suporte e feedback.
- [ ] Confirmar rollback pronto.

## Durante o teste

- [ ] Monitorar erros Vercel.
- [ ] Monitorar Supabase.
- [ ] Monitorar Stripe.
- [ ] Monitorar Resend.
- [ ] Monitorar OpenAI.
- [ ] Monitorar feedbacks.
- [ ] Monitorar leads.
- [ ] Monitorar cadastros.
- [ ] Monitorar uso de IA.
- [ ] Monitorar assinaturas.
- [ ] Registrar bugs em `docs/launch-bugs.md`.

## Depois do teste

- [ ] Revisar bugs.
- [ ] Priorizar P0/P1.
- [ ] Atualizar `docs/controlled-go-live-report.md`.
- [ ] Atualizar decisão de continuar, pausar ou corrigir.
- [ ] Revisar feedbacks de usuários.
- [ ] Revisar logs de provedores.
- [ ] Decidir se convida mais usuários.
- [ ] Decidir se anúncios pequenos ainda ficam bloqueados ou podem ser preparados.
