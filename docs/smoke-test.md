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
| Copiar resposta | Clique em `Copiar`. | Mensagem de copia aparece e o texto fica disponivel para colar. |
| Verificar historico | Abra a aba `Historico`. | Resposta recem-gerada aparece uma unica vez. |
| Cadastrar cliente | Abra `Clientes`, preencha nome/status e salve. | Cliente aparece na lista e persiste em `customers`. |
| Alterar status | Mude o status de um cliente. | Novo status aparece na lista e atualizacao nao mostra erro. |
| Abrir `/plans` | Acesse a pagina de planos. | Planos aparecem sem erro. |
| Testar checkout sem env | Deixe `ASAAS_API_KEY` vazia, faca login e tente iniciar um plano em `/plans`. | API retorna erro amigavel de billing indisponivel, sem quebrar a pagina. |
| Testar webhook Asaas sandbox | Envie evento com `asaas-access-token` correto para `/api/asaas/webhook`. | Evento fica idempotente e `subscriptions` e atualizada conforme status do pagamento. |
| Testar webhook Kiwify | Envie payload de ebook/order bump para `/api/kiwify/webhook`. | Evento e tratado como aquisicao/funil, sem liberar assinatura recorrente. |
| Testar logout | Clique em `Sair`. | Sessao encerra e usuario vai para `/login`. |
| Testar login | Entre novamente com a mesma conta. | Dashboard abre e dados cadastrados continuam salvos. |
| Abrir no celular | Use viewport mobile ou aparelho real. | Fluxo principal continua legivel e botoes principais funcionam. |
| Abrir aba anonima | Acesse `/dashboard` sem sessao. | Usuario e redirecionado para `/login`. |
| Abrir `/debug/supabase` | Acesse com e sem sessao. | Pagina mostra status/booleanos, nao mostra tokens nem chaves completas. |
