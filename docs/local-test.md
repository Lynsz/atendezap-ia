# Checklist de teste local

Use este roteiro para validar o MVP localmente antes de anunciar ou publicar uma nova versão.

| Etapa | Como testar | Resultado esperado |
| --- | --- | --- |
| 1. Iniciar app | Rodar `npm run dev` e abrir a URL informada pelo Next.js. | A aplicação carrega sem erro de compilação. |
| 2. Abrir landing | Acessar `/`. | Landing carrega e o CTA principal leva para o fluxo de cadastro/login. |
| 3. Abrir debug | Acessar `/debug/supabase`. | Página mostra status das envs e consultas sem exibir tokens ou chaves completas. |
| 4. Criar conta | Acessar `/cadastro`, informar nome, e-mail e senha. | Usuário é criado no Supabase Auth e redirecionado para `/dashboard`. |
| 5. Cadastrar negócio | No dashboard, abrir a aba de negócio e salvar ao menos o nome. | Negócio é salvo em `businesses` e continua após recarregar a página. |
| 6. Gerar resposta | Colar uma pergunta real do cliente e clicar em gerar. | API autentica o usuário, aplica limite mensal, gera resposta e salva no histórico. |
| 7. Verificar histórico | Abrir a aba Histórico. | A resposta recém-gerada aparece uma única vez com pergunta, resposta, tipo e data. |
| 8. Cadastrar cliente | Abrir a aba Clientes e criar um lead. | Cliente aparece na lista e pode ter status/observações alterados. |
| 9. Abrir planos | Acessar `/plans`. | Planos aparecem; se checkout não estiver configurado, o botão mostra fallback amigável. |
| 10. Testar logout/login | Sair da conta e entrar novamente por `/login`. | Login redireciona para `/dashboard` e os dados persistidos continuam visíveis. |
| 11. Testar no celular | Abrir as rotas principais em viewport mobile. | Não há overflow horizontal, botão cortado ou formulário inutilizável. |
| 12. Testar aba anônima | Abrir `/dashboard` sem sessão. | Usuário deslogado é enviado para `/login`. |

Dependências externas para o teste completo: schema do Supabase aplicado, RLS ativo, envs `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` configuradas, e opcionalmente `OPENAI_API_KEY` e URLs da Kiwify.
