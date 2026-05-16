# Checklist de produção

| Item | Como testar | Resultado esperado | Status |
| --- | --- | --- | --- |
| Landing carrega | Abrir `/`. | Página inicial abre sem erro. | Pendente |
| Cadastro funciona | Abrir `/cadastro` e criar conta. | Conta é criada ou mostra confirmação de e-mail. | Pendente |
| Login funciona | Abrir `/login` e entrar. | Usuário vai para `/dashboard`. | Pendente |
| Dashboard protegido | Abrir `/dashboard` sem sessão. | Redireciona para `/login`. | Pendente |
| Negócio salva | Preencher e salvar dados do negócio. | Registro aparece ao recarregar o dashboard. | Pendente |
| IA gera resposta | Gerar resposta com pergunta real. | Resposta aparece sem erro. | Pendente |
| Histórico salva | Abrir aba histórico após gerar. | Resposta aparece uma vez. | Pendente |
| Cliente salva | Cadastrar cliente. | Cliente aparece na lista. | Pendente |
| Limite mensal bloqueia | Simular plano no limite. | API retorna bloqueio 403 amigável. | Pendente |
| Planos carregam | Abrir `/plans`. | Planos aparecem. | Pendente |
| Checkout abre ou fallback aparece | Testar botão de plano. | Abre Kiwify ou mostra `Checkout em configuração`. | Pendente |
| Debug Supabase OK | Abrir `/debug/supabase`. | Status não revela tokens nem chaves completas. | Pendente |
| Logout funciona | Clicar em `Sair`. | Usuário volta para `/login`. | Pendente |
| Mobile básico OK | Testar rotas principais no celular. | Sem overflow horizontal, botão cortado ou formulário inutilizável. | Pendente |
