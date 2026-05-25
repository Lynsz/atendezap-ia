# FAQ Interna - AtendeZap IA

## Como saber se o Stripe esta funcionando?

- Conferir se o checkout abre a partir de `/precos`, `/plans`, `/dashboard` ou `/assinatura`.
- Conferir Stripe Developers > Events.
- Conferir Stripe Developers > Webhooks.
- Conferir se `subscriptions` no Supabase recebeu ou atualizou a assinatura.
- Conferir se `/assinatura` e dashboard mostram plano/status corretos.

## Como saber se o webhook falhou?

- No Stripe, verificar se o evento do webhook teve resposta diferente de `2xx`.
- Na Vercel, verificar logs da rota `/api/stripe/webhook`.
- No Supabase, verificar se a assinatura ficou sem `stripe_subscription_id`, status ou periodo atualizado.
- Se o pagamento existe no Stripe e o plano nao liberou, tratar como P0/P1 conforme impacto.

## Como liberar manualmente uma assinatura, se necessario?

- Confirmar o pagamento no Stripe antes de qualquer ajuste.
- Identificar o usuario correto no Supabase.
- Confirmar `user_id`, `stripe_customer_id`, `stripe_subscription_id`, plano e status.
- Ajustar apenas o registro correto em `subscriptions`.
- Registrar a acao em `docs/incident-log.md`.
- Validar dashboard e `/assinatura` com o usuario afetado.

## Como verificar se um usuario atingiu limite?

- Conferir o dashboard do usuario, se disponivel.
- No Supabase, contar `generated_responses` do usuario no ciclo mensal atual.
- Comparar com o limite do plano em `src/config/plans.ts` e `src/lib/plan-limits.ts`.
- Se houver divergencia, registrar como incidente ou bug de metrica.

## Como verificar se o lead recebeu o ebook?

- Conferir se o lead existe em `ebook_leads`.
- Conferir `lead_email_events`.
- Conferir Resend para entrega, falha, bounce ou remetente invalido.
- Se necessario, reenviar manualmente sem expor dados sensiveis.

## Como ver erros da IA?

- Conferir logs da Vercel nas rotas de geracao.
- Conferir uso/custo no painel da OpenAI.
- Conferir se `OPENAI_API_KEY` esta configurada no ambiente correto.
- Conferir se o usuario nao atingiu limite mensal ou esta sem assinatura ativa.

## Como pausar anuncios?

- Pausar a campanha na plataforma de midia usada.
- Registrar motivo e horario.
- Conferir se ha P0/P1 em login, checkout, webhook, IA, lead, tracking ou pagina principal.
- Retomar apenas depois de validacao no ambiente real.

## Como fazer rollback?

- Seguir `docs/rollback-plan.md`.
- Na Vercel, voltar para o deployment anterior quando o deploy atual quebrar producao.
- Rodar validacoes locais antes de novo deploy.
- Registrar incidente e prevencao futura.

## Como identificar usuario com problema?

- Pedir e-mail da conta, sem solicitar senha, token ou dados sensiveis.
- Conferir Supabase Auth, `profiles`, `businesses`, `generated_responses` e `subscriptions`.
- Conferir logs da Vercel pelo horario aproximado.
- Conferir Stripe se o problema envolver pagamento.

## Como verificar se admin esta funcionando?

- Entrar com e-mail listado em `ADMIN_EMAILS`.
- Confirmar que usuario comum nao acessa `/admin` nem APIs admin.
- Conferir cards de leads, usuarios, assinaturas, feedbacks, metricas e relatorio de campanha.
- Testar filtros de UTM e exportacao CSV quando houver dados.
