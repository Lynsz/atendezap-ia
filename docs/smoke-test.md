# Smoke test manual do MVP

Use este checklist antes de anunciar, subir deploy ou testar uma venda real.

| Item | Como testar | Resultado esperado |
| --- | --- | --- |
| Abrir `/` | Acesse a landing page. | Página carrega sem erro e o botão `Começar agora` aparece. |
| Abrir `/cadastro` | Clique em `Começar agora` ou acesse direto. | Formulário de cadastro aparece. |
| Criar usuário novo | Preencha nome, e-mail e senha. | Conta é criada; se houver sessão imediata, vai para `/dashboard`; se confirmação de e-mail estiver ativa, mostra aviso amigável. |
| Confirmar `/dashboard` | Entre com usuário autenticado. | Dashboard protegido carrega; sem sessão, redireciona para `/login`. |
| Cadastrar negócio | Na aba de negócio, preencha dados mínimos e salve. | Mensagem de sucesso aparece e dados persistem em `businesses`. |
| Gerar resposta | Cole pergunta real de cliente e clique em gerar. | API gera resposta, aplica limite mensal e salva em `generated_responses`. |
| Copiar resposta | Clique em `Copiar`. | Mensagem de cópia aparece e o texto fica disponível para colar. |
| Verificar histórico | Abra a aba `Histórico`. | Resposta recém-gerada aparece uma única vez. |
| Cadastrar cliente | Abra `Clientes`, preencha nome/status e salve. | Cliente aparece na lista e persiste em `customers`. |
| Alterar status | Mude o status de um cliente. | Novo status aparece na lista e atualização não mostra erro. |
| Abrir `/plans` | Acesse a página de planos. | Planos aparecem sem erro. |
| Testar checkout sem env | Deixe URLs Kiwify vazias e abra `/plans`. | Botão fica desabilitado ou mostra `Checkout em configuração`, sem quebrar navegação. |
| Testar logout | Clique em `Sair`. | Sessão encerra e usuário vai para `/login`. |
| Testar login | Entre novamente com a mesma conta. | Dashboard abre e dados cadastrados continuam salvos. |
| Abrir no celular | Use viewport mobile ou aparelho real. | Fluxo principal continua legível e botões principais funcionam. |
| Abrir aba anônima | Acesse `/dashboard` sem sessão. | Usuário é redirecionado para `/login`. |
| Abrir `/debug/supabase` | Acesse com e sem sessão. | Página mostra status/booleanos, não mostra tokens nem chaves completas. |
