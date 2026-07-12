# Roadmap da Versao 1.1 - AtendeZap IA

## Objetivo

Consolidar a operacao pos-MVP com validacao real, medicao minima e melhorias pequenas de ativacao, IA, billing e suporte, sem ampliar o escopo do produto.

## Fase 0 - Pre-kickoff

- Revisar analise pos-MVP.
- Confirmar ausencia de P0.
- Classificar backlog.
- Definir quais metricas ainda estao `nao disponivel` ou `nao medido`.

## Fase 1 - Validacao de ambiente

- Smoke autenticado em Preview/Producao.
- RLS real com dois usuarios.
- Stripe Checkout, Customer Portal e webhook assinado.
- OpenAI e Resend em ambiente final.
- GitHub Actions verde.

## Fase 2 - Medicao operacional

- Preencher checklist diario.
- Preencher relatorio semanal.
- Registrar funil de ativacao.
- Registrar suporte por categoria.
- Monitorar custo OpenAI em painel externo.

## Fase 3 - Melhorias pequenas

- Sprint 2: ajustar onboarding e primeira experiencia com base no risco documental do funil ainda nao medido.
- Sprint 2: reforcar dashboard de usuario novo, checklist, exemplos por nicho, copiar/salvar e tracking seguro de ativacao.
- Sprint 3: reforcar prompt, contexto por nicho, templates, biblioteca e feedback de qualidade sem ampliar o escopo.
- Ajustar copy se houver duvida recorrente.
- Ajustar prompt/templates novamente apenas se houver feedback agregado real.
- Melhorar relatorios internos apenas para operacao.
- Melhorar suporte/FAQ sem criar area complexa.

## Fase 4 - QA e fechamento

- Rodar validacoes obrigatorias.
- Revisar seguranca e eventos.
- Atualizar README e CHANGELOG.
- Criar relatorio final com dados reais ou marcacoes explicitas.
- Decidir se 1.1 libera nova campanha pequena ou se ainda fica em observacao.

## Sprint 3 - Pendencias apos Sprint 2

- Concluida com observacoes.
- Prompt da IA, orientacoes por nicho, templates, biblioteca, feedback e tracking seguro revisados.
- Smoke autenticado em Preview/Producao segue pendente.
- RLS real com dois usuarios segue pendente.
- Consolidacao de metricas reais de ativacao e qualidade segue pendente.
- Ajustes adicionais apenas se dados reais mostrarem gargalo.

## Sprint 4 - Pendencias de ambiente real

- Concluida localmente com observacoes.
- Billing, suporte, admin, eventos operacionais, custo OpenAI e relatorios internos revisados.
- Rodar smoke autenticado em Preview/Producao segue pendente.
- Validar RLS real com dois usuarios segue pendente.
- Aplicar migrations pendentes no Supabase real segue pendente.
- Validar Stripe Checkout, Customer Portal e webhook assinado no ambiente final segue pendente.
- Consolidar metricas reais de IA, templates, biblioteca, ativacao, billing, suporte e custo segue pendente.

## Fechamento da versao 1.1

- Usar `docs/version-1.1-final-readiness-checklist.md` para a decisao final.
- Nao liberar campanha grande antes de smoke real, RLS real, Stripe real/test mode e CI verde.
- Itens sem dados reais devem continuar marcados como `nao medido` ou `nao disponivel`.

## Fora do roadmap 1.1

- WhatsApp API.
- Envio automatico.
- CRM completo.
- App mobile.
- Automacoes complexas.
- BI avancado.
- Campanha grande.
