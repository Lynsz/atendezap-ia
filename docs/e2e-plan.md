# Plano de testes e2e

Este plano prepara a próxima etapa de Playwright ou ferramenta equivalente. A automação ainda deve usar ambiente de teste com Supabase, Stripe test mode e dados descartáveis.

## Fluxo principal

1. Abrir `/`.
2. Abrir `/ebook`.
3. Enviar lead válido.
4. Confirmar redirecionamento para `/ebook/obrigado`.
5. Criar conta em `/cadastro`.
6. Entrar no `/dashboard`.
7. Preencher onboarding/configuração do atendimento.
8. Gerar uma resposta com IA.
9. Abrir `/assinatura`.
10. Iniciar checkout Stripe test mode.
11. Simular ou receber webhook real via Stripe CLI.
12. Confirmar plano ativo no `/dashboard` e em `/assinatura`.

## Fluxo admin

1. Login com e-mail listado em `ADMIN_EMAILS`.
2. Abrir `/admin`.
3. Ver leads, assinaturas e métricas.
4. Exportar CSV pelo painel.
5. Login com usuário comum.
6. Confirmar que `/api/admin/overview` retorna `403`.
7. Confirmar que `/admin` mostra erro amigável sem dados administrativos.

## Fluxo segurança

1. Usuário sem login acessa `/dashboard` e é enviado para `/login?redirectTo=...`.
2. Usuário sem login chama `/api/ai/generate-response` e recebe `401`.
3. Usuário comum chama `/api/admin/overview` e recebe `403`.
4. Usuário A não vê negócios, respostas, clientes ou assinatura do usuário B.
5. Webhook Stripe em `/api/stripe/webhook` continua público para a Stripe, mas rejeita assinatura inválida.
6. Service role nunca aparece no bundle client.

## Dados necessários

- Usuário comum de teste.
- Usuário admin de teste em `ADMIN_EMAILS`.
- Produtos, prices e cupom configurados no Stripe test mode.
- Supabase com migrations aplicadas e RLS ativo.
