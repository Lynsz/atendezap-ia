# Checklist de Validação com Primeiros Usuários

Use uma cópia deste checklist para cada pessoa convidada.

## Usuário

- Nome:
- Perfil:
- Data:
- Observador:

## Antes do teste

- [ ] Confirmar que o usuário recebeu o link.
- [ ] Confirmar que o produto está online.
- [ ] Confirmar que `/api/health` responde.
- [ ] Confirmar que admin está acessível para o responsável.
- [ ] Confirmar que logs da Vercel estão sendo monitorados.
- [ ] Confirmar Supabase aberto para checar cadastro/uso.
- [ ] Confirmar Stripe aberto, se houver teste de assinatura.
- [ ] Confirmar Resend aberto, se houver teste do ebook.

## Durante o teste

- [ ] Usuário entende a landing?
- [ ] Usuário entende o que o produto faz?
- [ ] Usuário entende que a IA gera respostas para copiar, ajustar e enviar manualmente?
- [ ] Usuário consegue baixar o ebook?
- [ ] Usuário consegue criar conta?
- [ ] Usuário consegue fazer login?
- [ ] Usuário consegue concluir onboarding?
- [ ] Usuário consegue gerar resposta?
- [ ] Usuário entende onde está o histórico?
- [ ] Usuário entende os planos?
- [ ] Usuário entende o limite mensal?
- [ ] Usuário entende o Pro com primeiro mês por R$ 29 para novos usuários?
- [ ] Usuário encontra algum erro?
- [ ] Usuário sabe como enviar feedback?

## Depois do teste

- [ ] Coletar feedback.
- [ ] Verificar logs da Vercel.
- [ ] Verificar lead/cadastro no admin.
- [ ] Verificar uso no dashboard/admin.
- [ ] Verificar feedback salvo.
- [ ] Verificar e-mail do ebook, se aplicável.
- [ ] Verificar assinatura/webhook, se aplicável.
- [ ] Classificar problemas encontrados em P0/P1/P2/P3.
- [ ] Atualizar `docs/controlled-go-live-report.md`.
- [ ] Decidir continuar, corrigir ou pausar.
