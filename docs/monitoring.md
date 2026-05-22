# Monitoramento pos-lancamento

Use este guia nos primeiros dias de producao controlada. A prioridade e encontrar falhas de compra, liberacao de plano, geracao de IA, envio de e-mail e tracking antes de escalar trafego.

## Onde acompanhar

- Vercel: use a aba de deployments e runtime logs para erros de build, erros 500, timeouts e falhas em rotas `app/api`.
- Supabase: use Logs, Auth Logs e Table Editor para conferir erros de banco, login, RLS, leads, usuarios e assinaturas.
- Stripe: use Developers > Events e Developers > Webhooks para verificar eventos recebidos, tentativas de entrega e respostas do webhook.
- Resend: use a tela de e-mails enviados para confirmar entrega, bounce, rejeicao ou erro de remetente.
- OpenAI: use usage/cost dashboards para acompanhar consumo, erros e picos inesperados.
- GA4: use Realtime e DebugView para validar eventos principais.
- Meta Pixel: use Events Manager/Test Events para validar carregamento do pixel e eventos.

## Como identificar falhas

### Falha de webhook Stripe

- O pagamento aparece como concluido no Stripe, mas a assinatura nao muda no Supabase.
- O evento aparece em Stripe > Webhooks com status diferente de `2xx`.
- Os logs da Vercel mostram erro na rota `/api/stripe/webhook`.
- A tabela `subscriptions` nao tem `stripe_subscription_id` ou `subscription_status` atualizado.

### Falha de pagamento

- O Stripe registra `invoice.payment_failed`.
- A assinatura fica pendente, incompleta ou sem pagamento confirmado.
- O usuario relata acesso bloqueado apos tentar pagar.
- O dashboard nao deve liberar plano ativo quando o pagamento falhou.

### Erro de geracao de IA

- A rota de geracao retorna erro controlado no client.
- Logs da Vercel indicam falha em OpenAI, limite mensal, assinatura inativa ou payload invalido.
- O historico nao recebe nova resposta apos tentativa valida.
- Custos ou uso da OpenAI sobem acima do esperado.

### Falha de envio do ebook

- Lead foi salvo, mas nao ha registro de envio bem-sucedido.
- Resend mostra erro de remetente, dominio, API key ou entrega.
- O usuario nao recebeu o e-mail e confirmou spam/lixo eletronico.
- O admin mostra status de e-mail `failed` ou `skipped`.

## Alertas manuais importantes

Verificar diariamente nos primeiros dias:

- Novos leads.
- Erros no formulario do ebook.
- Falhas de e-mail.
- Usuarios cadastrados.
- Assinaturas criadas.
- Pagamentos falhos.
- Erros de webhook.
- Uso da OpenAI.
- Custos.
- Reclamacoes ou duvidas.
- Novos feedbacks em `/admin`, principalmente tipo `bug` ou `dificuldade_uso`.

## Feedback dos primeiros usuarios

- Verificar a secao "Feedbacks recentes" no admin diariamente durante a producao controlada.
- Marcar feedback como `reviewing` quando entrar em analise.
- Classificar impacto usando `docs/bug-triage.md`.
- Marcar como `resolved` apenas depois de validar a correcao no ambiente real.
- Pausar novos convites se aparecer P0 ou P1 recorrente.
