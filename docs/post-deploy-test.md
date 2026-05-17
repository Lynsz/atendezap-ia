# Checklist pós-deploy

| Item | Rota | Como testar | Resultado esperado | Status |
| --- | --- | --- | --- | --- |
| Landing carrega | `/` | Abrir a URL de produção. | Página abre sem erro. | Pendente |
| Cadastro funciona | `/cadastro` | Criar usuário novo com e-mail e senha. | Cria usuário e redireciona para `/dashboard`. | Pendente |
| Login funciona | `/login` | Entrar com usuário existente. | Autentica e redireciona para `/dashboard`. | Pendente |
| Dashboard protegido | `/dashboard` | Abrir deslogado e depois logado. | Deslogado vai para `/login`; logado acessa. | Pendente |
| Debug Supabase | `/debug/supabase` | Abrir em produção. | Envs OK, getSession OK e plans select OK. | Pendente |
| Negócio salva | `/dashboard` | Cadastrar ou editar negócio e atualizar a página. | Negócio é salvo e recarrega após refresh. | Pendente |
| IA gera resposta | `/dashboard` | Colar pergunta e gerar resposta. | Resposta aparece e é salva no histórico. | Pendente |
| Histórico aparece | `/dashboard` | Abrir a aba Histórico. | Resposta gerada aparece no histórico. | Pendente |
| Cliente salva | `/dashboard` | Cadastrar cliente. | Cliente aparece na lista. | Pendente |
| Planos aparecem | `/plans` ou `/precos` | Abrir a página de planos. | Starter, Pro e Premium aparecem com valores e limites corretos. | Pendente |
| Checkout | `/plans` | Clicar nos botoes de plano. | Abre Stripe Checkout ou mostra fallback controlado. | Pendente |
| Logout | `/dashboard` | Clicar em sair. | Sai da conta e volta para `/login` ou `/`. | Pendente |
| Mobile | Rotas principais | Testar em largura de celular. | Sem overflow ou botão cortado. | Pendente |
