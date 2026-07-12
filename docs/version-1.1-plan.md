# Plano da Versao 1.1 - AtendeZap IA

## Status

- status: planejada
- tipo: consolidacao operacional
- base de dados reais: insuficiente
- P0 confirmado: nenhum
- sprint 2: concluida com observacoes, focada em ativacao e experiencia inicial
- sprint 3: concluida com observacoes, focada em IA, templates, biblioteca e feedback de qualidade
- sprint 4: concluida com observacoes, focada em billing, admin, suporte, metricas e operacao

## Objetivo

Consolidar a operacao pos-MVP com validacao real, medicao minima e melhorias pequenas guiadas por evidencia. A 1.1 nao deve ampliar escopo nem criar uma nova categoria de produto.

## Principios

- Nao inventar metricas.
- Marcar dados ausentes como `nao disponivel` ou `nao medido`.
- Corrigir P0/P1 antes de qualquer melhoria.
- Preservar secrets no backend.
- Manter eventos sem pergunta completa, resposta completa, e-mail, telefone, token, secret ou dado de pagamento.
- Manter o produto como gerador de sugestoes para revisar, copiar e enviar manualmente.

## Escopo aprovado

- Validacao real de Preview/Producao.
- Validacao de Supabase RLS com dois usuarios.
- Validacao de Stripe Checkout, Customer Portal e webhook assinado.
- Validacao de OpenAI e Resend no ambiente final.
- Medicao do funil de ativacao.
- Categorizacao de suporte.
- Monitoramento de custo OpenAI.
- Melhorias pequenas de onboarding/copy com base em gargalos medidos.
- Melhorias pequenas de prompt/templates com base em feedback agregado.
- Relatorios internos simples para operacao.
- Documentacao atualizada.

## P0

- Nenhum P0 confirmado na analise atual.

## P1

- Smoke autenticado em Preview/Producao ainda precisa ser executado.
- RLS real com dois usuarios ainda precisa ser validado.
- Stripe Checkout, Customer Portal e webhook assinado ainda precisam ser validados no ambiente final.
- GitHub Actions precisa de confirmacao visual no GitHub quando aplicavel.
- Metricas reais de ativacao, suporte, billing, feedback e custo ainda nao estao consolidadas.

## P2

- Ajustar onboarding apos medir queda. Sprint 2 fez simplificacao preventiva com base no risco documental do funil ainda `nao medido`.
- Ajustar templates apos medir uso.
- Ajustar prompt apos revisar feedback agregado.
- Melhorar relatorios internos sem virar BI avancado.
- Melhorar suporte/FAQ com base em perguntas recorrentes.

## Entregas da Sprint 2

- Plano, smoke test e relatorio da Sprint 2 criados.
- Cadastro/login revisados com mensagens amigaveis e tracking seguro de ativacao.
- Onboarding inicial simplificado para dados essenciais.
- Dashboard de usuario novo reforcado com checklist de primeiros passos.
- Exemplos por nicho usados para preencher a mensagem sem gerar automaticamente.
- Campo de mensagem do cliente alinhado ao limite de 1200 caracteres da API.
- Copia/salvamento com feedback visual e eventos seguros.
- Admin existente passou a considerar agregados de ativacao.

## Pendencias movidas para Sprint 3

- Validar smoke autenticado real em Preview/Producao.
- Validar RLS real com dois usuarios.
- Consolidar metricas reais de ativacao antes de novas melhorias de produto.

## Entregas da Sprint 3

- Plano, smoke test e relatorio da Sprint 3 criados.
- Prompt da IA reforcado para respostas curtas, naturais e sem informacoes comerciais inventadas.
- Orientacao simples por nicho adicionada para delivery, restaurante, estetica, loja, assistencia tecnica, prestador de servico, autonomo e geral.
- Templates revisados para evitar promessas automaticas e confirmar apenas informacoes verificadas.
- Templates recomendados ganharam acao de usar como base editavel, sem envio automatico.
- Resposta gerada no dashboard ficou editavel antes de copiar ou salvar.
- Feedback negativo ganhou motivo categorizado.
- Admin passou a mostrar motivos negativos agregados para qualidade da IA.
- Tracking seguro da Sprint 3 adicionado sem pergunta completa, resposta completa, comentario livre, contato, token, secret ou dado de pagamento.

## Pendencias movidas para Sprint 4

- Validar smoke autenticado real em Preview/Producao.
- Validar RLS real com dois usuarios.
- Aplicar a migration da Sprint 3 no Supabase real.
- Consolidar metricas reais de qualidade da IA, uso de templates e ativacao antes de novas melhorias de produto.

## Entregas da Sprint 4

- Plano, smoke test, relatorio operacional, relatorio da sprint e checklist final da 1.1 criados.
- Eventos operacionais seguros adicionados: `checkout_completed`, `checkout_cancelled`, `billing_portal_opened`, `admin_dashboard_viewed`, `openai_usage_warning` e `stripe_webhook_received`.
- Migration da Sprint 4 criada para ampliar a allowlist de `app_events`.
- Suporte teve categorias principais alinhadas a acesso, IA, assinatura, limite mensal, feedback, bug e outro.
- Admin overview deixou de retornar texto livre completo de suporte e feedback no resumo operacional.
- Monitoramento de custo OpenAI documentado com estimativa por volume, sinais de abuso e investigacao.

## Pendencias para fechamento apos Sprint 4

- Validar smoke autenticado real em Preview/Producao.
- Validar RLS real com dois usuarios.
- Aplicar migrations pendentes no Supabase real, incluindo Sprint 3 e Sprint 4.
- Validar Stripe Checkout, Customer Portal e webhook assinado no ambiente final.
- Confirmar GitHub Actions verde.
- Consolidar metricas reais de ativacao, suporte, billing, feedback e custo OpenAI.

## Fora do escopo

- integracao direta com WhatsApp
- envio automatico de mensagens
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile
- BI avancado
- campanha grande
- escala sem dados

## Criterios para fechar 1.1

- `npm run check:secrets` passando.
- `npm run lint` passando.
- `npm run typecheck` passando.
- `npm run build` passando.
- `npm test` passando.
- `npm run validate` passando.
- Sem P0.
- Sem P1 grave aberto.
- Pendencias de ambiente real concluidas ou documentadas como bloqueio.
- README atualizado.
- CHANGELOG atualizado.

## Decisao de produto

A versao 1.1 deve ser uma consolidacao privada e operacional. Ela so deve liberar nova campanha pequena se o ambiente real estiver validado e se os relatorios tiverem dados agregados suficientes para acompanhar risco, custo e suporte.
