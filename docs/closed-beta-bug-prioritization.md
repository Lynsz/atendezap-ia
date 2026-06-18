# Priorizacao de Bugs do Beta Fechado - AtendeZap IA

## P0

Corrigir imediatamente e bloquear lancamento se qualquer item abaixo aparecer:

* cadastro quebrado
* login quebrado
* onboarding quebrado
* dashboard quebrado
* IA quebrada para usuario valido
* salvar resposta quebrado
* checkout quebrado
* webhook quebrado
* admin acessivel para usuario comum
* vazamento de secret/dado sensivel
* erro 500 recorrente em rota critica

Status atual:

* nenhum P0 confirmado por dados reais do beta

## P1

Corrigir antes de lancamento pequeno se impactar ativacao, IA, billing, suporte, feedback, mobile ou seguranca:

* botao principal morto
* mensagem de erro tecnica para usuario
* mobile inutilizavel
* onboarding confuso
* resposta da IA ruim ou perigosa
* pricing confuso
* limite mensal inconsistente
* suporte quebrado
* feedback quebrado
* RLS bloqueando proprio usuario
* RLS permitindo acesso indevido

Status atual:

* nenhum P1 confirmado por dados reais do beta
* risco P1 mitigado: copy de telas legadas ajustada para nao sugerir integracao WhatsApp, CRM completo ou envio automatico

## P2

Tratar depois dos P0/P1 ou durante polimento controlado:

* melhoria visual
* texto melhoravel
* UX refinavel
* ajustes cosmeticos
* pequenas melhorias de performance

Status atual:

* snapshot `supabase/schema.sql` desatualizado em relacao as migrations
* consolidacao real de metricas do beta ainda ausente
* relatorios de smoke test solicitados nao existem com o nome exato no repositorio
