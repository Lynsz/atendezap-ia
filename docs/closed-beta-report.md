# Relatorio do Beta Fechado - AtendeZap IA

## Status

* parcialmente concluido

## Usuarios convidados

* nao disponivel

## Usuarios que criaram conta

* nao medido

## Usuarios que concluiram onboarding

* nao medido

## Usuarios que geraram resposta

* nao medido

## Usuarios que copiaram resposta

* nao medido

## Usuarios que salvaram resposta

* nao medido

## Usuarios que acessaram assinatura

* nao medido

## Usuarios que enviaram feedback

* nao medido

## Principais duvidas

* Nao ha consolidado real de duvidas de usuarios neste repositorio.
* Duvida esperada a validar em entrevista: se o app envia mensagens automaticamente pelo WhatsApp.
* Duvida esperada a validar em entrevista: se precisa conectar WhatsApp.
* Duvida esperada a validar em entrevista: como usar biblioteca e templates no fluxo diario.

## Principais reclamacoes

* Nao ha reclamacoes reais registradas no relatorio atual.
* Sem feedback real, nao classificar problema de IA, pricing ou suporte como confirmado.

## Pontos positivos

* Landing, dashboard e pricing comunicam que o usuario copia, ajusta e envia manualmente.
* Rotas criticas possuem validacao, mensagens amigaveis e protecao server-side documentada.
* Feedback e suporte existem com limites de caracteres e avisos para nao enviar dados sensiveis.
* Tracking beta seguro foi preparado sem salvar pergunta ou resposta completa.

## Bugs P0

* Nenhum P0 confirmado por dados reais do beta.

## Bugs P1

* Nenhum P1 confirmado por dados reais do beta.
* Risco P1 documentado: rotas/telas legadas de integracao WhatsApp, CRM e automacoes poderiam confundir usuarios se compartilhadas. Copy ajustada para explicitar modo demo/fora do escopo.

## Bugs P2

* Textos legados melhoraveis em areas fora do fluxo principal.
* Snapshot `supabase/schema.sql` desatualizado em relacao as migrations incrementais.

## Decisao preliminar

* corrigir e repetir beta

Motivo: nao ha metricas reais suficientes no repositorio para aprovar lancamento pequeno. O produto pode avancar apenas depois de smoke test real autenticado, consolidacao de feedbacks e confirmacao de nenhum P0/P1 critico aberto.
