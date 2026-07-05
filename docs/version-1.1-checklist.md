# Checklist da Versao 1.1 - AtendeZap IA

## Entrada

- [ ] `docs/post-mvp-operation-analysis.md` revisado.
- [ ] Backlog pos-MVP classificado em P0, P1, P2, Futuro e Nao fazer agora.
- [ ] Nenhum P0 aberto.
- [ ] Pendencias P1 conhecidas e com dono operacional.
- [ ] Dados reais ausentes marcados como `nao disponivel` ou `nao medido`.

## Ambiente real

- [ ] Smoke autenticado em Preview/Producao executado.
- [ ] Supabase RLS validado com dois usuarios reais.
- [ ] Stripe Checkout validado.
- [ ] Stripe Customer Portal validado.
- [ ] Stripe webhook assinado validado.
- [ ] OpenAI validada em rota backend.
- [ ] Resend validado com envio real controlado.
- [ ] GitHub Actions confirmado verde.

## Produto

- [x] Onboarding revisado na Sprint 2 com base no risco documental do funil ainda nao medido.
- [x] Primeira resposta revisada para orientar revisar, copiar e enviar manualmente.
- [x] Copia/salvamento com feedback visual e eventos seguros.
- [x] Templates/exemplos por nicho revisados sem gerar automaticamente.
- [x] Prompt da IA revisado na Sprint 3 para respostas curtas e sem informacoes inventadas.
- [x] Orientacao por nicho adicionada na Sprint 3.
- [x] Feedback de qualidade da IA com motivo categorizado adicionado.
- [ ] Pricing revisado sem prometer automacao do WhatsApp.
- [ ] Suporte/FAQ revisado com base em categorias reais.

## Seguranca

- [ ] Nenhum secret no client.
- [ ] `OPENAI_API_KEY` usada apenas no backend.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` usada apenas no backend.
- [ ] Eventos sem pergunta completa, resposta completa, e-mail, telefone, token, secret ou dado de pagamento.
- [ ] Token/acesso autenticado validado antes de gerar conteudo.

## Validacao

- [ ] `npm run check:secrets`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm test`
- [ ] `npm run validate`

## Sprint 2

- [x] Plano da Sprint 2 criado.
- [x] Smoke test da Sprint 2 criado.
- [x] Relatorio da Sprint 2 criado.
- [x] Tracking seguro de ativacao adicionado.
- [x] Admin existente validado/ajustado para agregados de ativacao.
- [ ] Smoke real em Preview/Producao movido para Sprint 3.
- [ ] Metricas reais de ativacao seguem `nao medido` ate operacao real.

## Sprint 3

- [x] Plano da Sprint 3 criado.
- [x] Smoke test da Sprint 3 criado.
- [x] Relatorio da Sprint 3 criado.
- [x] Prompt server-side revisado.
- [x] Orientacoes por nicho implementadas.
- [x] Templates revisados contra promessas automaticas obvias.
- [x] Templates recomendados podem ser usados como base editavel.
- [x] Resposta gerada pode ser ajustada antes de copiar ou salvar.
- [x] Feedback negativo por motivo categorizado.
- [x] Tracking seguro da Sprint 3 adicionado.
- [x] Admin mostra motivos negativos agregados.
- [ ] Smoke real em Preview/Producao movido para Sprint 4.
- [ ] RLS real com dois usuarios movido para Sprint 4.
- [ ] Metricas reais de qualidade seguem `nao medido` ate operacao real.

## Saida

- [ ] Sem P0.
- [ ] Sem P1 grave.
- [ ] Documentacao atualizada.
- [ ] CHANGELOG atualizado.
- [ ] Relatorio final da 1.1 preenchido com dados reais ou marcacoes explicitas de ausencia.
