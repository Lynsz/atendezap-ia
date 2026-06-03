# Release Notes - AtendeZap IA 1.2 Draft

## Tipo

Minor release

## Objetivo

Melhorar ativacao, retencao, conversao e operacao com base nos aprendizados da versao 1.1.

## Planejado

- Validar provedores reais e RLS antes de nova escala.
- Melhorar ativacao e primeira resposta com base em dados agregados.
- Melhorar conversao para plano pago sem alterar o escopo do produto.
- Melhorar suporte recorrente com ajustes simples de copy, FAQ ou fluxo.
- Melhorar campanhas pequenas por nicho com UTMs e tracking seguro.

## Sprint 1

- Correcoes de estabilidade: tracking seguro reforcado para remover e-mail em valores genericos, telefone e WhatsApp.
- Melhorias de billing: checkout, portal, webhook, status de assinatura, pagamento falho e idempotencia revisados sem P0/P1 local encontrado.
- Melhorias de IA/limites: testes confirmam que limite excedido nao chama IA, falta de sessao bloqueia geracao e falha da IA nao persiste uso.
- Revisao de tracking seguro: eventos continuam sem pergunta, resposta, e-mail, telefone, token, secret ou dados de pagamento.
- Revisao de logs seguros: logs e eventos internos seguem sanitizados; health check coberto por teste.
- Documentacao atualizada: billing, limites, custo de IA, logs, backlog, auditoria e prontidao.

## Sprint 2

- Melhorias de onboarding para explicar o contexto do atendimento e o uso manual das respostas.
- Melhorias do dashboard inicial com foco em gerar a primeira resposta para cliente.
- Checklist de ativacao revisado com onboarding, primeira resposta, copiar, salvar, templates, favoritos e planos.
- Exemplos por nicho revisados para delivery, estetica, assistencia tecnica, loja, restaurante, prestador de servico e autonomo.
- Templates recomendados e respostas favoritas mantidos como atalhos no dashboard.
- Metricas de ativacao revisadas no admin protegido, com cards agregados e diagnostico simples.
- Documentacao de ativacao, retencao, e-mails, backlog, auditoria e prontidao atualizada.

## Melhorias esperadas

- Menos abandono entre cadastro, onboarding e primeira resposta.
- Mais usuarios copiando, salvando e reutilizando respostas.
- Mais clareza sobre pricing, limites e uso manual das respostas.
- Melhor decisao de campanha com dados agregados.

## Correcoes esperadas

- Bugs P0/P1 reais identificados durante validacao.
- Ajustes de billing, IA, suporte ou tracking que aparecerem em staging/producao.

## Seguranca

- Repositorio permanece privado.
- Sem secrets reais ou `.env.local` versionados.
- Logs e analytics continuam sem conteudo sensivel.
- Admin e RLS permanecem protegidos.

## Documentacao

- Plano 1.2.
- Roadmap 1.2.
- Backlog 1.2.
- Metricas de sucesso 1.2.
- Checklist de release 1.2.
- Plano de campanha pos-1.2.
- Plano e relatorio da Sprint 2.

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
