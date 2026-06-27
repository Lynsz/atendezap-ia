# Priorizacao de Bugs - Lancamento Pequeno AtendeZap IA

## P0

* Nenhum P0 confirmado nos documentos revisados.

Itens que devem ser P0 se aparecerem no smoke real ou na proxima rodada:

* cadastro quebrado
* login quebrado
* onboarding quebrado
* dashboard quebrado
* IA quebrada para usuario valido
* salvar resposta quebrado
* checkout quebrado
* webhook quebrado
* admin acessivel para usuario comum
* vazamento de secret
* vazamento de dado de usuario
* erro 500 recorrente em rota critica

## P1

* Nenhum P1 critico confirmado nos documentos revisados.
* Ajuste pequeno concluido: copy de configuracoes deixou de usar labels com "automaticamente" para evitar expectativa de automacao do produto.

Itens que devem ser P1 se aparecerem no smoke real ou na proxima rodada:

* botao principal morto
* erro tecnico bruto
* mobile inutilizavel
* onboarding confuso
* resposta da IA ruim ou perigosa
* pricing confuso
* limite mensal inconsistente
* suporte quebrado
* feedback quebrado
* RLS bloqueando proprio usuario
* RLS permitindo acesso indevido

## P2

* melhoria visual
* ajuste de texto
* refinamento de layout
* melhoria de performance nao critica
* melhoria de relatorio

## Decisao

* Nao ha P0/P1 real para corrigir agora.
* Proxima acao tecnica obrigatoria: smoke autenticado em Preview/Producao.
