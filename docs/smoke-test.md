# Smoke test manual do MVP

Use este checklist antes de anunciar, subir deploy ou testar uma venda real.

| Item | Como testar | Resultado esperado |
| --- | --- | --- |
| Abrir `/` | Acesse a landing page. | Pagina carrega sem erro e o CTA principal aparece. |
| Abrir `/cadastro` | Clique em `Comecar agora` ou acesse direto. | Formulario de cadastro aparece. |
| Criar usuario novo | Preencha nome, e-mail e senha. | Conta e criada; se houver sessao imediata, vai para `/dashboard`; se confirmacao de e-mail estiver ativa, mostra aviso amigavel. |
| Confirmar `/dashboard` | Entre com usuario autenticado. | Dashboard protegido carrega; sem sessao, redireciona para `/login`. |
| Cadastrar negocio | Na aba de negocio, preencha dados minimos e salve. | Mensagem de sucesso aparece e dados persistem em `businesses`. |
| Gerar resposta | Cole pergunta real de cliente e clique em gerar. | API gera resposta, aplica limite mensal e salva em `generated_responses`. |
| Abrir `/plans` ou `/precos` | Acesse a pagina de planos. | Starter, Pro e Premium aparecem sem erro; Pro esta recomendado. |
| Testar checkout sem env | Deixe `STRIPE_SECRET_KEY` vazia, faca login e tente iniciar um plano. | API retorna erro amigavel de billing indisponivel, sem quebrar a pagina. |
| Testar checkout Stripe | Configure chaves e Price IDs de teste, clique em um plano. | Usuario vai para Stripe Checkout. |
| Testar webhook Stripe | Use Stripe CLI apontando para `/api/stripe/webhook`. | Evento fica idempotente e `subscriptions` e atualizada conforme status da assinatura. |
| Testar webhook Kiwify | Envie payload de ebook/order bump para `/api/kiwify/webhook`. | Evento e tratado como aquisicao/funil, sem liberar assinatura recorrente. |
| Testar Customer Portal | Com assinatura Stripe criada, clique em `Gerenciar assinatura` no dashboard. | Usuario abre o portal da Stripe. |
| Testar logout | Clique em `Sair`. | Sessao encerra e usuario vai para `/login`. |
| Abrir no celular | Use viewport mobile ou aparelho real. | Fluxo principal continua legivel e botoes principais funcionam. |
