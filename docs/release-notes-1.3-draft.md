# Release Notes - AtendeZap IA 1.3 Draft

## Tipo

Minor release

## Objetivo

Melhorar retencao, conversao, qualidade da IA e campanha com base nos aprendizados pos-1.2.

## Planejado

- Validar provedores reais, RLS, billing, tracking, admin e health check.
- Corrigir qualquer P0/P1 real antes de campanha.
- Melhorar ativacao ate primeira resposta, copia e salvamento.
- Melhorar retencao inicial com biblioteca, favoritos e templates recomendados.
- Preparar nova variacao pequena de campanha por nicho sem escala prematura.

## Melhorias esperadas

- Menos atrito entre cadastro, onboarding e primeira resposta.
- Mais reutilizacao de respostas salvas, favoritos e templates.
- Mais clareza no caminho para pricing e checkout.
- Mais confianca operacional antes de nova campanha.

## Correcoes esperadas

- Bugs P0/P1 encontrados em producao ou staging.
- Falhas de tracking, IA, billing, suporte ou admin que bloqueiem campanha.

## Seguranca

- Repositorio permanece privado.
- Sem `.env.local` ou secrets reais no Git.
- Logs, tracking e relatorios continuam sem conteudo completo de perguntas, respostas, mensagens, e-mails, pagamentos ou secrets.
- Admin e relatorios permanecem agregados.

## IA

- Revisao de qualidade apenas com feedback agregado.
- Limites e custo monitorados antes de aumentar trafego.
- Sem envio de pergunta/resposta completa para analytics.

## Retencao

- Biblioteca, favoritos e templates usados como fluxo leve de reutilizacao.
- E-mails de retorno avaliados apenas se houver regra operacional clara.

## Conversao

- CTA para planos revisado apenas com dados entre primeira resposta, pricing, checkout e assinatura.
- Pricing mantido sem mudanca grande ate haver evidencia.

## Campanhas

- Nova variacao pequena planejada para delivery.
- Tracking e UTM revisados.
- Sem escala antes de 72h de dados agregados, primeira resposta e estabilidade.

## Documentacao

- Plano 1.3.
- Criterios de entrada.
- Roadmap 1.3.
- Backlog 1.3.
- Metricas de sucesso.
- Checklist de release.
- Plano de campanha.
- Priorizacao.

## Fora do escopo

- integracao direta com WhatsApp
- CRM completo
- automacoes avancadas
- multiplos atendentes
- app mobile
