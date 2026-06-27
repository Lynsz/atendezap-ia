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

- [ ] Onboarding revisado com base em gargalo medido.
- [ ] Primeira resposta revisada com base em feedback agregado.
- [ ] Copia/salvamento medidos.
- [ ] Templates revisados apenas se houver uso real suficiente.
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

## Saida

- [ ] Sem P0.
- [ ] Sem P1 grave.
- [ ] Documentacao atualizada.
- [ ] CHANGELOG atualizado.
- [ ] Relatorio final da 1.1 preenchido com dados reais ou marcacoes explicitas de ausencia.

