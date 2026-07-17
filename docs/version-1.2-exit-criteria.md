# Critérios de Saída — Versão 1.2 AtendeZap IA

A versão 1.2 só pode ser fechada quando:

* nenhum P0 estiver aberto
* P1 críticos estiverem corrigidos ou documentados
* CI remoto estiver verde
* build estiver passando
* testes estiverem passando
* Supabase/RLS estiver validado com dois usuários reais
* OpenAI estiver validada no ambiente final
* Stripe Checkout, portal e webhook estiverem validados
* admin e APIs admin estiverem protegidos
* logs estiverem seguros
* eventos não salvarem dados sensíveis
* fluxo principal funcionar de ponta a ponta com sessão real
* onboarding estiver claro segundo evidência de uso
* dashboard orientar o primeiro uso
* IA não inventar informações comerciais
* limites bloquearem antes da OpenAI e falhas não consumirem uso
* templates e biblioteca funcionarem
* pricing estiver claro e checkout continuar seguro
* métricas essenciais tiverem fonte, período e definição documentados
* custo OpenAI estiver medido e sob controle
* smoke test autenticado estiver aprovado

Itens sem evidência devem ser marcados como `não medido`; não podem ser considerados aprovados por ausência de incidente.
