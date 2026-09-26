# Auditoria de seguranca - 2026-09-26

## Escopo analisado

- todos os arquivos rastreados e novos arquivos nao ignorados;
- todo o historico Git local, incluindo todas as refs disponiveis;
- variaveis de ambiente e uso de `NEXT_PUBLIC_*`;
- chaves, tokens, URLs com credenciais e blocos de chave privada;
- arquivos de credenciais, certificados, dumps e exports sensiveis;
- logs e mensagens de erro no navegador;
- dados demonstrativos versionados;
- politicas RLS, grants e funcoes `SECURITY DEFINER` das migrations Supabase;
- dependencias de producao via `npm audit`.

## Resultado

- Nenhum secret real reconhecivel permaneceu nos arquivos atuais ou no historico Git local.
- O unico valor antigo apontado pelo scanner era um placeholder didatico do webhook Kiwify; ele foi identificado por hash para evitar ampliar excecoes do detector.
- Dados demonstrativos foram trocados por enderecos `example.com` e telefones com DDD invalido `00`.
- Diagnosticos do Supabase deixaram de mostrar URL, comprimento de chave ou detalhes internos no navegador.
- Erros do dashboard agora usam mensagem generica para o usuario e nao enviam o objeto de erro ao console do navegador.
- As tabelas publicas analisadas possuem RLS e os recursos internos revogam acesso direto de `anon` e `authenticated` conforme o desenho atual.
- A funcao `public.handle_new_user()` ja revoga execucao de `public`, `anon` e `authenticated`; nenhuma migration adicional foi necessaria.
- As dependencias de producao foram atualizadas dentro das faixas compativeis e a auditoria passou sem vulnerabilidades conhecidas.

## Protecoes adicionadas

- scanner ampliado para provedores comuns, credenciais de banco, secrets genericos e variaveis secretas com prefixo `NEXT_PUBLIC_`;
- scanner de todo o historico Git (`npm run check:secrets:history`);
- bloqueio de nomes de arquivos tipicamente sensiveis;
- CI com historico completo, verificacao de secrets e auditoria de dependencias;
- regras adicionais no `.gitignore` para credenciais, certificados, bancos e dumps locais.

## Acao externa pendente

Na data desta auditoria, o repositorio remoto respondia publicamente. Alterar a visibilidade para **Private** precisa ser feito nas configuracoes do GitHub por uma pessoa com permissao administrativa. Depois da mudanca, revise GitHub Pages, forks, Actions, webhooks, colaboradores e chaves de deploy que possam ter sido afetados.

Mesmo apos tornar o repositorio privado, rotacione imediatamente qualquer segredo caso exista suspeita de que um valor real tenha sido publicado fora do repositorio ou antes desta auditoria.
