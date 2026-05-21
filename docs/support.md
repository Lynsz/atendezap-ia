# Suporte minimo

Este guia cobre os casos mais comuns no lancamento controlado. Nunca envie chaves, tokens ou payloads sensiveis para usuarios.

## Cliente nao conseguiu criar conta

- Confirmar se o e-mail foi digitado corretamente.
- Pedir para tentar login com o mesmo e-mail.
- Conferir Supabase Auth para ver se o usuario foi criado.
- Conferir logs da Vercel e Supabase Auth.
- Se confirmacao de e-mail estiver ativa, pedir para verificar caixa de entrada e spam.

## Cliente pagou, mas plano nao liberou

- Verificar o pagamento no Stripe.
- Verificar se o evento chegou ao webhook.
- Verificar a tabela `subscriptions`.
- Verificar `stripe_customer_id`.
- Verificar `stripe_subscription_id`.
- Confirmar se o `user_id` da assinatura corresponde ao usuario correto.
- Aplicar correcao manual apenas quando o pagamento estiver confirmado e com cuidado para nao liberar acesso para usuario errado.

## Cliente atingiu limite mensal

- Explicar o limite do plano atual.
- Confirmar o uso mensal no dashboard/admin.
- Sugerir upgrade quando o volume esperado for maior.
- Nao resetar limite manualmente sem registrar o motivo.

## Cliente quer cancelar

- Orientar a acessar a area de assinatura.
- Orientar a abrir o portal Stripe pelo botao disponivel.
- Explicar que o cancelamento e feito pela area de assinatura e refletido apos o Stripe enviar o evento.
- Confirmar no admin/Supabase se o status mudou para cancelado.

## Cliente nao recebeu ebook

- Conferir se o lead foi salvo.
- Conferir se o e-mail esta correto.
- Conferir status no Resend.
- Conferir se houve erro em `lead_email_events`, quando disponivel.
- Reenviar manualmente se necessario.

## IA nao gerou resposta

- Verificar limite mensal do usuario.
- Verificar assinatura ativa.
- Verificar se `OPENAI_API_KEY` esta configurada no ambiente correto.
- Verificar logs da API de geracao.
- Conferir se a pergunta enviada nao esta vazia ou grande demais.
- Responder ao usuario com mensagem simples, sem detalhes tecnicos internos.
